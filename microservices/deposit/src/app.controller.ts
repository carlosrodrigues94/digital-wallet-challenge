import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientMqtt, ClientProxy } from '@nestjs/microservices';

export enum Queues {
  DEPOSIT_CREATED = 'deposit.created.event',
  WITHDRAW_CREATED = 'withdraw.created.event',
}

@Controller('deposits')
export class AppController {
  constructor(
    @Inject('DEPOSIT_QUEUE_PUBLISHER') private readonly client: ClientMqtt,
  ) {
    this.client.connect();
  }

  @Post()
  async deposit(@Body() body: Record<string, string | number>) {
    try {
      this.client.emit(Queues.DEPOSIT_CREATED, body);
      return { ...body, queueName: Queues.DEPOSIT_CREATED };
    } catch (err) {
      return err;
    }
  }
}
