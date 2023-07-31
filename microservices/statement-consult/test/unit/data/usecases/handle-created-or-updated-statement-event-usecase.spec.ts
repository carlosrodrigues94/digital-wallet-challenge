import { HandleCreatedOrUpdatedStatementEventUseCase } from '@/data/usecases/handle-created-or-updated-statement-event.usecase';
import { StatementEntity } from '@/domain/entities/statement.entity';
import { statementEntityMock } from '@test/mocks/statement-entity.mock';
import { statementRepositoryMock } from '@test/mocks/statement-repository.mock';

describe('HandleCreatedOrUpdatedStatementEventUseCase', () => {
  const usecase = new HandleCreatedOrUpdatedStatementEventUseCase(
    statementRepositoryMock,
  );

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a statement if does not exists', async () => {
    const params: StatementEntity = {
      amount: statementEntityMock.amount,
      createdAt: statementEntityMock.createdAt,
      id: statementEntityMock.id,
      updatedAt: statementEntityMock.updatedAt,
      userId: statementEntityMock.userId,
    };

    jest
      .spyOn(statementRepositoryMock, 'findOneStatement')
      .mockImplementationOnce(() => Promise.resolve(undefined));
    await usecase.execute(params);

    expect(
      statementRepositoryMock.insertOrUpdateStatement,
    ).toHaveBeenCalledWith(params);

    expect(
      statementRepositoryMock.insertOrUpdateStatement,
    ).toHaveBeenCalledTimes(1);
  });

  it('should validate if existent statement is newer comparing to the statement from event', async () => {
    const params: StatementEntity = {
      amount: statementEntityMock.amount,
      createdAt: statementEntityMock.createdAt,
      id: statementEntityMock.id,
      updatedAt: new Date('2021-05-05 00:00:00').toISOString(),
      userId: statementEntityMock.userId,
    };

    const newerStatementInDatabase = {
      ...statementEntityMock,
      updatedAt: new Date('2021-05-05 00:01:00').toISOString(),
    };

    jest
      .spyOn(statementRepositoryMock, 'findOneStatement')
      .mockImplementationOnce(() => Promise.resolve(newerStatementInDatabase));

    await usecase.execute(params);

    expect(
      statementRepositoryMock.insertOrUpdateStatement,
    ).not.toHaveBeenCalledWith(params);
  });

  it('should validate if existent statement in event is newer comparing to database', async () => {
    const params: StatementEntity = {
      amount: statementEntityMock.amount,
      createdAt: statementEntityMock.createdAt,
      id: statementEntityMock.id,
      updatedAt: new Date('2021-05-05 00:01:00').toISOString(),
      userId: statementEntityMock.userId,
    };

    const olderStatementInDatabase = {
      ...statementEntityMock,
      updatedAt: new Date('2021-05-05 00:00:00').toISOString(),
    };

    jest
      .spyOn(statementRepositoryMock, 'findOneStatement')
      .mockImplementationOnce(() => Promise.resolve(olderStatementInDatabase));

    await usecase.execute(params);

    expect(
      statementRepositoryMock.insertOrUpdateStatement,
    ).toHaveBeenCalledWith(params);
  });

  it('should validate if existent statement does not have updatedAt', async () => {
    const params: StatementEntity = {
      amount: statementEntityMock.amount,
      createdAt: statementEntityMock.createdAt,
      id: statementEntityMock.id,
      updatedAt: new Date('2021-05-05 00:01:00').toISOString(),
      userId: statementEntityMock.userId,
    };

    const olderStatementInDatabase = {
      ...statementEntityMock,
      updatedAt: null,
    };

    jest
      .spyOn(statementRepositoryMock, 'findOneStatement')
      .mockImplementationOnce(() => Promise.resolve(olderStatementInDatabase));

    await usecase.execute(params);

    expect(
      statementRepositoryMock.insertOrUpdateStatement,
    ).toHaveBeenCalledWith(params);
  });

  it('should validate if existent statement have updatedAt and the params not', async () => {
    const params: StatementEntity = {
      amount: statementEntityMock.amount,
      createdAt: statementEntityMock.createdAt,
      id: statementEntityMock.id,
      updatedAt: null,
      userId: statementEntityMock.userId,
    };

    const newerStatementInDatabase = {
      ...statementEntityMock,
      updatedAt: '2020-05-05 00:00:00',
    };

    jest
      .spyOn(statementRepositoryMock, 'findOneStatement')
      .mockImplementationOnce(() => Promise.resolve(newerStatementInDatabase));

    await usecase.execute(params);

    expect(
      statementRepositoryMock.insertOrUpdateStatement,
    ).not.toHaveBeenCalledWith(params);
  });
});
