import { Knex } from 'knex';
import {
  InsertOrUpdateStatementRepositoryParams,
  InsertOrUpdateStatementRepository,
} from '@/data/repositories/insert-or-update-statement.repository';
import { StatementEntity } from '@/domain/entities/statement.entity';
import {
  FindOneStatementRepository,
  FindOneStatementRepositoryParams,
} from '@/data/repositories/find-one-statement.repository';

type Repository = InsertOrUpdateStatementRepository &
  FindOneStatementRepository;

export class KnexStatementRepository implements Repository {
  protected tableName = 'statements';

  constructor(private readonly knex: Knex) {}

  async findOneStatement(
    params: FindOneStatementRepositoryParams,
  ): Promise<StatementEntity> {
    const [statement] = await this.knex
      .select('*')
      .from(this.tableName)
      .where(params)
      .returning('*');

    return statement;
  }

  async insertOrUpdateStatement(
    data: InsertOrUpdateStatementRepositoryParams,
  ): Promise<void> {
    await this.knex
      .table(this.tableName)
      .insert(data)
      .onConflict('id')
      .merge()
      .returning('*');
  }
}
