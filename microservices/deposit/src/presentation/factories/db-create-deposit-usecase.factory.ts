import { Injectable } from '@nestjs/common';
import { DBCreateDepositUsecase } from '@/data/usecases/db-create-deposit.usecase';
import { KnexDepositRepository } from '@/infra/repositories/knex-deposit.repository';
import { DepositCreatedEventEmitter } from '@/data/events/emit-deposit-created.event';
import { CreateDepositUseCase } from '@/domain/usecases/create-deposit.usecase';
import { UniqueIdService } from '@/infra/services/generate-unique-id.service';

@Injectable()
export class DbCreateDepositUseCaseFactory {
  constructor(
    private readonly messageBroker: DepositCreatedEventEmitter,
    private readonly knexDepositRepository: KnexDepositRepository,
  ) {}

  build(): CreateDepositUseCase {
    return new DBCreateDepositUsecase(
      this.messageBroker,
      this.knexDepositRepository,
      new UniqueIdService(),
    );
  }
}
