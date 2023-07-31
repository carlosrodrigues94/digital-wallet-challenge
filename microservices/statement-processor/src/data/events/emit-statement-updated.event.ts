import { StatementEntity } from '@/domain/entities/statement.entity';

export interface StatementUpdatedEventEmitter {
  emitStatementUpdatedEvent(params: StatementEntity): void;
}
