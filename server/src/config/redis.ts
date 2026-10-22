import Redis from 'ioredis';
import { config } from './env';

// In-memory fallback map for environments where Redis container is starting up or standalone dev
const inMemoryCache = new Map<string, { value: string; expiry: number | null }>();

let redisClient: Redis | null = null;
let isRedisConnected = false;

try {
  redisClient = new Redis({
    host: config.redis.host,
    port: config.redis.port,
    password: config.redis.password || undefined,
    lazyConnect: true,
    maxRetriesPerRequest: 2,
    retryStrategy(times) {
      if (times > 3) {
        return null; // Stop retrying and fallback
      }
      return Math.min(times * 200, 1000);
    },
  });

  redisClient.on('connect', () => {
    isRedisConnected = true;
    console.log('✓ Connected to Redis Cache successfully');
  });

  redisClient.on('error', (err) => {
    isRedisConnected = false;
    // silent fallback to memory cache
  });

  // Initiate connection asynchronously
  redisClient.connect().catch(() => {
    isRedisConnected = false;
  });
} catch (e) {
  isRedisConnected = false;
}

export const getCache = async <T>(key: string): Promise<T | null> => {
  try {
    if (isRedisConnected && redisClient) {
      const data = await redisClient.get(key);
      return data ? JSON.parse(data) : null;
    }
  } catch (err) {
    // fallback to memory
  }

  // Memory fallback
  const item = inMemoryCache.get(key);
  if (!item) return null;
  if (item.expiry && item.expiry < Date.now()) {
    inMemoryCache.delete(key);
    return null;
  }
  return JSON.parse(item.value);
};

export const setCache = async (key: string, value: any, ttlSeconds: number = 300): Promise<void> => {
  const serialized = JSON.stringify(value);
  try {
    if (isRedisConnected && redisClient) {
      await redisClient.set(key, serialized, 'EX', ttlSeconds);
      return;
    }
  } catch (err) {
    // fallback
  }

  // Memory fallback
  inMemoryCache.set(key, {
    value: serialized,
    expiry: ttlSeconds ? Date.now() + ttlSeconds * 1000 : null,
  });
};

export const deleteCache = async (keyOrPattern: string): Promise<void> => {
  try {
    if (isRedisConnected && redisClient) {
      const keys = await redisClient.keys(keyOrPattern);
      if (keys.length > 0) {
        await redisClient.del(...keys);
      }
    }
  } catch (err) {
    // ignore
  }

  for (const k of inMemoryCache.keys()) {
    if (k.includes(keyOrPattern.replace('*', ''))) {
      inMemoryCache.delete(k);
    }
  }
};

export const checkRedisConnection = async (): Promise<boolean> => {
  try {
    if (redisClient && isRedisConnected) {
      const pong = await redisClient.ping();
      return pong === 'PONG';
    }
  } catch (err) {
    return false;
  }
  return false;
};

export { redisClient };
