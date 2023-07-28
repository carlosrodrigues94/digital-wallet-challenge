import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('statement')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  statement() {
    return {
      amount: 100,
    };
  }
}
