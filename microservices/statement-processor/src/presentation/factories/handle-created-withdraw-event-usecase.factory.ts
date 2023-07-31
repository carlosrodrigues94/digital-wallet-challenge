import { HandleCreatedWithdrawEventUseCase } from '@/data/usecases/handle-created-withdraw-event.usecase.usecase';
import { RabbitMQPublisher } from '@/infra/message-broker/rabbitmq-publisher';
import { KnexStatementRepository } from '@/infra/repositories/statement.repository';
import { KnexWithdrawRepository } from '@/infra/repositories/withdraw.repository';
import { UniqueIdService } from '@/infra/services/generate-unique-id.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HandleCreatedWithdrawEventUseCaseFactory {
  constructor(
    private readonly messageBroker: RabbitMQPublisher,
    private readonly knexWithdrawRepository: KnexWithdrawRepository,
    private readonly knexStatementRepository: KnexStatementRepository,
    private readonly uniqueIdService: UniqueIdService,
  ) {}

  build() {
    return new HandleCreatedWithdrawEventUseCase(
      this.messageBroker,
      this.knexWithdrawRepository,
      this.knexStatementRepository,
      this.uniqueIdService,
    );
  }
}
