import { DBGetStatementUsecase } from '@/data/usecases/db-get-statement.usecase';
import { KnexStatementRepository } from '@/infra/repositories/knex-statement.repository';
import { Injectable } from '@nestjs/common';
@Injectable()
export class DbGetStatementUseCaseFactory {
  constructor(
    private readonly knexStatementRepository: KnexStatementRepository,
  ) {}

  build() {
    return new DBGetStatementUsecase(this.knexStatementRepository);
  }
}
