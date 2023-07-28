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
        name: 'RABBITMQ_SUBSCRIBER',
        transport: Transport.RMQ,
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
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
