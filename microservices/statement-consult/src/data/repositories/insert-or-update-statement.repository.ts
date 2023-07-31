import { StatementEntity } from '@/domain/entities/statement.entity';

export type InsertOrUpdateStatementRepositoryParams =
  Partial<StatementEntity> & {
    id: string;
  };

export interface InsertOrUpdateStatementRepository {
  insertOrUpdateStatement(
    params: InsertOrUpdateStatementRepositoryParams,
  ): Promise<void>;
}
