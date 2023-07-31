import knex, { Knex } from 'knex';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KnexDepositRepository } from '@/infra/repositories/deposit.repository';
import { KnexWithdrawRepository } from '@/infra/repositories/withdraw.repository';
import { UniqueIdService } from '@/infra/services/generate-unique-id.service';
import { KnexStatementRepository } from '@/infra/repositories/statement.repository';
import { RabbitMQPublisher } from '@/infra/message-broker/rabbitmq-publisher';

@Module({
  imports: [],
  providers: [
    {
      inject: [ConfigService],
      provide: 'KNEX_DEPOSIT_REPOSITORY',
      useFactory: (configService: ConfigService) => {
        const knexConfig = configService.get<Knex.Config>('KNEX_CONFIG');
        return new KnexDepositRepository(knex(knexConfig));
      },
    },
    {
      inject: [ConfigService],
      provide: 'KNEX_WITHDRAW_REPOSITORY',
      useFactory: (configService: ConfigService) => {
        const knexConfig = configService.get<Knex.Config>('KNEX_CONFIG');
        return new KnexWithdrawRepository(knex(knexConfig));
      },
    },

    {
      inject: [ConfigService],
      provide: 'KNEX_STATEMENT_REPOSITORY',
      useFactory: (configService: ConfigService) => {
        const knexConfig = configService.get<Knex.Config>('KNEX_CONFIG');
        return new KnexStatementRepository(knex(knexConfig));
      },
    },

    {
      provide: RabbitMQPublisher,
      inject: [ConfigService, UniqueIdService],
      useFactory: (
        configService: ConfigService,
        uniqueIdService: UniqueIdService,
      ) => {
        return new RabbitMQPublisher(
          configService.get('RABBITMQ_CONFIG'),
          uniqueIdService,
        );
      },
    },

    UniqueIdService,
  ],
  exports: [
    'KNEX_DEPOSIT_REPOSITORY',
    'KNEX_WITHDRAW_REPOSITORY',
    'KNEX_STATEMENT_REPOSITORY',
    UniqueIdService,
    RabbitMQPublisher,
  ],
})
export class InfraModule {}
