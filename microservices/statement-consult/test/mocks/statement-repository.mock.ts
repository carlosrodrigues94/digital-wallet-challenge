import { FindOneStatementRepository } from '@/data/repositories/find-one-statement.repository';
import { statementEntityMock } from './statement-entity.mock';
import { InsertOrUpdateStatementRepository } from '@/data/repositories/insert-or-update-statement.repository';

export const statementRepositoryMock: FindOneStatementRepository &
  InsertOrUpdateStatementRepository = {
  findOneStatement: jest.fn(() => Promise.resolve(statementEntityMock)),
  insertOrUpdateStatement: jest.fn(() => Promise.resolve()),
};
