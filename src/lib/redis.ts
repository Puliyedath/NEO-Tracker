import Redis from "ioredis";

// Global Redis client instance
let redis: Redis | null = null;

/**
 * Get or create a Redis client instance
 * Uses a singleton pattern to avoid multiple connections
 */
export function getRedisClient(): Redis | null {
  // Return null if no Redis URL is configured
  if (!process.env.REDIS_URL) {
    console.warn("REDIS_URL is not configured. Caching will be disabled.");
    return null;
  }

  // Return existing instance if already created
  if (redis) {
    return redis;
  }

  try {
    // Create new Redis client
    redis = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      reconnectOnError(err) {
        const targetError = "READONLY";
        if (err.message.includes(targetError)) {
          // Only reconnect when the error contains "READONLY"
          return true;
        }
        return false;
      },
    });

    // Handle connection events
    redis.on("connect", () => {
      console.log("✅ Redis connected successfully");
    });

    redis.on("error", (error) => {
      console.error("❌ Redis connection error:", error.message);
    });

    redis.on("ready", () => {
      console.log("✅ Redis is ready to accept commands");
    });

    redis.on("close", () => {
      console.warn("⚠️ Redis connection closed");
    });

    return redis;
  } catch (error) {
    console.error("Failed to create Redis client:", error);
    return null;
  }
}

/**
 * Close the Redis connection
 * Useful for cleanup in tests or graceful shutdown
 */
export async function closeRedisConnection(): Promise<void> {
  if (redis) {
    await redis.quit();
    redis = null;
    console.log("Redis connection closed");
  }
}

/**
 * Cache helper functions
 */
export const cache = {
  /**
   * Get a value from cache
   */
  async get<T>(key: string): Promise<T | null> {
    const client = getRedisClient();
    if (!client) return null;

    try {
      const data = await client.get(key);
      if (!data) return null;
      return JSON.parse(data) as T;
    } catch (error) {
      console.error(`Error getting cache key "${key}":`, error);
      return null;
    }
  },

  /**
   * Set a value in cache with optional TTL (time to live in seconds)
   */
  async set(key: string, value: unknown, ttl?: number): Promise<boolean> {
    const client = getRedisClient();
    if (!client) return false;

    try {
      const serialized = JSON.stringify(value);
      if (ttl) {
        await client.setex(key, ttl, serialized);
      } else {
        await client.set(key, serialized);
      }
      return true;
    } catch (error) {
      console.error(`Error setting cache key "${key}":`, error);
      return false;
    }
  },

  /**
   * Delete a value from cache
   */
  async delete(key: string): Promise<boolean> {
    const client = getRedisClient();
    if (!client) return false;

    try {
      await client.del(key);
      return true;
    } catch (error) {
      console.error(`Error deleting cache key "${key}":`, error);
      return false;
    }
  },

  /**
   * Check if a key exists in cache
   */
  async exists(key: string): Promise<boolean> {
    const client = getRedisClient();
    if (!client) return false;

    try {
      const result = await client.exists(key);
      return result === 1;
    } catch (error) {
      console.error(`Error checking cache key "${key}":`, error);
      return false;
    }
  },

  /**
   * Get the remaining TTL of a key (in seconds)
   */
  async ttl(key: string): Promise<number> {
    const client = getRedisClient();
    if (!client) return -2;

    try {
      return await client.ttl(key);
    } catch (error) {
      console.error(`Error getting TTL for key "${key}":`, error);
      return -2;
    }
  },
};

// Export the Redis instance getter as default
export default getRedisClient;
