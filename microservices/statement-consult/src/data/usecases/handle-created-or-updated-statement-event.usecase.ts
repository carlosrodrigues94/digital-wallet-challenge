import { StatementEntity } from '@/domain/entities/statement.entity';
import { HandleEventUseCase } from '@/domain/usecases/handle-event.usecase';
import { InsertOrUpdateStatementRepository } from '@/data/repositories/insert-or-update-statement.repository';
import { FindOneStatementRepository } from '@/data/repositories/find-one-statement.repository';

export class HandleCreatedOrUpdatedStatementEventUseCase
  implements HandleEventUseCase<StatementEntity>
{
  constructor(
    private readonly statementRepository: InsertOrUpdateStatementRepository &
      FindOneStatementRepository,
  ) {}

  async execute(params: StatementEntity) {
    const statement = await this.statementRepository.findOneStatement({
      userId: params.userId,
    });

    if (!statement || !statement.updatedAt) {
      await this.upsertStatement(params);
      return;
    }

    if (!params.updatedAt && statement.updatedAt) {
      return;
    }

    if (
      params.updatedAt &&
      statement.updatedAt &&
      new Date(params.updatedAt) < new Date(statement.updatedAt)
    ) {
      return;
    }

    await this.upsertStatement(params);
  }

  async upsertStatement({
    id,
    amount,
    createdAt,
    updatedAt,
    userId,
  }: StatementEntity): Promise<void> {
    await this.statementRepository.insertOrUpdateStatement({
      id,
      amount,
      createdAt,
      updatedAt,
      userId,
    });
  }
}
