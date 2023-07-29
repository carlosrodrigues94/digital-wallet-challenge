import { withdrawEntityMock } from './withdraw-entity.mock';

export const knexMock = jest.fn(() => ({
  insert: jest.fn(() => ({
    returning: jest.fn(() => [withdrawEntityMock]),
  })),
}));
