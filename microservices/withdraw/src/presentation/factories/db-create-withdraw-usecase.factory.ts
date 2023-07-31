import { Injectable } from '@nestjs/common';
import { DBCreateWithdrawUsecase } from '@/data/usecases/db-create-withdraw.usecase';
import { UniqueIdService } from '@/infra/services/generate-unique-id.service';
import { KnexWithdrawRepository } from '@/infra/repositories/knex-withdraw.repository';
import { KnexStatementRepository } from '@/infra/repositories/knex-statement.repository';
import { RabbitMQPublisher } from '@/infra/message-broker/rabbitmq-publisher';

@Injectable()
export class DbCreateWithdrawUseCaseFactory {
  constructor(
    private readonly messageBroker: RabbitMQPublisher,
    private readonly knexWithdrawRepository: KnexWithdrawRepository,
    private readonly uniqueIdService: UniqueIdService,
    private readonly statementRepository: KnexStatementRepository,
  ) {}

  build() {
    return new DBCreateWithdrawUsecase(
      this.messageBroker,
      this.knexWithdrawRepository,
      this.uniqueIdService,
      this.statementRepository,
    );
  }
}
