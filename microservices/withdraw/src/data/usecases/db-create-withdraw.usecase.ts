import {
  CreateWithdrawUseCase,
  CreateWithdrawUseCaseParams,
} from '@/domain/usecases/create-withdraw.usecase';
import { CreateWithdrawRepository } from '@/data/repositories/create-withdraw.repository';
import { GenerateUniqueIdService } from '@/data/services/generate-unique-id.service';
import { WithdrawEntity } from '@/domain/entities/withdraw.entity';
import { WithdrawCreatedEventEmitter } from '@/data/events/emit-withdraw-created.event';
import { FindOneStatementRepository } from '@/data/repositories/find-one-statement.repository';
import { ApplicationException } from '../exceptions/application.exception';

export class DBCreateWithdrawUsecase implements CreateWithdrawUseCase {
  constructor(
    private readonly messageBroker: WithdrawCreatedEventEmitter,
    private readonly withdrawRepository: CreateWithdrawRepository,
    private readonly uniqueIdService: GenerateUniqueIdService,
    private readonly statementRepository: FindOneStatementRepository,
  ) {}
  async execute(params: CreateWithdrawUseCaseParams): Promise<WithdrawEntity> {
    const statement = await this.statementRepository.findOneStatement({
      userId: params.userId,
    });

    if (!statement) {
      throw new ApplicationException('User statement not found', 404);
    }

    if (statement.amount < params.amount) {
      throw new ApplicationException(
        'Withdraw not authorized: Insufficient funds',
        404,
      );
    }

    const withdraw = await this.withdrawRepository.createWithdraw({
      id: this.uniqueIdService.generate(),
      amount: params.amount,
      createdAt: new Date().toISOString(),
      sourceTransactionId: params.sourceTransactionId,
      source: params.source,
      userId: params.userId,
    });

    this.messageBroker.emitWithdrawCreatedEvent(withdraw);

    return withdraw;
  }
}
