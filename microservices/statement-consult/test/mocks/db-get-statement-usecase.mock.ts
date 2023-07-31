import { GetStatementUsecase } from '@/domain/usecases/get-statement.usecase';
import { statementEntityMock } from './statement-entity.mock';

export const dbGetStatementUseCaseMock: GetStatementUsecase = {
  execute: jest.fn(() => Promise.resolve(statementEntityMock)),
};
