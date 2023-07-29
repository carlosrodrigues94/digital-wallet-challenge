import { Body, Controller, Post } from '@nestjs/common';
import { DbCreateWithdrawUseCaseFactory } from '@/presentation/factories/db-create-withdraw-usecase.factory';
import { CreateWithdrawDTO } from '@/presentation/dtos/create-withdraw.dto';
import { CreateWithdrawUseCase } from '@/domain/usecases/create-withdraw.usecase';

@Controller('/withdraws')
export class CreateWithdrawController {
  private usecase: CreateWithdrawUseCase;
  constructor(private readonly factory: DbCreateWithdrawUseCaseFactory) {
    this.usecase = this.factory.build();
  }

  @Post('/')
  createWithdraw(@Body() body: CreateWithdrawDTO) {
    return this.usecase.execute(body);
  }
}
