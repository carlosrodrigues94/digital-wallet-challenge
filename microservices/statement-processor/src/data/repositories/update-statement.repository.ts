import { StatementEntity } from '@/domain/entities/statement.entity';

export interface UpdateStatementRepository {
  updateStatement(
    id: string,
    params: Partial<Omit<StatementEntity, 'id'>>,
  ): Promise<StatementEntity>;
}
