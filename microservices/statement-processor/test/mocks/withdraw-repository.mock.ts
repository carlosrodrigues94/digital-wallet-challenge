import { CreateWithdrawRepository } from '@/data/repositories/create-withdraw.repository';
import { withdrawEntityMock } from './withdraw-entity.mock';

export const withdrawRepositoryMock: CreateWithdrawRepository = {
  createWithdraw: jest.fn(() => Promise.resolve(withdrawEntityMock)),
};
