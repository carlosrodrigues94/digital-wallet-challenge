import { registerAs } from '@nestjs/config';

export type RedisConfig = {
  host: string;
  port: number;
  password: string;
};

export const redisConfig = registerAs<RedisConfig>('REDIS_CONFIG', () => ({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
}));
