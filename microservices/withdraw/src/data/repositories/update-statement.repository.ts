import { StatementEntity } from '@/domain/entities/statement.entity';

export type UpdateStatementRepositoryParams = Omit<StatementEntity, 'id'>;

export type UpdateStatementRepositoryResult = StatementEntity;

export interface UpdateStatementRepository {
  updateStatement(
    id: string,
    params: UpdateStatementRepositoryParams,
  ): Promise<void>;
}
