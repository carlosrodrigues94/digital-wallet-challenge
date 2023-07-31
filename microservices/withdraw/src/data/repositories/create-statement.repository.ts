import { StatementEntity } from '@/domain/entities/statement.entity';

export type CreateStatementRepositoryParams = StatementEntity;

export type CreateStatementRepositoryResult = StatementEntity;

export interface CreateStatementRepository {
  createStatement(
    params: CreateStatementRepositoryParams,
  ): Promise<StatementEntity>;
}
