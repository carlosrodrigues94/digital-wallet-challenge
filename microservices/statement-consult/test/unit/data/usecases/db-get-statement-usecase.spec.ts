import { ApplicationException } from '@/data/exceptions/application.exception';
import { DBGetStatementUsecase } from '@/data/usecases/db-get-statement.usecase';
import { statementEntityMock } from '@test/mocks/statement-entity.mock';
import { statementRepositoryMock } from '@test/mocks/statement-repository.mock';

describe('DBGetStatementUseCase', () => {
  const usecase = new DBGetStatementUsecase(statementRepositoryMock);

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should get the statement successfully', async () => {
    const result = await usecase.execute({
      userId: 'user-id',
    });

    expect(result).toEqual(statementEntityMock);
    expect(statementRepositoryMock.findOneStatement).toHaveBeenCalledWith({
      userId: 'user-id',
    });
  });

  it('should throw an error with status code 404 if statement does not exists', async () => {
    const spyFindOneStatement = jest.spyOn(
      statementRepositoryMock,
      'findOneStatement',
    );

    spyFindOneStatement.mockImplementationOnce(() =>
      Promise.resolve(undefined),
    );

    await expect(usecase.execute({ userId: 'user-id' })).rejects.toThrow(
      new ApplicationException('Statement not found', 404),
    );
    expect(statementRepositoryMock.findOneStatement).toHaveBeenCalledWith({
      userId: 'user-id',
    });
  });
});
