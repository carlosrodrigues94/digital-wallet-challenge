import { StatementEntity } from '@/domain/entities/statement.entity';

export interface GetStatementUsecase {
  execute(payload: { userId: string }): Promise<StatementEntity | undefined>;
}
