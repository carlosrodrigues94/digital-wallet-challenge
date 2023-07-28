import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientMqtt } from '@nestjs/microservices';

@Controller('/withdrawals')
export class AppController {
  constructor(
    @Inject('WITHDRAWAL_CLIENT_PUBLISHER') private readonly client: ClientMqtt,
  ) {
    this.client.connect();
  }

  @Post('/')
  async createWithdrawal(@Body() body: Record<string, string | number>) {
    console.log('CHEGOU NO WITHDRAWAL CONTROLLER ');
    this.client.emit('withdrawal.created.event', body).pipe();
    return { ...body };
  }
}
