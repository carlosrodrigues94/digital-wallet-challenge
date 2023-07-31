import { Injectable } from '@nestjs/common';
import { DBCreateDepositUsecase } from '@/data/usecases/db-create-deposit.usecase';
import { KnexDepositRepository } from '@/infra/repositories/knex-deposit.repository';
import { CreateDepositUseCase } from '@/domain/usecases/create-deposit.usecase';
import { UniqueIdService } from '@/infra/services/generate-unique-id.service';
import { RabbitMQPublisher } from '@/infra/message-broker/rabbitmq-publisher';

@Injectable()
export class DbCreateDepositUseCaseFactory {
  constructor(
    private readonly messageBroker: RabbitMQPublisher,
    private readonly knexDepositRepository: KnexDepositRepository,
    private readonly uniqueIdService: UniqueIdService,
  ) {}

  build(): CreateDepositUseCase {
    return new DBCreateDepositUsecase(
      this.messageBroker,
      this.knexDepositRepository,
      this.uniqueIdService,
    );
  }
}
