import { StatementUpdatedEventEmitter } from '../events/emit-statement-updated.event';
import { WithdrawEntity } from '@/domain/entities/withdraw.entity';
import { CreateWithdrawRepository } from '../repositories/create-withdraw.repository';
import { HandleCreatedEventUseCase } from '@/domain/usecases/handle-created-event.usecase';
import { UpdateStatementRepository } from '../repositories/update-statement.repository';
import { FindOneStatementRepository } from '../repositories/find-one-statement.repository';
import { CreateStatementRepository } from '../repositories/create-statement.repository';
import { GenerateUniqueIdService } from '../services/generate-unique-id.service';

export class HandleCreatedWithdrawEventUseCase
  implements HandleCreatedEventUseCase<WithdrawEntity>
{
  constructor(
    private readonly messageBroker: StatementUpdatedEventEmitter,
    private readonly withdrawRepository: CreateWithdrawRepository,
    private readonly statementRepository: FindOneStatementRepository &
      UpdateStatementRepository &
      CreateStatementRepository,
    private readonly uniqueIdService: GenerateUniqueIdService,
  ) {}
  async execute({
    sourceTransactionId,
    amount,
    createdAt,
    id,
    source,
    userId,
  }: WithdrawEntity) {
    await this.withdrawRepository.createWithdraw({
      id,
      amount,
      createdAt,
      sourceTransactionId,
      userId,
      source,
    });

    const statement = await this.statementRepository.findOneStatement({
      userId,
    });

    const updated = await this.statementRepository.updateStatement(
      statement.id,
      {
        amount: statement.amount - amount,
        updatedAt: new Date().toISOString(),
      },
    );

    this.messageBroker.emitStatementUpdatedEvent(updated);
  }
}
