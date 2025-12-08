import { Redis, RedisOptions } from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  throw new Error('❌ REDIS_URL .env dosyasında bulunamadı! Lütfen kontrol edin.');
}

const redisOptions: RedisOptions = {
  keyPrefix: 'gh-counter:',
  
  retryStrategy(times: number) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },

  reconnectOnError: (err: Error) => {
    const targetError = 'READONLY';
    if (err.message.includes(targetError)) {
      return true;
    }
    return false;
  },
};

export const redis = new Redis(redisUrl, redisOptions);

redis.on('connect', () => {
  console.log('✅ Redis: Bağlantı başarıyla kuruldu.');
});

redis.on('ready', () => {
  console.log('🚀 Redis: Komut kabul etmeye hazır.');
});

redis.on('error', (err: Error) => {
  console.error('❌ Redis Hatası:', err.message);
});

redis.on('close', () => {
  console.warn('⚠️ Redis: Bağlantı koptu.');
});

redis.on('reconnecting', () => {
  console.log('🔄 Redis: Tekrar bağlanılıyor...');
});