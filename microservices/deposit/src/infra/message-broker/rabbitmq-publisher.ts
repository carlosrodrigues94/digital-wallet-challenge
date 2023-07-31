import { RabbitMQConfig } from '@/config/rabbitmq.config';
import { Injectable } from '@nestjs/common';
import { connect, Connection, Channel } from 'amqplib';

import { DepositCreatedEventEmitter } from '@/data/events/emit-deposit-created.event';
import { DepositEntity } from '@/domain/entities/deposit.entity';
import { PublisherEvents } from '@/data/enums/events';
import { UniqueIdService } from '@/infra/services/generate-unique-id.service';

@Injectable()
export class RabbitMQPublisher implements DepositCreatedEventEmitter {
  private rabbitMQUrl: string;
  private readonly exchange: string;
  private exchangeType = 'fanout';
  private routingKey = '';
  private retryConnectionMaxAttempts = 5;
  private connection: Connection;
  private channel: Channel;

  constructor(
    private readonly rabbitMQConfig: RabbitMQConfig,
    private readonly uniqueIdService: UniqueIdService,
  ) {
    const { host, password, port, user } = this.rabbitMQConfig;
    this.rabbitMQUrl = `amqp://${user}:${password}@${host}:${port}`;
    this.exchange = this.rabbitMQConfig.exchanges.wallet;

    this.connect();
  }

  async publishToExchange<T>(params: {
    event: PublisherEvents;
    exchange: string;
    message: T;
  }): Promise<void> {
    const { event, exchange, message } = params;

    const messageBuffer = Buffer.from(
      JSON.stringify({
        message,
        event,
        messageId: this.uniqueIdService.generate(),
      }),
    );
    await this.channel.assertExchange(exchange, this.exchangeType, {
      durable: false,
    });

    this.channel.publish(exchange, this.routingKey, messageBuffer);
  }

  emitDepositCreatedEvent(params: DepositEntity): void {
    this.publishToExchange<DepositEntity>({
      event: PublisherEvents.DEPOSIT_CREATED_EVENT,
      exchange: this.exchange,
      message: params,
    });
  }

  private async connect() {
    this.connection = await this.tryConnectionOrRetry();
    this.channel = await this.connection.createChannel();
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
      console.log('RABBITMQ SUCCESS =>');

      return connection;
    } catch (err) {
      console.error('RABBITMQ ERROR=>', err);
      await new Promise((resolve) => setTimeout(resolve, 3000));
      return this.tryConnectionOrRetry();
    }
  }
}
