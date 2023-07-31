import { HandleCreatedOrUpdatedStatementEventUseCase } from '@/data/usecases/handle-created-or-updated-statement-event.usecase';
import { KnexStatementRepository } from '@/infra/repositories/knex-statement.repository';

export class HandleCreatedOrUpdatedStatementEventUseCaseFactory {
  constructor(
    private readonly knexStatementRepository: KnexStatementRepository,
  ) {}
  build() {
    return new HandleCreatedOrUpdatedStatementEventUseCase(
      this.knexStatementRepository,
    );
  }
}
