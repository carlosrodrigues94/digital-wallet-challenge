import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@/app.module';
import { InsertOrUpdateStatementRepository } from '@/data/repositories/insert-or-update-statement.repository';
import { randomUUID } from 'crypto';

describe('GetStatementController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/statements (GET) should return an statement', async () => {
    const myProviderValue: InsertOrUpdateStatementRepository = app.get(
      'KNEX_STATEMENT_REPOSITORY',
    );
    const statementMock = {
      id: randomUUID(),
      amount: 100,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: randomUUID(),
    };

    await myProviderValue.insertOrUpdateStatement(statementMock);

    return request(app.getHttpServer())
      .get(`/statements?userId=${statementMock.userId}`)
      .expect(200);
  });
});
