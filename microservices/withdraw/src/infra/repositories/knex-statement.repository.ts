import { Knex } from 'knex';
import {
  UpdateStatementRepositoryParams,
  UpdateStatementRepository,
} from '@/data/repositories/update-statement.repository';
import {
  FindOneStatementRepository,
  FindOneStatementRepositoryParams,
  FindOneStatementRepositoryResult,
} from '@/data/repositories/find-one-statement.repository';
import {
  CreateStatementRepository,
  CreateStatementRepositoryParams,
  CreateStatementRepositoryResult,
} from '@/data/repositories/create-statement.repository';

type Repository = UpdateStatementRepository &
  FindOneStatementRepository &
  CreateStatementRepository;

export class KnexStatementRepository implements Repository {
  private readonly tableName = 'statements';

  constructor(private readonly knex: Knex) {}
  async createStatement(
    params: CreateStatementRepositoryParams,
  ): Promise<CreateStatementRepositoryResult> {
    const [statement] = await this.knex(this.tableName)
      .insert(params)
      .returning('*');
    return statement;
  }
  async findOneStatement(
    params: FindOneStatementRepositoryParams,
  ): Promise<FindOneStatementRepositoryResult> {
    const [statement] = await this.knex
      .select('*')
      .from(this.tableName)
      .where(params)
      .returning('*');

    return statement;
  }

  async updateStatement(
    id: string,
    data: UpdateStatementRepositoryParams,
  ): Promise<void> {
    await this.knex(this.tableName).update(data).where({ id });
  }
}
