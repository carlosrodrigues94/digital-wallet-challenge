import { WithdrawEntity } from '@/domain/entities/withdraw.entity';

export interface WithdrawCreatedEventEmitter {
  emitWithdrawCreatedEvent(params: WithdrawEntity): void;
}
