import { StatementEntity } from '@/domain/entities/statement.entity';

export type FindOneStatementRepositoryResult = StatementEntity;
export type FindOneStatementRepositoryParams = { userId: string };

export interface FindOneStatementRepository {
  findOneStatement(
    params: FindOneStatementRepositoryParams,
  ): Promise<FindOneStatementRepositoryResult>;
}
