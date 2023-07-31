import { StatementEntity } from '@/domain/entities/statement.entity';
import { HandleEventUseCase } from '@/domain/usecases/handle-event.usecase';
import { UpdateStatementRepository } from '@/data/repositories/insert-or-update-statement.repository';
import { FindOneStatementRepository } from '@/data/repositories/find-one-statement.repository';
import { CreateStatementRepository } from '@/data/repositories/create-statement.repository';

export class HandleCreatedOrUpdatedStatementEventUseCase
  implements HandleEventUseCase<StatementEntity>
{
  constructor(
    private readonly statementRepository: UpdateStatementRepository &
      FindOneStatementRepository &
      CreateStatementRepository,
  ) {}

  async execute({ amount, createdAt, id, updatedAt, userId }: StatementEntity) {
    const statement = await this.statementRepository.findOneStatement({
      userId,
    });

    if (!statement) {
      await this.statementRepository.createStatement({
        id,
        amount,
        createdAt,
        updatedAt,
        userId,
      });
      return;
    }
    const isNotUpdated = !statement.updatedAt;
    const isOlder = new Date(statement.updatedAt) < new Date(updatedAt);

    if (isNotUpdated || isOlder) {
      await this.statementRepository.updateStatement(id, {
        amount,
        createdAt,
        updatedAt,
        userId,
      });
      return;
    }
  }
}
