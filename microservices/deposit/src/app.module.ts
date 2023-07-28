import { Module } from '@nestjs/common';
import { AppController, Queues } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    ClientsModule.register([
      {
        name: 'DEPOSIT_QUEUE_PUBLISHER',
        transport: Transport.RMQ,
        options: {
          queue: Queues.DEPOSIT_CREATED,
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
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
