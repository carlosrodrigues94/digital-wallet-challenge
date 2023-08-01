import { RabbitMQConfig } from '@/config/rabbitmq.config';
import { ConsumerEvents } from '@/data/enums/events.enum';
import { HandleCreatedDepositEventUseCaseFactory } from '@/presentation/factories/handle-created-deposit-event-usecase.factory';
import { HandleCreatedWithdrawEventUseCaseFactory } from '@/presentation/factories/handle-created-withdraw-event-usecase.factory';
import { connect, Connection, Channel, ConsumeMessage } from 'amqplib';

export class RabbitMQConsumer {
  private readonly rabbitMQUrl: string;
  private readonly queueName = 'statement-processor';
  private readonly routingKey = '';
  private readonly exchangeType = 'fanout';
  private retryConnectionMaxAttempts = 5;

  private connection: Connection;
  private channel: Channel;

  constructor(
    private readonly rabbitMQConfig: RabbitMQConfig,
    private readonly handleCreatedDepositEventUseCaseFactory: HandleCreatedDepositEventUseCaseFactory,
    private readonly handleCreatedWithdrawEventUseCaseFactory: HandleCreatedWithdrawEventUseCaseFactory,
  ) {
    const { host, password, port, user } = this.rabbitMQConfig;
    this.rabbitMQUrl = `amqp://${user}:${password}@${host}:${port}`;
  }

  async startConsumer() {
    this.connection = await this.tryConnectionOrRetry();
    this.channel = await this.connection.createChannel();

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
    let data: any;
    try {
      data = JSON.parse(message.content.toString());
      this.channel.ack(message);
    } catch (error) {
      this.channel.nack(message);
    }

    if (!data.event) return;

    switch (data.event) {
      case ConsumerEvents.DEPOSIT_CREATED_EVENT: {
        const usecase = this.handleCreatedDepositEventUseCaseFactory.build();
        await usecase.execute(data.message);
        break;
      }
      case ConsumerEvents.WITHDRAW_CREATED_EVENT: {
        const usecase = this.handleCreatedWithdrawEventUseCaseFactory.build();
        await usecase.execute(data.message);
        break;
      }
    }
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
      console.info('[RabbitMQ] Consumer Connected');
      return connection;
    } catch (err) {
      console.info('[RabbitMQ] Consumer connection error');
      await new Promise((resolve) => setTimeout(resolve, 3000));
      return this.tryConnectionOrRetry();
    }
  }

  async close() {
    await this.channel.close();
    await this.connection.close();
  }
}
