import { Controller, Get, Query } from '@nestjs/common';
import { DbGetStatementUseCaseFactory } from '@/presentation/factories/db-get-statement-usecase.factory';
import { DBGetStatementUsecase } from '@/data/usecases/db-get-statement.usecase';

@Controller('/statements')
export class AppController {
  private getStatementUseCase: DBGetStatementUsecase;
  constructor(
    private readonly dbGetStatementUseCaseFactory: DbGetStatementUseCaseFactory,
  ) {
    this.getStatementUseCase = this.dbGetStatementUseCaseFactory.build();
  }

  @Get('/')
  getStatement(@Query('userId') userId: string) {
    return this.getStatementUseCase.execute({ userId });
  }
}
