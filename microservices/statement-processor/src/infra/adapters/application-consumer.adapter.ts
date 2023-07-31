import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { RabbitMQConsumer } from '@/infra/message-broker/rabbitmq-consumer';

@Injectable()
export class ApplicationConsumerAdapter implements OnApplicationBootstrap {
  constructor(private readonly rabbitMQConsumerService: RabbitMQConsumer) {}

  async onApplicationBootstrap() {
    await this.rabbitMQConsumerService.startConsumer();
  }
}
