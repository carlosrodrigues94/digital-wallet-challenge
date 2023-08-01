import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { InfraModule } from '@/infra.module';
import { KnexDepositRepository } from '@/infra/repositories/knex-deposit.repository';
import { knexConfig } from '@/config/knex.config';
import { DbCreateDepositUseCaseFactory } from '@/presentation/factories/db-create-deposit-usecase.factory';
import { CreateDepositController } from '@/presentation/controllers/create-deposit.controller';
import { UniqueIdService } from './infra/services/generate-unique-id.service';
import { rabbitMqConfig } from './config/rabbitmq.config';
import { RabbitMQPublisher } from './infra/message-broker/rabbitmq-publisher';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [knexConfig, rabbitMqConfig],
      envFilePath: ['.env'],
    }),

    InfraModule,
  ],
  controllers: [CreateDepositController],
  providers: [
    {
      provide: DbCreateDepositUseCaseFactory,
      inject: ['KNEX_DEPOSIT_REPOSITORY', RabbitMQPublisher, UniqueIdService],
      useFactory: (
        knexDepositRepository: KnexDepositRepository,
        messageBroker: RabbitMQPublisher,
        uniqueIdService: UniqueIdService,
      ) => {
        return new DbCreateDepositUseCaseFactory(
          messageBroker,
          knexDepositRepository,
          uniqueIdService,
        );
      },
    },
  ],
})
export class AppModule {}
