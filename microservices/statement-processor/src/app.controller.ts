import { Controller } from '@nestjs/common';
import { Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';

export enum Queues {
  DEPOSIT_CREATED = 'deposit.created.event',
  WITHDRAW_CREATED = 'withdraw.created.event',
  WITHDRAWAL_CREATED = 'withdrawal.created.event',
}

@Controller()
export class AppController {
  @MessagePattern(Queues.DEPOSIT_CREATED)
  handleDepositCreated(data: number[], @Ctx() context: RmqContext) {
    console.log('MESSAGE RECEIVED --------------->>>>: ', data);
    console.log('MESSAGE RECEIVED CONTEXT -------->>>: ', context.getPattern());
    return;
  }

  @MessagePattern(Queues.WITHDRAWAL_CREATED)
  handleWithdrawalCreated(data: number[], @Ctx() context: RmqContext) {
    console.log('MESSAGE RECEIVED --------------->>>>: ', data);
    console.log('MESSAGE RECEIVED CONTEXT -------->>>: ', context.getPattern());
    return;
  }
}
