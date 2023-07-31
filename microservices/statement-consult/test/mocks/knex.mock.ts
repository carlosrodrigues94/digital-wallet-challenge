import { Knex } from 'knex';

export const knexMock = {
  select: jest.fn().mockReturnThis(),
  from: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(),
  onConflict: jest.fn().mockReturnThis(),
  merge: jest.fn().mockReturnThis(),
  returning: jest.fn().mockReturnThis(),
  table: jest.fn().mockReturnThis(),
} as unknown as Knex;
