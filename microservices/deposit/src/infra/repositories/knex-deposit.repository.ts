import {
  CreateDepositRepository,
  CreateDepositRepositoryParams,
} from '@/data/repositories/create-deposit.repository';
import { Knex } from 'knex';

export class KnexDepositRepository implements CreateDepositRepository {
  protected tableName = 'deposits';

  constructor(private readonly knex: Knex) {}

  async createDeposit(params: CreateDepositRepositoryParams): Promise<any> {
    const [deposit] = await this.knex(this.tableName)
      .insert(params)
      .returning('*');

    return deposit;
  }
}
