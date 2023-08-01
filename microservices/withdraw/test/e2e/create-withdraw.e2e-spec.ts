import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@/app.module';
import { randomUUID } from 'crypto';
import { CreateWithdrawDTO } from '@/presentation/dtos/create-withdraw.dto';
import { ApplicationExceptionFilter } from '@/presentation/filters/application-exception.filter';
import { CreateStatementRepository } from '@/data/repositories/create-statement.repository';

describe('CreateWithdrawController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(new ApplicationExceptionFilter());
    await new Promise((resolve) => setTimeout(() => resolve(app.init()), 3000));
  });

  it('/withdraws (POST) - should return error regarding user-id does not have any statement', async () => {
    const statement = {
      id: randomUUID(),
      amount: 100,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: randomUUID(),
    };

    const body: CreateWithdrawDTO = {
      amount: 100,
      source: 'pix',
      sourceTransactionId: 'pix-id',
      userId: statement.userId,
    };

    const statementRepository: CreateStatementRepository = app.get(
      'KNEX_STATEMENT_REPOSITORY',
    );

    await statementRepository.createStatement(statement);

    return request(app.getHttpServer())
      .post('/withdraws')
      .send(body)
      .expect(201);
  });
});
