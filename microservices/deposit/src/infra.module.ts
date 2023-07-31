import knex, { Knex } from 'knex';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KnexDepositRepository } from './infra/repositories/knex-deposit.repository';
import { UniqueIdService } from './infra/services/generate-unique-id.service';
import { RabbitMQPublisher } from './infra/message-broker/rabbitmq-publisher';

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
      provide: RabbitMQPublisher,
      inject: [ConfigService, UniqueIdService],
      useFactory: (config: ConfigService, uniqueIdService: UniqueIdService) => {
        return new RabbitMQPublisher(
          config.get('RABBITMQ_CONFIG'),
          uniqueIdService,
        );
      },
    },
    UniqueIdService,
  ],
  exports: ['KNEX_DEPOSIT_REPOSITORY', UniqueIdService, RabbitMQPublisher],
})
export class InfraModule {}
