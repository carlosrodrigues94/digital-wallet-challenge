import { Knex } from 'knex';
import { CreateWithdrawRepository } from '@/data/repositories/create-withdraw.repository';
import { WithdrawEntity } from '@/domain/entities/withdraw.entity';

export class KnexWithdrawRepository implements CreateWithdrawRepository {
  protected tableName = 'withdraws';

  constructor(private readonly knex: Knex) {}

  async createWithdraw(data: WithdrawEntity): Promise<WithdrawEntity> {
    const [withdraw] = await this.knex(this.tableName)
      .insert(data)
      .returning('*');

    return withdraw;
  }
}
