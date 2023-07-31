import { StatementEntity } from '@/domain/entities/statement.entity';

export interface FindOneStatementRepository {
  findOneStatement(params: { userId: string }): Promise<StatementEntity>;
}
