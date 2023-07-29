import { DepositEntity } from '@/domain/entities/deposit.entity';

export interface DepositCreatedEventEmitter {
  emitDepositCreatedEvent(params: DepositEntity): void;
}
