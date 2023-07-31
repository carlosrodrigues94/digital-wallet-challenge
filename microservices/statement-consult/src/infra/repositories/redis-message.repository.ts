import { RedisConfig } from '@/config/redis.config';
import { Injectable } from '@nestjs/common';
import { RedisClientType, createClient } from 'redis';

@Injectable()
export class RedisMessageRepository {
  private redisUrl: string;
  private redisClient: RedisClientType;

  constructor(private readonly redisConfig: RedisConfig) {
    const { host, port } = this.redisConfig;
    this.redisUrl = `redis://${host}:${port}`;
  }

  async connect(): Promise<void> {
    this.redisClient = createClient({
      url: this.redisUrl,
      password: this.redisConfig.password,
    });
    this.redisClient.on('error', (err) =>
      console.log('[REDIS] Client Error', err),
    );

    this.redisClient.on('connect', () => {
      console.log('[REDIS] Connection Success');
    });

    await this.redisClient.connect();
  }

  async isMessageProcessed(data: {
    consumerName: string;
    messageId: string;
  }): Promise<boolean> {
    const key = this.getMessageCacheKey(data);
    const result = await this.redisClient.exists(key);
    return !!result;
  }

  async markMessageProcessed(data: {
    consumerName: string;
    messageId: string;
  }): Promise<void> {
    const key = this.getMessageCacheKey(data);
    await this.redisClient.set(key, 1);
  }

  private getMessageCacheKey(data: {
    consumerName: string;
    messageId: string;
  }): string {
    return `message:${data.consumerName}:${data.messageId}`;
  }
}
