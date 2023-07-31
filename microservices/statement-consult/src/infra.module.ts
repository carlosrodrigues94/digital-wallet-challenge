import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import knex, { Knex } from 'knex';
import { KnexStatementRepository } from '@/infra/repositories/knex-statement.repository';
import { RedisMessageRepository } from './infra/repositories/redis-message.repository';

@Module({
  providers: [
    {
      inject: [ConfigService],
      provide: 'KNEX_STATEMENT_REPOSITORY',
      useFactory: (configService: ConfigService) => {
        const knexConfig = configService.get<Knex.Config>('KNEX_CONFIG');
        return new KnexStatementRepository(knex(knexConfig));
      },
    },
    {
      provide: RedisMessageRepository,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return new RedisMessageRepository(configService.get('REDIS_CONFIG'));
      },
    },
  ],
  exports: ['KNEX_STATEMENT_REPOSITORY', RedisMessageRepository],
})
export class InfraModule {}
