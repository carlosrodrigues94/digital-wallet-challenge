import { HandleCreatedEventUseCase } from '@/domain/usecases/handle-created-event.usecase';
import { CreateDepositRepository } from '@/data/repositories/create-deposit.repository';
import { DepositEntity } from '@/domain/entities/deposit.entity';
import { StatementUpdatedEventEmitter } from '@/data/events/emit-statement-updated.event';
import { FindOneStatementRepository } from '@/data/repositories/find-one-statement.repository';
import { UpdateStatementRepository } from '@/data/repositories/update-statement.repository';
import { CreateStatementRepository } from '@/data/repositories/create-statement.repository';
import { GenerateUniqueIdService } from '../services/generate-unique-id.service';
import { StatementCreatedEventEmitter } from '../events/emit-statement-created.event';

export class HandleCreatedDepositEventUseCase
  implements HandleCreatedEventUseCase<DepositEntity>
{
  constructor(
    private readonly messageBroker: StatementUpdatedEventEmitter &
      StatementCreatedEventEmitter,
    private readonly depositRepository: CreateDepositRepository,
    private readonly statementRepository: FindOneStatementRepository &
      UpdateStatementRepository &
      CreateStatementRepository,
    private readonly uniqueIdService: GenerateUniqueIdService,
  ) {}
  async execute({
    id,
    amount,
    createdAt,
    source,
    sourceDescription,
    sourceTransactionId,
    userId,
  }: DepositEntity) {
    const data = {
      id,
      amount,
      createdAt,
      source,
      sourceDescription,
      sourceTransactionId,
      userId,
    };

    await this.depositRepository.createDeposit(data);

    const statement = await this.findOrCreateStatementIfNotExists({ userId });

    const updated = await this.statementRepository.updateStatement(
      statement.id,
      {
        amount: statement.amount + amount,
        updatedAt: new Date().toISOString(),
      },
    );

    this.messageBroker.emitStatementUpdatedEvent(updated);
  }

  private async findOrCreateStatementIfNotExists(params: { userId: string }) {
    const statement = await this.statementRepository.findOneStatement({
      userId: params.userId,
    });

    if (!statement) {
      const result = await this.statementRepository.createStatement({
        amount: 0,
        createdAt: new Date().toISOString(),
        id: this.uniqueIdService.generate(),
        updatedAt: null,
        userId: params.userId,
      });

      this.messageBroker.emitStatementCreatedEvent(result);
      return result;
    }

    return statement;
  }
}
