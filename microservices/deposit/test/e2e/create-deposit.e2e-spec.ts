import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@/app.module';
import { CreateDepositDTO } from '@/presentation/dtos/create-deposit.dto';
import { randomUUID } from 'crypto';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/deposits (POST)', () => {
    const body: CreateDepositDTO = {
      amount: 100,
      source: 'pix',
      sourceDescription: 'pix-bank-name',
      sourceTransactionId: 'pix-id',
      userId: randomUUID(),
    };
    return request(app.getHttpServer())
      .post('/deposits')
      .send(body)
      .expect(201);
  });
});
