import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DbCreateWithdrawUseCaseFactory } from '@/presentation/factories/db-create-withdraw-usecase.factory';
import { InfraModule } from '@/infra.module';
import { knexConfig } from '@/config/knex.config';
import { CreateWithdrawController } from '@/presentation/controllers/create-withdraw.controller';
import { KnexWithdrawRepository } from '@/infra/repositories/knex-withdraw.repository';
import { UniqueIdService } from '@/infra/services/generate-unique-id.service';
import { KnexStatementRepository } from '@/infra/repositories/knex-statement.repository';
import { HandleCreatedOrUpdatedStatementEventUseCaseFactory } from '@/presentation/factories/handle-created-or-updated-statement-event-usecase.factory';
import { rabbitMqConfig } from '@/config/rabbitmq.config';
import { ApplicationConsumerAdapter } from '@/infra/adapters/application-consumer.adapter';
import { RabbitMQConsumer } from '@/infra/message-broker/rabbitmq-consumer';
import { RabbitMQPublisher } from '@/infra/message-broker/rabbitmq-publisher';
import { redisConfig } from './config/redis.config';
import { RedisMessageRepository } from './infra/repositories/redis-message.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [knexConfig, rabbitMqConfig, redisConfig],
    }),
    InfraModule,
  ],
  controllers: [CreateWithdrawController],
  providers: [
    {
      inject: [
        RabbitMQPublisher,
        'KNEX_WITHDRAW_REPOSITORY',
        UniqueIdService,
        'KNEX_STATEMENT_REPOSITORY',
      ],
      provide: DbCreateWithdrawUseCaseFactory,
      useFactory: (
        messageBroker: RabbitMQPublisher,
        knexWithdrawRepository: KnexWithdrawRepository,
        uniqueIdService: UniqueIdService,
        statementRepository: KnexStatementRepository,
      ) => {
        return new DbCreateWithdrawUseCaseFactory(
          messageBroker,
          knexWithdrawRepository,
          uniqueIdService,
          statementRepository,
        );
      },
    },

    {
      inject: ['KNEX_STATEMENT_REPOSITORY'],
      provide: HandleCreatedOrUpdatedStatementEventUseCaseFactory,
      useFactory: (knexStatementRepository: KnexStatementRepository) => {
        return new HandleCreatedOrUpdatedStatementEventUseCaseFactory(
          knexStatementRepository,
        );
      },
    },

    {
      provide: RabbitMQConsumer,
      inject: [
        ConfigService,
        'KNEX_STATEMENT_REPOSITORY',
        RedisMessageRepository,
      ],
      useFactory: (
        configService: ConfigService,
        knexStatementRepository: KnexStatementRepository,
        redisMessageRepository: RedisMessageRepository,
      ) => {
        const factory = new HandleCreatedOrUpdatedStatementEventUseCaseFactory(
          knexStatementRepository,
        );
        return new RabbitMQConsumer(
          configService.get('RABBITMQ_CONFIG'),
          redisMessageRepository,
          factory,
        );
      },
    },
    ApplicationConsumerAdapter,
  ],
  exports: [],
})
export class AppModule {}
