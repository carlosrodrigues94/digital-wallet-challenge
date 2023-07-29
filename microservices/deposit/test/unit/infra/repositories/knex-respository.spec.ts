import { Knex } from 'knex';
import { KnexDepositRepository } from '@/infra/repositories/knex-deposit.repository';
import { depositEntityMock } from '@test/mocks/deposit-entity.mock';
import { knexMock } from '@test/mocks/knex.mock';

describe('KnexRepository', () => {
  const repository = new KnexDepositRepository(knexMock as unknown as Knex);

  it('should be able to create a deposit', async () => {
    const result = await repository.createDeposit(depositEntityMock);

    expect(result).toEqual(depositEntityMock);
    expect(knexMock).toHaveBeenCalledWith('deposits');
  });
});
