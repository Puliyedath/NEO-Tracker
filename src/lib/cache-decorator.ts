import { cache } from "./redis";

interface CacheOptions<T> {
  keyGenerator: (...args: unknown[]) => string;
  ttlGenerator?: (...args: unknown[]) => number;
  prefix?: string;
  shouldCache?: (result: T) => boolean;
}

/**
 * Cache decorator for async functions
 * Implements read-through cache pattern
 */
export function withCache<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>,
  options: CacheOptions<TResult>
): (...args: TArgs) => Promise<TResult & { cached?: boolean }> {
  return async function (...args: TArgs) {
    // Generate cache key
    const key = options.keyGenerator(...args);
    const cacheKey = options.prefix ? `${options.prefix}:${key}` : key;

    // Try to get from cache
    const cachedResult = await cache.get<TResult>(cacheKey);

    if (cachedResult) {
      console.log(`✅ Cache HIT for key: ${cacheKey}`);
      return {
        ...cachedResult,
        cached: true,
      } as TResult & { cached: boolean };
    }

    console.log(`❌ Cache MISS for key: ${cacheKey} - Executing function`);

    // Execute the original function
    const result = await fn(...args);

    // Check if we should cache this result
    const shouldCache = options.shouldCache
      ? options.shouldCache(result)
      : true;

    if (shouldCache) {
      // Determine TTL
      const ttl = options.ttlGenerator ? options.ttlGenerator(...args) : 3600; // Default 1 hour

      // Store in cache
      await cache.set(cacheKey, result, ttl);
      console.log(
        `💾 Cached result for key: ${cacheKey} (TTL: ${ttl}s = ${Math.round(
          ttl / 60
        )} minutes)`
      );
    }

    return {
      ...result,
      cached: false,
    } as TResult & { cached: boolean };
  };
}

/**
 * Common TTL generators
 */
export const ttlGenerators = {
  /**
   * Generate TTL based on date string (YYYY-MM-DD)
   * - Current date: 5 minutes (data might still be updating)
   * - Past/future dates: 1 month (historical data doesn't change)
   */
  dateBasedTTL: (date: string): number => {
    const today = new Date().toISOString().split("T")[0];
    const isToday = date === today;

    if (isToday) {
      return 300; // 5 minutes
    } else {
      return 2592000; // 30 days (1 month)
    }
  },

  fiveMinutes: (): number => 300,
  oneHour: (): number => 3600,
  oneDay: (): number => 86400,
  oneWeek: (): number => 604800,
  oneMonth: (): number => 2592000,
};
