import { Injectable } from '@nestjs/common';
import { DBCreateWithdrawUsecase } from '@/data/usecases/db-create-withdraw.usecase';
import { UniqueIdService } from '@/infra/services/generate-unique-id.service';
import { RabbitMQMessageBroker } from '@/infra/message-broker/rabbitmq.message-broker';
import { KnexWithdrawRepository } from '@/infra/repositories/knex-withdraw.repository';

@Injectable()
export class DbCreateWithdrawUseCaseFactory {
  constructor(
    private readonly messageBroker: RabbitMQMessageBroker,
    private readonly knexWithdrawRepository: KnexWithdrawRepository,
  ) {}

  build() {
    return new DBCreateWithdrawUsecase(
      this.messageBroker,
      this.knexWithdrawRepository,
      new UniqueIdService(),
    );
  }
}
