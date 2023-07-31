import { KnexStatementRepository } from '@/infra/repositories/knex-statement.repository';
import { knexMock } from '@test/mocks/knex.mock';
import { statementEntityMock } from '@test/mocks/statement-entity.mock';

describe('KnexStatementRepository', () => {
  const repository = new KnexStatementRepository(knexMock);

  it('should find one statement', async () => {
    jest
      .spyOn(knexMock, 'returning')
      .mockImplementationOnce(
        () => Promise.resolve([statementEntityMock]) as any,
      );
    const result = await repository.findOneStatement({
      userId: 'user-id',
    });

    expect(result).toEqual(statementEntityMock);
    expect(knexMock.from).toHaveBeenCalledWith('statements');
    expect(knexMock.where).toHaveBeenCalledWith({ userId: 'user-id' });
  });

  it('should insert or update one statement', async () => {
    await repository.insertOrUpdateStatement({
      ...statementEntityMock,
    });

    expect(knexMock.table).toHaveBeenCalledWith('statements');
    expect(knexMock.insert).toHaveBeenCalledWith(statementEntityMock);
  });
});
