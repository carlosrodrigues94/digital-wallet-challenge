import { CreateStatementRepository } from '@/data/repositories/create-statement.repository';
import { FindOneStatementRepository } from '@/data/repositories/find-one-statement.repository';
import { UpdateStatementRepository } from '@/data/repositories/update-statement.repository';
import { StatementEntity } from '@/domain/entities/statement.entity';
import { Knex } from 'knex';

type Repository = FindOneStatementRepository &
  UpdateStatementRepository &
  CreateStatementRepository;

export class KnexStatementRepository implements Repository {
  protected tableName = 'statements';

  constructor(private readonly knex: Knex) {}
  async createStatement(params: StatementEntity): Promise<StatementEntity> {
    const [statement] = await this.knex(this.tableName)
      .insert(params)
      .returning('*');

    return statement;
  }

  async findOneStatement(params: { userId: string }): Promise<StatementEntity> {
    const [statement] = await this.knex
      .select('*')
      .from(this.tableName)
      .where(params)
      .returning('*');

    return statement;
  }
  async updateStatement(
    id: string,
    params: Partial<Omit<StatementEntity, 'id'>>,
  ): Promise<StatementEntity> {
    const [result] = await this.knex(this.tableName)
      .update(params)
      .where({ id })
      .returning('*');

    return result;
  }
}
