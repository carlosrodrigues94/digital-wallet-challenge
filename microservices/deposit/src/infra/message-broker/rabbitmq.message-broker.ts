import { Events } from '@/data/enums/events';
import { DepositCreatedEventEmitter } from '@/data/events/emit-deposit-created.event';
import { DepositEntity } from '@/domain/entities/deposit.entity';
import { ClientProxy } from '@nestjs/microservices';

export class RabbitMQMessageBroker implements DepositCreatedEventEmitter {
  constructor(private readonly messageBroker: ClientProxy) {}

  emitDepositCreatedEvent(params: DepositEntity) {
    this.messageBroker.emit(Events.DEPOSIT_CREATED, params);
  }
}
