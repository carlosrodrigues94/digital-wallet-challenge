import { depositEntityMock } from './deposit-entity.mock';

export const knexMock = jest.fn(() => ({
  insert: jest.fn(() => ({
    returning: jest.fn(() => [depositEntityMock]),
  })),
}));
