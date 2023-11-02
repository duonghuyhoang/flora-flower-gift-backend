import { Module } from '@nestjs/common';
import Redis from 'ioredis';

@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        const redisHost = process.env.REDIS_HOST;
        const redisPort = parseInt(process.env.REDIS_PORT, 10);
        return new Redis({
          host: redisHost,
          port: redisPort,
        });
      },
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class RedisModule {}
