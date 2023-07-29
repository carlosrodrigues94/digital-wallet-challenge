import { DepositCreatedEventEmitter } from '@/data/events/emit-deposit-created.event';

export const messageBrokerMock: DepositCreatedEventEmitter = {
  emitDepositCreatedEvent: jest.fn(),
};
