import { Body, Controller, Post } from '@nestjs/common';
import { DbCreateDepositUseCaseFactory } from '@/presentation/factories/db-create-deposit-usecase.factory';
import { CreateDepositDTO } from '@/presentation/dtos/create-deposit.dto';
import { CreateDepositUseCase } from '@/domain/usecases/create-deposit.usecase';

@Controller('deposits')
export class CreateDepositController {
  private usecase: CreateDepositUseCase;
  constructor(private readonly factory: DbCreateDepositUseCaseFactory) {
    this.usecase = this.factory.build();
  }

  @Post('/')
  async createDeposit(@Body() body: CreateDepositDTO) {
    return this.usecase.execute(body);
  }
}
