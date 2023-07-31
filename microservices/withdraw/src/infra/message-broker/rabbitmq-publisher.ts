import { RabbitMQConfig } from '@/config/rabbitmq.config';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { connect, Connection, Channel } from 'amqplib';

import { WithdrawCreatedEventEmitter } from '@/data/events/emit-withdraw-created.event';
import { WithdrawEntity } from '@/domain/entities/withdraw.entity';
import { PublisherEvents } from '@/data/enums/events';

@Injectable()
export class RabbitMQPublisher
  implements OnModuleInit, WithdrawCreatedEventEmitter
{
  private readonly rabbitMQUrl: string;
  private readonly exchange: string;
  private exchangeType = 'fanout';
  private routingKey = '';
  private retryConnectionMaxAttempts = 5;

  private connection: Connection;
  private channel: Channel;

  constructor(private readonly rabbitMQConfig: RabbitMQConfig) {
    const { host, password, port, user } = this.rabbitMQConfig;
    this.rabbitMQUrl = `amqp://${user}:${password}@${host}:${port}`;
    this.exchange = this.rabbitMQConfig.exchanges.wallet;

    this.onModuleInit();
  }

  async onModuleInit() {
    this.connection = await this.tryConnectionOrRetry();
    this.channel = await this.connection.createChannel();
  }

  emitWithdrawCreatedEvent(params: WithdrawEntity): void {
    this.publishToExchange<WithdrawEntity>({
      event: PublisherEvents.WITHDRAW_CREATED_EVENT,
      exchange: this.exchange,
      message: params,
    });
  }

  private async publishToExchange<T>(params: {
    event: PublisherEvents;
    exchange: string;
    message: T;
  }): Promise<void> {
    const { event, exchange, message } = params;

    const messageBuffer = Buffer.from(JSON.stringify({ message, event }));
    await this.channel.assertExchange(exchange, this.exchangeType, {
      durable: false,
    });

    this.channel.publish(exchange, this.routingKey, messageBuffer);
  }

  private async tryConnectionOrRetry(): Promise<Connection> {
    let retryConnectionMaxAttempts = 0;

    if (retryConnectionMaxAttempts === this.retryConnectionMaxAttempts) {
      console.error('Could not connect to RabbitMQ');
      return;
    }

    try {
      retryConnectionMaxAttempts = retryConnectionMaxAttempts + 1;
      const connection = await connect(this.rabbitMQUrl).catch(
        this.tryConnectionOrRetry,
      );
      retryConnectionMaxAttempts = 0;
      return connection;
    } catch (err) {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      return this.tryConnectionOrRetry();
    }
  }

  async close() {
    await this.channel.close();
    await this.connection.close();
  }
}
