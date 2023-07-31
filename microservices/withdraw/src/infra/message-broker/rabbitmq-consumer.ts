import { RabbitMQConfig } from '@/config/rabbitmq.config';
import { ConsumerEvents } from '@/data/enums/events';
import { HandleCreatedOrUpdatedStatementEventUseCaseFactory } from '@/presentation/factories/handle-created-or-updated-statement-event-usecase.factory';
import { connect, Connection, Channel, ConsumeMessage } from 'amqplib';
import { RedisMessageRepository } from '../repositories/redis-message.repository';

export class RabbitMQConsumer {
  private readonly rabbitMQUrl: string;
  private readonly queueName = 'withdraw';
  private readonly routingKey = '';
  private readonly exchangeType = 'fanout';
  private retryConnectionMaxAttempts = 5;
  private connection: Connection;
  private channel: Channel;

  constructor(
    private readonly rabbitMQConfig: RabbitMQConfig,
    private readonly redisMessageRepository: RedisMessageRepository,
    private readonly handleCreateOrUpdatedStatementEventUseCaseFactory: HandleCreatedOrUpdatedStatementEventUseCaseFactory,
  ) {
    const { host, password, port, user } = this.rabbitMQConfig;
    this.rabbitMQUrl = `amqp://${user}:${password}@${host}:${port}`;

    this.redisMessageRepository.connect();
  }

  async startConsumer() {
    this.connection = await this.tryConnectionOrRetry();
    this.channel = await this.connection.createChannel();

    this.redisMessageRepository.connect();

    await this.channel.assertExchange(
      this.rabbitMQConfig.exchanges.wallet,
      this.exchangeType,
      { durable: false },
    );

    const assertQueue = await this.channel.assertQueue(this.queueName, {
      durable: false,
    });

    this.channel.bindQueue(
      assertQueue.queue,
      this.rabbitMQConfig.exchanges.wallet,
      this.routingKey,
    );

    this.channel.consume(assertQueue.queue, this.handleMessage.bind(this), {
      noAck: false,
    });
  }

  async handleMessage(message: ConsumeMessage | null) {
    if (!message) return;
    let data: { messageId: string; event: string; message: any };
    try {
      data = JSON.parse(message.content.toString());
      this.channel.ack(message);
    } catch (error) {
      this.channel.nack(message);
    }

    if (!data.event) return;

    const isMessageProcessed =
      await this.redisMessageRepository.isMessageProcessed({
        consumerName: this.queueName,
        messageId: data.messageId,
      });

    if (!isMessageProcessed) {
      switch (data.event) {
        case ConsumerEvents.STATEMENT_CREATED_EVENT: {
          const usecase =
            this.handleCreateOrUpdatedStatementEventUseCaseFactory.build();
          await usecase.execute(data.message);
          break;
        }
        case ConsumerEvents.STATEMENT_UPDATED_EVENT: {
          const usecase =
            this.handleCreateOrUpdatedStatementEventUseCaseFactory.build();
          await usecase.execute(data.message);
          break;
        }
      }

      await this.redisMessageRepository.markMessageProcessed({
        consumerName: this.queueName,
        messageId: data.messageId,
      });
    }
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
