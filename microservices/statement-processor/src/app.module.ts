import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { knexConfig } from '@/config/knex.config';
import { InfraModule } from '@/infra.module';
import { KnexDepositRepository } from '@/infra/repositories/deposit.repository';
import { HandleCreatedDepositEventUseCaseFactory } from '@/presentation/factories/handle-created-deposit-event-usecase.factory';
import { HandleCreatedWithdrawEventUseCaseFactory } from '@/presentation/factories/handle-created-withdraw-event-usecase.factory';
import { KnexWithdrawRepository } from '@/infra/repositories/withdraw.repository';
import { KnexStatementRepository } from '@/infra/repositories/statement.repository';
import { UniqueIdService } from '@/infra/services/generate-unique-id.service';
import { rabbitMqConfig } from '@/config/rabbitmq.config';
import { RabbitMQConsumer } from '@/infra/message-broker/rabbitmq-consumer';
import { ApplicationConsumerAdapter } from '@/infra/adapters/application-consumer.adapter';
import { RabbitMQPublisher } from '@/infra/message-broker/rabbitmq-publisher';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [knexConfig, rabbitMqConfig],
    }),

    InfraModule,
  ],
  controllers: [],
  providers: [
    {
      provide: RabbitMQConsumer,
      inject: [
        ConfigService,
        'KNEX_WITHDRAW_REPOSITORY',
        'KNEX_DEPOSIT_REPOSITORY',
        'KNEX_STATEMENT_REPOSITORY',
        UniqueIdService,
        RabbitMQPublisher,
      ],
      useFactory: (
        configService: ConfigService,
        knexWithdrawRepository: KnexWithdrawRepository,
        knexDepositRepository: KnexDepositRepository,
        knexStatementRepository: KnexStatementRepository,
        uniqueIdService: UniqueIdService,
        messageBroker: RabbitMQPublisher,
      ) => {
        const createdDepositUseCaseFactory =
          new HandleCreatedDepositEventUseCaseFactory(
            messageBroker,
            knexDepositRepository,
            knexStatementRepository,
            uniqueIdService,
          );
        const createdWithdrawUseCaseFactory =
          new HandleCreatedWithdrawEventUseCaseFactory(
            messageBroker,
            knexWithdrawRepository,
            knexStatementRepository,
            uniqueIdService,
          );
        return new RabbitMQConsumer(
          configService.get('RABBITMQ_CONFIG'),
          createdDepositUseCaseFactory,
          createdWithdrawUseCaseFactory,
        );
      },
    },
    ApplicationConsumerAdapter,
  ],
})
export class AppModule {}
