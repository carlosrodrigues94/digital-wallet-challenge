import { ClientProxy, ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { InfraModule } from '@/infra.module';
import { KnexDepositRepository } from '@/infra/repositories/knex-deposit.repository';
import { RabbitMQMessageBroker } from '@/infra/message-broker/rabbitmq.message-broker';
import { knexConfig } from '@/config/knex.config';
import { Events } from '@/data/enums/events';
import { DbCreateDepositUseCaseFactory } from '@/presentation/factories/db-create-deposit-usecase.factory';
import { CreateDepositController } from '@/presentation/controllers/create-deposit.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [knexConfig],
    }),

    ClientsModule.register([
      {
        name: 'DEPOSIT_CLIENT_PUBLISHER',
        transport: Transport.RMQ,
        options: {
          queue: Events.DEPOSIT_CREATED,
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
    InfraModule,
  ],
  controllers: [CreateDepositController],
  providers: [
    {
      provide: DbCreateDepositUseCaseFactory,
      inject: ['DEPOSIT_CLIENT_PUBLISHER', 'KNEX_DEPOSIT_REPOSITORY'],
      useFactory: (
        clientMessageBroker: ClientProxy,
        knexDepositRepository: KnexDepositRepository,
      ) => {
        const messageBroker = new RabbitMQMessageBroker(clientMessageBroker);
        return new DbCreateDepositUseCaseFactory(
          messageBroker,
          knexDepositRepository,
        );
      },
    },
  ],
})
export class AppModule {}
