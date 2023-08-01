import { StatementCreatedEventEmitter } from '@/data/events/emit-statement-created.event';
import { StatementUpdatedEventEmitter } from '@/data/events/emit-statement-updated.event';

export const messageBrokerMock: StatementCreatedEventEmitter &
  StatementUpdatedEventEmitter = {
  emitStatementCreatedEvent: jest.fn(),
  emitStatementUpdatedEvent: jest.fn(),
};
