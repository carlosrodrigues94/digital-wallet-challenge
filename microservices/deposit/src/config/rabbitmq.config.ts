import { registerAs } from '@nestjs/config';

export type RabbitMQConfig = {
  host: string;
  port: number;
  user: string;
  password: string;
  exchanges: {
    wallet: string;
  };
};

export const rabbitMqConfig = registerAs<RabbitMQConfig>(
  'RABBITMQ_CONFIG',
  () => ({
    host: process.env.RABBITMQ_HOST,
    port: Number(process.env.RABBITMQ_PORT),
    user: process.env.RABBITMQ_USER,
    password: process.env.RABBITMQ_PASSWORD,
    exchanges: {
      wallet: 'wallet-exchange',
    },
  }),
);
