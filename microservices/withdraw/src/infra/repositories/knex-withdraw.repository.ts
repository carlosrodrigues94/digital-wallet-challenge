import { Knex } from 'knex';

import {
  CreateWithdrawRepository,
  CreateWithdrawRepositoryParams,
  CreateWithdrawRepositoryResult,
} from '@/data/repositories/create-withdraw.repository';

export class KnexWithdrawRepository implements CreateWithdrawRepository {
  protected tableName = 'withdraws';
  constructor(private readonly knex: Knex) {}

  async createWithdraw(
    params: CreateWithdrawRepositoryParams,
  ): Promise<CreateWithdrawRepositoryResult> {
    const [withdraw] = await this.knex(this.tableName)
      .insert(params)
      .returning('*');

    return withdraw;
  }
}
