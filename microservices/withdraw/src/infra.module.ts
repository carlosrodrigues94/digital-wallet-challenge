import knex, { Knex } from 'knex';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KnexWithdrawRepository } from '@/infra/repositories/knex-withdraw.repository';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UniqueIdService } from '@/infra/services/generate-unique-id.service';
import { KnexStatementRepository } from './infra/repositories/knex-statement.repository';
import { RabbitMQPublisher } from './infra/message-broker/rabbitmq-publisher';
import { RedisMessageRepository } from './infra/repositories/redis-message.repository';

@Module({
  imports: [
    ClientsModule.register([
      {
        transport: Transport.RMQ,
        name: 'WITHDRAW_CLIENT_PUBLISHER',
        options: {
          urls: [
            {
              hostname: process.env.RABBITMQ_HOST,
              password: process.env.RABBITMQ_PASSWORD,
              username: process.env.RABBITMQ_USER,
              port: Number(process.env.RABBITMQ_PORT),
            },
          ],
        },
      },
    ]),
  ],
  providers: [
    {
      inject: [ConfigService],
      provide: 'KNEX_WITHDRAW_REPOSITORY',
      useFactory: (configService: ConfigService) => {
        const knexConfig = configService.get<Knex.Config>('KNEX_CONFIG');
        return new KnexWithdrawRepository(knex(knexConfig));
      },
    },

    {
      provide: 'KNEX_STATEMENT_REPOSITORY',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const knexConfig = configService.get<Knex.Config>('KNEX_CONFIG');
        return new KnexStatementRepository(knex(knexConfig));
      },
    },

    {
      provide: RabbitMQPublisher,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return new RabbitMQPublisher(configService.get('RABBITMQ_CONFIG'));
      },
    },
    {
      provide: RedisMessageRepository,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return new RedisMessageRepository(configService.get('REDIS_CONFIG'));
      },
    },
    UniqueIdService,
  ],
  exports: [
    'KNEX_WITHDRAW_REPOSITORY',
    'KNEX_STATEMENT_REPOSITORY',
    UniqueIdService,
    RabbitMQPublisher,
    RedisMessageRepository,
  ],
})
export class InfraModule {}
