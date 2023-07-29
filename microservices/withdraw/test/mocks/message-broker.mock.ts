import { WithdrawCreatedEventEmitter } from '@/data/events/emit-withdraw-created.event';

export const messageBrokerMock: WithdrawCreatedEventEmitter = {
  emitWithdrawCreatedEvent: jest.fn(),
};
