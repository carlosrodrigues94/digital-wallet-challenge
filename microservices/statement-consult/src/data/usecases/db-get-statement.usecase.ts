import { FindOneStatementRepository } from '@/data/repositories/find-one-statement.repository';
import { GetStatementUsecase } from '@/domain/usecases/get-statement.usecase';
import { ApplicationException } from '@/data/exceptions/application.exception';

export class DBGetStatementUsecase implements GetStatementUsecase {
  constructor(
    private readonly statementRepository: FindOneStatementRepository,
  ) {}
  async execute(payload: { userId: string }) {
    const statement = await this.statementRepository.findOneStatement({
      userId: payload.userId,
    });

    if (!statement) {
      throw new ApplicationException('Statement not found', 404);
    }

    return statement;
  }
}
