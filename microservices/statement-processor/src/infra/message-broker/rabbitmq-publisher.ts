import { RabbitMQConfig } from '@/config/rabbitmq.config';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { connect, Connection, Channel } from 'amqplib';

import { StatementCreatedEventEmitter } from '@/data/events/emit-statement-created.event';
import { StatementUpdatedEventEmitter } from '@/data/events/emit-statement-updated.event';
import { StatementEntity } from '@/domain/entities/statement.entity';
import { PublisherEvents } from '@/data/enums/events.enum';
import { UniqueIdService } from '../services/generate-unique-id.service';

type Events = StatementCreatedEventEmitter & StatementUpdatedEventEmitter;

@Injectable()
export class RabbitMQPublisher implements OnModuleInit, Events {
  private readonly rabbitMQUrl: string;
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

    this.onModuleInit();
  }

  async onModuleInit() {
    this.connection = await this.tryConnectionOrRetry();
    this.channel = await this.connection.createChannel();
  }

  async publishToExchange<T>(params: {
    event: PublisherEvents;
    exchange: string;
    message: T;
  }): Promise<void> {
    const { event, exchange, message } = params;
    const messageId = this.uniqueIdService.generate();

    const messageBuffer = Buffer.from(
      JSON.stringify({
        message,
        event,
        messageId,
      }),
    );
    await this.channel.assertExchange(exchange, this.exchangeType, {
      durable: false,
    });

    this.channel.publish(exchange, this.routingKey, messageBuffer);
  }

  async close() {
    await this.channel.close();
    await this.connection.close();
  }

  emitStatementCreatedEvent(params: StatementEntity): void {
    this.publishToExchange<StatementEntity>({
      event: PublisherEvents.STATEMENT_CREATED_EVENT,
      exchange: this.exchange,
      message: params,
    });
  }

  emitStatementUpdatedEvent(params: StatementEntity): void {
    this.publishToExchange<StatementEntity>({
      event: PublisherEvents.STATEMENT_UPDATED_EVENT,
      exchange: this.exchange,
      message: params,
    });
  }

  private async tryConnectionOrRetry(): Promise<Connection> {
    let retryConnectionMaxAttempts = 0;

    if (retryConnectionMaxAttempts === this.retryConnectionMaxAttempts) {
      return;
    }

    try {
      retryConnectionMaxAttempts = retryConnectionMaxAttempts + 1;
      const connection = await connect(this.rabbitMQUrl).catch(
        this.tryConnectionOrRetry,
      );
      retryConnectionMaxAttempts = 0;
      console.info('[RabbitMQ] Publisher Connected');
      return connection;
    } catch (err) {
      console.info('[RabbitMQ] Publisher connection error');
      await new Promise((resolve) => setTimeout(resolve, 3000));
      return this.tryConnectionOrRetry();
    }
  }
}
