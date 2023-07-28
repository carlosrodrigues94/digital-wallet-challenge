import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { MicroserviceOptions } from '@nestjs/microservices';
import { Queues } from './app.controller';
async function bootstrap() {
  const { RABBITMQ_HOST, RABBITMQ_PORT, RABBITMQ_PASSWORD, RABBITMQ_USER } =
    process.env;

  await Promise.all(
    Object.values(Queues).map(async (queue) => {
      const app = await NestFactory.createMicroservice<MicroserviceOptions>(
        AppModule,
        {
          transport: Transport.RMQ,
          options: {
            queue,
            urls: [
              {
                hostname: RABBITMQ_HOST,
                password: RABBITMQ_PASSWORD,
                username: RABBITMQ_USER,
                port: Number(RABBITMQ_PORT),
              },
            ],
          },
        },
      );
      return app.listen();
    }),
  );
}
bootstrap();
