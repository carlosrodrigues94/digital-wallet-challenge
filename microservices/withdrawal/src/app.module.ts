import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ClientsModule.register([
      {
        transport: Transport.RMQ,
        name: 'WITHDRAWAL_CLIENT_PUBLISHER',
        options: {
          queue: 'withdrawal.created.event',
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
  providers: [],
  exports: [ClientsModule],
})
export class AppModule {}
