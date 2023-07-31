import { StatementEntity } from '@/domain/entities/statement.entity';

export interface CreateStatementRepository {
  createStatement(params: StatementEntity): Promise<StatementEntity>;
}
