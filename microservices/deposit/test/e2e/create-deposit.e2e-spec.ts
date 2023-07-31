import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@/app.module';
import { CreateDepositDTO } from '@/presentation/dtos/create-deposit.dto';
import { randomUUID } from 'crypto';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;

  beforeEach(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
      controllers: [],
    }).compile();

    app = moduleFixture.createNestApplication();
    await new Promise((resolve) => setTimeout(() => resolve(app.init()), 5000));
  });

  it('/deposits (POST)', async () => {
    console.log('ENV ===>', process.env.RABBITMQ_USER);
    const body: CreateDepositDTO = {
      amount: 100,
      source: 'pix',
      sourceDescription: 'pix-bank-name',
      sourceTransactionId: 'pix-id',
      userId: randomUUID(),
    };
    return await request(app.getHttpServer())
      .post('/deposits')
      .send(body)
      .expect(201);
  });
});
