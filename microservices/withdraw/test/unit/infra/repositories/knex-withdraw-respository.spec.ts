import { Knex } from 'knex';
import { KnexWithdrawRepository } from '@/infra/repositories/knex-withdraw.repository';
import { knexMock } from '@test/mocks/knex.mock';
import { withdrawEntityMock } from '@test/mocks/withdraw-entity.mock';

describe('KnexRepository', () => {
  const repository = new KnexWithdrawRepository(knexMock as unknown as Knex);

  it('should be able to create a withdraw', async () => {
    const result = await repository.createWithdraw(withdrawEntityMock);

    expect(result).toEqual(withdrawEntityMock);
    expect(knexMock).toHaveBeenCalledWith('withdraws');
  });
});
