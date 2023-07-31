import { HandleCreatedDepositEventUseCase } from '@/data/usecases/handle-created-deposit-event.usecase.usecase';
import { RabbitMQPublisher } from '@/infra/message-broker/rabbitmq-publisher';
import { KnexDepositRepository } from '@/infra/repositories/deposit.repository';
import { KnexStatementRepository } from '@/infra/repositories/statement.repository';
import { UniqueIdService } from '@/infra/services/generate-unique-id.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HandleCreatedDepositEventUseCaseFactory {
  constructor(
    private readonly messageBroker: RabbitMQPublisher,
    private readonly knexDepositRepository: KnexDepositRepository,
    private readonly knexStatementRepository: KnexStatementRepository,
    private readonly uniqueIdService: UniqueIdService,
  ) {}

  build() {
    return new HandleCreatedDepositEventUseCase(
      this.messageBroker,
      this.knexDepositRepository,
      this.knexStatementRepository,
      this.uniqueIdService,
    );
  }
}
