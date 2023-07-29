import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@/app.module';
import { randomUUID } from 'crypto';
import { CreateWithdrawDTO } from '@/presentation/dtos/create-withdraw.dto';

describe('CreateWithdrawController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/withdraws (POST)', () => {
    const body: CreateWithdrawDTO = {
      amount: 100,
      source: 'pix',
      sourceTransactionId: 'pix-id',
      userId: randomUUID(),
    };
    return request(app.getHttpServer())
      .post('/withdraws')
      .send(body)
      .expect(201);
  });
});
