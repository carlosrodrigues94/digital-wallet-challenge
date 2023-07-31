import { StatementEntity } from '@/domain/entities/statement.entity';

export interface StatementCreatedEventEmitter {
  emitStatementCreatedEvent(params: StatementEntity): void;
}
