import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { knexConfig } from '@/config/knex.config';
import { InfraModule } from '@/infra.module';
import { DbGetStatementUseCaseFactory } from '@/presentation/factories/db-get-statement-usecase.factory';
import { AppController } from '@/presentation/controllers/app.controller';
import { HandleCreatedOrUpdatedStatementEventUseCaseFactory } from '@/presentation/factories/handle-created-or-updated-statement-event-usecase.factory';
import { rabbitMqConfig } from '@/config/rabbitmq.config';
import { ApplicationConsumerAdapter } from '@/infra/adapters/application-consumer.adapter';
import { RabbitMQConsumer } from '@/infra/message-broker/rabbitmq-consumer';
import { KnexStatementRepository } from '@/infra/repositories/knex-statement.repository';
import { RedisMessageRepository } from '@/infra/repositories/redis-message.repository';
import { redisConfig } from '@/config/redis.config';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [knexConfig, rabbitMqConfig, redisConfig],
    }),
    InfraModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: DbGetStatementUseCaseFactory,
      inject: ['KNEX_STATEMENT_REPOSITORY'],
      useFactory: (knexStatementRepository) => {
        return new DbGetStatementUseCaseFactory(knexStatementRepository);
      },
    },

    {
      inject: [
        ConfigService,
        'KNEX_STATEMENT_REPOSITORY',
        RedisMessageRepository,
      ],
      provide: RabbitMQConsumer,
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
})
export class AppModule {}
