import {
  CreateDepositUseCase,
  CreateDepositUseCaseParams,
} from '@/domain/usecases/create-deposit.usecase';

import { CreateDepositRepository } from '@/data/repositories/create-deposit.repository';
import { DepositCreatedEventEmitter } from '@/data/events/emit-deposit-created.event';
import { GenerateUniqueIdService } from '@/data/services/generate-unique-id.service';

export class DBCreateDepositUsecase implements CreateDepositUseCase {
  constructor(
    private readonly messageBroker: DepositCreatedEventEmitter,
    private readonly depositRepository: CreateDepositRepository,
    private readonly uniqueIdService: GenerateUniqueIdService,
  ) {}
  async execute({
    amount,
    source,
    sourceDescription,
    sourceTransactionId,
    userId,
  }: CreateDepositUseCaseParams) {
    const result = await this.depositRepository.createDeposit({
      amount,
      source,
      sourceDescription,
      sourceTransactionId,
      createdAt: new Date().toISOString(),
      userId,
      id: this.uniqueIdService.generate(),
    });

    this.messageBroker.emitDepositCreatedEvent(result);

    return result;
  }
}
