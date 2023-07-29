import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import knex, { Knex } from 'knex';
import { KnexDepositRepository } from './infra/repositories/knex-deposit.repository';

@Module({
  providers: [
    {
      inject: [ConfigService],
      provide: 'KNEX_DEPOSIT_REPOSITORY',
      useFactory: (configService: ConfigService) => {
        const knexConfig = configService.get<Knex.Config>('KNEX_CONFIG');
        return new KnexDepositRepository(knex(knexConfig));
      },
    },
  ],
  exports: ['KNEX_DEPOSIT_REPOSITORY'],
})
export class InfraModule {}
