import { CreateStatementRepository } from '@/data/repositories/create-statement.repository';
import { FindOneStatementRepository } from '@/data/repositories/find-one-statement.repository';
import { UpdateStatementRepository } from '@/data/repositories/update-statement.repository';
import { statementEntityMock } from './statement-entity.mock';

export const statementRepositoryMock: FindOneStatementRepository &
  UpdateStatementRepository &
  CreateStatementRepository = {
  createStatement: jest.fn(() => Promise.resolve(statementEntityMock)),
  findOneStatement: jest.fn(() => Promise.resolve(statementEntityMock)),
  updateStatement: jest.fn(() => Promise.resolve()),
};
