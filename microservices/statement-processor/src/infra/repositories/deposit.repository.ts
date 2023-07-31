import { CreateDepositRepository } from '@/data/repositories/create-deposit.repository';
import { DepositEntity } from '@/domain/entities/deposit.entity';
import { Knex } from 'knex';

export class KnexDepositRepository implements CreateDepositRepository {
  protected tableName = 'deposits';

  constructor(private readonly knex: Knex) {}

  async createDeposit(data: DepositEntity): Promise<DepositEntity> {
    const [deposit] = await this.knex(this.tableName)
      .insert(data)
      .returning('*');

    return deposit;
  }
}
