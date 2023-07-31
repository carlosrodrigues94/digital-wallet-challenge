import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@/app.module';
import { randomUUID } from 'crypto';
import { CreateWithdrawDTO } from '@/presentation/dtos/create-withdraw.dto';
import { ApplicationExceptionFilter } from '@/presentation/filters/application-exception.filter';

describe('CreateWithdrawController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(new ApplicationExceptionFilter());
    await new Promise((resolve) => setTimeout(() => resolve(app.init()), 5000));
  });

  it('/withdraws (POST) - should return error regarding user-id does not have any statement', () => {
    const body: CreateWithdrawDTO = {
      amount: 100,
      source: 'pix',
      sourceTransactionId: 'pix-id',
      userId: randomUUID(),
    };

    return request(app.getHttpServer())
      .post('/withdraws')
      .send(body)
      .expect(404);
  });

  it('/withdraws (POST) - should return error regarding insufficient funds', async () => {});
});
