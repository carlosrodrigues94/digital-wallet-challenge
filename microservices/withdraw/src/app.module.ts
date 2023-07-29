import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DbCreateWithdrawUseCaseFactory } from '@/presentation/factories/db-create-withdraw-usecase.factory';
import { InfraModule } from '@/infra.module';
import { knexConfig } from '@/config/knex.config';
import { CreateWithdrawController } from '@/presentation/controllers/create-withdraw.controller';
import { RabbitMQMessageBroker } from '@/infra/message-broker/rabbitmq.message-broker';
import { KnexWithdrawRepository } from './infra/repositories/knex-withdraw.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [knexConfig],
    }),
    InfraModule,
  ],
  controllers: [CreateWithdrawController],
  providers: [
    {
      inject: [RabbitMQMessageBroker, 'KNEX_WITHDRAW_REPOSITORY'],
      provide: DbCreateWithdrawUseCaseFactory,
      useFactory: (
        messageBroker: RabbitMQMessageBroker,
        knexWithdrawRepository: KnexWithdrawRepository,
      ) => {
        return new DbCreateWithdrawUseCaseFactory(
          messageBroker,
          knexWithdrawRepository,
        );
      },
    },
  ],
  exports: [],
})
export class AppModule {}
