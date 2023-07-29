import knex, { Knex } from 'knex';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KnexWithdrawRepository } from '@/infra/repositories/knex-withdraw.repository';
import { RabbitMQMessageBroker } from '@/infra/message-broker/rabbitmq.message-broker';
import { ClientProxy, ClientsModule, Transport } from '@nestjs/microservices';
import { Events } from '@/data/enums/events';

@Module({
  imports: [
    ClientsModule.register([
      {
        transport: Transport.RMQ,
        name: 'WITHDRAW_CLIENT_PUBLISHER',
        options: {
          queue: Events.WITHDRAW_CREATED,
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
      provide: RabbitMQMessageBroker,
      inject: ['WITHDRAW_CLIENT_PUBLISHER'],
      useFactory: (messageBroker: ClientProxy) => {
        return new RabbitMQMessageBroker(messageBroker);
      },
    },
  ],
  exports: ['KNEX_WITHDRAW_REPOSITORY', RabbitMQMessageBroker],
})
export class InfraModule {}
