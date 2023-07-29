import { CreateDepositRepository } from '@/data/repositories/create-deposit.repository';
import { depositEntityMock } from './deposit-entity.mock';

export const depositRepositoryMock: CreateDepositRepository = {
  createDeposit: jest.fn(() => Promise.resolve(depositEntityMock)),
};
