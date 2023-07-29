import { Events } from '@/data/enums/events';
import { WithdrawCreatedEventEmitter } from '@/data/events/emit-withdraw-created.event';
import { WithdrawEntity } from '@/domain/entities/withdraw.entity';
import { ClientProxy } from '@nestjs/microservices';

export class RabbitMQMessageBroker implements WithdrawCreatedEventEmitter {
  constructor(private readonly messageBroker: ClientProxy) {}

  emitWithdrawCreatedEvent(params: WithdrawEntity) {
    this.messageBroker.emit(Events.WITHDRAW_CREATED, params);
  }
}
