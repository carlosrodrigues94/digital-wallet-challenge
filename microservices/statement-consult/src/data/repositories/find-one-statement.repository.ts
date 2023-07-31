import { StatementEntity } from '@/domain/entities/statement.entity';

export type FindOneStatementRepositoryParams = {
  userId: string;
};

export type FindOneStatementRepositoryResult = StatementEntity | undefined;

export interface FindOneStatementRepository {
  findOneStatement(
    params: FindOneStatementRepositoryParams,
  ): Promise<FindOneStatementRepositoryResult>;
}
