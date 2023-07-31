import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '@/presentation/controllers/app.controller';
import { dbGetStatementUseCaseMock } from '@test/mocks/db-get-statement-usecase.mock';
import { DbGetStatementUseCaseFactory } from '@/presentation/factories/db-get-statement-usecase.factory';
import { statementEntityMock } from '@test/mocks/statement-entity.mock';

describe('AppController', () => {
  const factory = {
    build: () => dbGetStatementUseCaseMock,
  } as unknown as DbGetStatementUseCaseFactory;

  const controller = new AppController(factory);

  it('should get the statement successfully', async () => {
    const result = await controller.getStatement('user-id');

    expect(result).toEqual(statementEntityMock);
  });
});
