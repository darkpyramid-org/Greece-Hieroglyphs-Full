/**
 * In-memory caching layer for performance optimization
 * Provides TTL-based caching with automatic expiration
 */

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

class Cache {
  private store: Map<string, CacheEntry<any>> = new Map();
  private defaultTTL: number = 5 * 60 * 1000; // 5 minutes default

  /**
   * Get value from cache
   */
  get<T>(key: string): T | null {
    const entry = this.store.get(key);
    
    if (!entry) {
      return null;
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Set value in cache with optional TTL
   */
  set<T>(key: string, data: T, ttl?: number): void {
    const expiresAt = Date.now() + (ttl ?? this.defaultTTL);
    this.store.set(key, { data, expiresAt });
  }

  /**
   * Delete value from cache
   */
  delete(key: string): boolean {
    return this.store.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.store.clear();
  }

  /**
   * Clear expired entries
   */
  clearExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.expiresAt) {
        this.store.delete(key);
      }
    }
  }

  /**
   * Get cache statistics
   */
  getStats(): { size: number; keys: string[] } {
    return {
      size: this.store.size,
      keys: Array.from(this.store.keys()),
    };
  }

  /**
   * Check if key exists and is not expired
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Get or set pattern - fetch from cache or compute and cache
   */
  async getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    const cached = this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const data = await fetcher();
    this.set(key, data, ttl);
    return data;
  }

  /**
   * Invalidate cache by pattern (prefix)
   */
  invalidatePattern(pattern: string): number {
    let count = 0;
    for (const key of this.store.keys()) {
      if (key.startsWith(pattern)) {
        this.store.delete(key);
        count++;
      }
    }
    return count;
  }
}

// Singleton instance
export const cache = new Cache();

// Cache key builders for consistency
export const CacheKeys = {
  products: {
    all: () => "products:all",
    byId: (id: string) => `products:id:${id}`,
    bySlug: (slug: string) => `products:slug:${slug}`,
    byCategory: (category: string) => `products:category:${category}`,
    search: (query: string) => `products:search:${query}`,
  },
  orders: {
    byId: (id: string) => `orders:id:${id}`,
    byEmail: (email: string) => `orders:email:${email}`,
    byStripeSession: (sessionId: string) => `orders:stripe:${sessionId}`,
  },
} as const;

// Cache TTL configurations (in milliseconds)
export const CacheTTL = {
  products: 10 * 60 * 1000, // 10 minutes - products change infrequently
  orders: 2 * 60 * 1000, // 2 minutes - orders update more frequently
  search: 5 * 60 * 1000, // 5 minutes - search results
} as const;

// Auto-cleanup expired entries every 5 minutes.
// `unref()` so the timer never keeps the Node process (or a script that imports
// this module) alive on its own.
const cleanupTimer = setInterval(() => {
  cache.clearExpired();
}, 5 * 60 * 1000);

if (typeof cleanupTimer.unref === "function") cleanupTimer.unref();
