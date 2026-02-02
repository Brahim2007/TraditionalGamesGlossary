// Caching Utilities for Traditional Games Glossary
// أدوات التخزين المؤقت لمعجم الألعاب التراثية

import { unstable_cache } from 'next/cache';

interface CacheItem<T> {
  value: T
  expiresAt: number
  createdAt: number
}

interface CacheConfig {
  defaultTTL: number // Time to live in milliseconds
  maxSize: number // Maximum number of items in cache
  cleanupInterval: number // How often to clean expired items (ms)
}

class CacheStore {
  private store: Map<string, CacheItem<any>> = new Map()
  private config: CacheConfig
  private cleanupTimer: NodeJS.Timeout | null = null

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      defaultTTL: 5 * 60 * 1000, // 5 minutes
      maxSize: 1000,
      cleanupInterval: 60 * 1000, // 1 minute
      ...config
    }

    this.startCleanup()
  }

  /**
   * Set a value in cache
   * تعيين قيمة في التخزين المؤقت
   */
  set<T>(key: string, value: T, ttl?: number): void {
    const now = Date.now()
    const expiresAt = now + (ttl || this.config.defaultTTL)

    // Remove oldest items if cache is full
    if (this.store.size >= this.config.maxSize) {
      this.evictOldest()
    }

    this.store.set(key, {
      value,
      expiresAt,
      createdAt: now
    })
  }

  /**
   * Get a value from cache
   * الحصول على قيمة من التخزين المؤقت
   */
  get<T>(key: string): T | null {
    const item = this.store.get(key)
    
    if (!item) return null
    
    // Check if item has expired
    if (Date.now() > item.expiresAt) {
      this.store.delete(key)
      return null
    }
    
    return item.value as T
  }

  /**
   * Get value or compute if not in cache
   * الحصول على قيمة أو حسابها إذا لم تكن في التخزين المؤقت
   */
  async getOrCompute<T>(
    key: string,
    computeFn: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    const cached = this.get<T>(key)
    
    if (cached !== null) {
      return cached
    }
    
    const value = await computeFn()
    this.set(key, value, ttl)
    
    return value
  }

  /**
   * Delete a value from cache
   * حذف قيمة من التخزين المؤقت
   */
  delete(key: string): boolean {
    return this.store.delete(key)
  }

  /**
   * Clear all values from cache
   * مسح جميع القيم من التخزين المؤقت
   */
  clear(): void {
    this.store.clear()
  }

  /**
   * Check if key exists in cache
   * التحقق إذا كان المفتاح موجوداً في التخزين المؤقت
   */
  has(key: string): boolean {
    const item = this.store.get(key)
    
    if (!item) return false
    
    // Check if item has expired
    if (Date.now() > item.expiresAt) {
      this.store.delete(key)
      return false
    }
    
    return true
  }

  /**
   * Get cache statistics
   * الحصول على إحصائيات التخزين المؤقت
   */
  getStats() {
    const now = Date.now()
    let expiredCount = 0
    let totalSize = 0

    for (const item of this.store.values()) {
      totalSize += JSON.stringify(item.value).length
      if (now > item.expiresAt) {
        expiredCount++
      }
    }

    return {
      totalItems: this.store.size,
      expiredItems: expiredCount,
      memoryUsage: `${(totalSize / 1024).toFixed(2)} KB`,
      hitRate: this.calculateHitRate()
    }
  }

  /**
   * Evict oldest items from cache
   * إزالة أقدم العناصر من التخزين المؤقت
   */
  private evictOldest(): void {
    let oldestKey: string | null = null
    let oldestTime = Date.now()

    for (const [key, item] of this.store.entries()) {
      if (item.createdAt < oldestTime) {
        oldestTime = item.createdAt
        oldestKey = key
      }
    }

    if (oldestKey) {
      this.store.delete(oldestKey)
    }
  }

  /**
   * Clean up expired items
   * تنظيف العناصر المنتهية الصلاحية
   */
  private cleanup(): void {
    const now = Date.now()
    let deletedCount = 0

    for (const [key, item] of this.store.entries()) {
      if (now > item.expiresAt) {
        this.store.delete(key)
        deletedCount++
      }
    }

    if (deletedCount > 0) {
      console.log(`[Cache] Cleaned up ${deletedCount} expired items`)
    }
  }

  /**
   * Start automatic cleanup
   * بدء التنظيف التلقائي
   */
  private startCleanup(): void {
    this.cleanupTimer = setInterval(() => {
      this.cleanup()
    }, this.config.cleanupInterval)
  }

  /**
   * Stop automatic cleanup
   * إيقاف التنظيف التلقائي
   */
  stopCleanup(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer)
      this.cleanupTimer = null
    }
  }

  /**
   * Calculate cache hit rate
   * حساب معدل الضربات في التخزين المؤقت
   */
  private calculateHitRate(): string {
    // This would require tracking hits/misses over time
    // For simplicity, return a placeholder
    return 'N/A'
  }
}

// ==================== CACHE INSTANCES ====================

// Global cache instance for general use
export const globalCache = new CacheStore({
  defaultTTL: 10 * 60 * 1000, // 10 minutes
  maxSize: 5000
})

// Game data cache (longer TTL for less frequently changing data)
export const gameCache = new CacheStore({
  defaultTTL: 30 * 60 * 1000, // 30 minutes
  maxSize: 1000
})

// Session cache (shorter TTL for security)
export const sessionCache = new CacheStore({
  defaultTTL: 15 * 60 * 1000, // 15 minutes
  maxSize: 10000
})

// Search results cache (medium TTL)
export const searchCache = new CacheStore({
  defaultTTL: 5 * 60 * 1000, // 5 minutes
  maxSize: 2000
})

// ==================== CACHE KEYS ====================

export const CacheKeys = {
  // Game-related cache keys
  GAME_BY_SLUG: (slug: string) => `game:slug:${slug}`,
  GAME_BY_ID: (id: string) => `game:id:${id}`,
  GAMES_LIST: (page: number, filters: any) => `games:list:${page}:${JSON.stringify(filters)}`,
  GAME_STATS: 'games:stats',
  
  // Search-related cache keys
  SEARCH_RESULTS: (query: string, filters: any) => `search:${query}:${JSON.stringify(filters)}`,
  SIMILAR_GAMES: (gameId: string) => `similar:games:${gameId}`,
  
  // User-related cache keys
  USER_BY_ID: (id: string) => `user:id:${id}`,
  USER_PERMISSIONS: (id: string) => `user:permissions:${id}`,
  
  // System cache keys
  SYSTEM_CONFIG: 'system:config',
  COUNTRIES_LIST: 'countries:list',
  HERITAGE_FIELDS: 'heritage:fields',
  TAGS_LIST: 'tags:list'
}

// ==================== CACHE HELPERS ====================

/**
 * Invalidate cache for a specific game
 * إبطال التخزين المؤقت لعبة محددة
 */
export function invalidateGameCache(gameId: string, slug?: string): void {
  gameCache.delete(CacheKeys.GAME_BY_ID(gameId))
  
  if (slug) {
    gameCache.delete(CacheKeys.GAME_BY_SLUG(slug))
  }
  
  // Invalidate games list cache (all pages)
  for (const key of gameCache['store'].keys()) {
    if (key.startsWith('games:list:')) {
      gameCache.delete(key)
    }
  }
  
  // Invalidate similar games cache
  gameCache.delete(CacheKeys.SIMILAR_GAMES(gameId))
  
  // Invalidate search cache
  searchCache.clear()
  
  console.log(`[Cache] Invalidated cache for game ${gameId}`)
}

/**
 * Invalidate all game-related cache
 * إبطال جميع التخزين المؤقت المتعلق بالألعاب
 */
export function invalidateAllGameCache(): void {
  gameCache.clear()
  searchCache.clear()
  console.log('[Cache] Invalidated all game cache')
}

/**
 * Invalidate user-related cache
 * إبطال التخزين المؤقت المتعلق بالمستخدمين
 */
export function invalidateUserCache(userId: string): void {
  globalCache.delete(CacheKeys.USER_BY_ID(userId))
  globalCache.delete(CacheKeys.USER_PERMISSIONS(userId))
  console.log(`[Cache] Invalidated cache for user ${userId}`)
}

/**
 * Cache middleware for API routes
 * وسيط التخزين المؤقت لمسارات API
 */
export function withCache<T>(
  handler: () => Promise<T>,
  cacheKey: string,
  ttl?: number,
  cacheStore: CacheStore = globalCache
): () => Promise<T> {
  return async () => {
    return cacheStore.getOrCompute(cacheKey, handler, ttl)
  }
}

/**
 * Generate cache key from function arguments
 * إنشاء مفتاح تخزين مؤقت من معاملات الدالة
 */
export function generateCacheKey(prefix: string, ...args: any[]): string {
  const argsString = args.map(arg => {
    if (typeof arg === 'object') {
      return JSON.stringify(arg)
    }
    return String(arg)
  }).join(':')
  
  return `${prefix}:${argsString}`
}

// ==================== EXPORT TYPES ====================

export type CacheStoreType = InstanceType<typeof CacheStore>
export type CacheConfigType = CacheConfig

// ==================== CACHE STATISTICS ENDPOINT ====================

/**
 * Get cache statistics for monitoring
 * الحصول على إحصائيات التخزين المؤقت للمراقبة
 */
export function getCacheStatistics() {
  return {
    global: globalCache.getStats(),
    games: gameCache.getStats(),
    sessions: sessionCache.getStats(),
    search: searchCache.getStats(),
    timestamp: new Date().toISOString()
  }
}

/**
 * Clear all caches (for development/debugging)
 * مسح جميع التخزين المؤقت (للتطوير/التصحيح)
 */
export function clearAllCaches(): void {
  globalCache.clear()
  gameCache.clear()
  sessionCache.clear()
  searchCache.clear()
  console.log('[Cache] Cleared all caches')
}

// ==================== NEXT.JS CACHE WRAPPERS ====================

/**
 * Cached wrapper using Next.js unstable_cache
 * غلاف مخزن مؤقتاً باستخدام unstable_cache من Next.js
 * 
 * @example
 * const getCachedGames = cachedFunction(
 *   async (status: string) => {
 *     return await prisma.game.findMany({ where: { reviewStatus: status } })
 *   },
 *   ['games-by-status'],
 *   { revalidate: 3600, tags: ['games'] }
 * )
 */
export function cachedFunction<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  keyParts: string[],
  options?: {
    revalidate?: number | false; // seconds, or false for no revalidation
    tags?: string[]; // cache tags for invalidation
  }
): T {
  return unstable_cache(fn, keyParts, options) as T;
}

/**
 * Cache tags for Next.js cache invalidation
 * علامات التخزين المؤقت لإبطال ذاكرة التخزين المؤقت في Next.js
 */
export const CacheTags = {
  // Game-related tags
  GAMES: 'games',
  GAME: (id: string) => `game-${id}`,
  GAMES_LIST: 'games-list',
  GAMES_PUBLISHED: 'games-published',
  GAMES_DRAFT: 'games-draft',
  
  // Similarity tags
  SIMILARITIES: 'similarities',
  SIMILARITY: (id: string) => `similarity-${id}`,
  
  // Concept tags
  CONCEPTS: 'concepts',
  CONCEPT: (id: string) => `concept-${id}`,
  
  // User/Contributor tags
  CONTRIBUTORS: 'contributors',
  CONTRIBUTOR: (id: string) => `contributor-${id}`,
  
  // System tags
  COUNTRIES: 'countries',
  HERITAGE_FIELDS: 'heritage-fields',
  TAGS: 'tags',
  SETTINGS: 'settings',
  
  // Statistics
  STATS: 'stats',
  DASHBOARD_STATS: 'dashboard-stats',
};

/**
 * Revalidate cache by tag
 * إعادة التحقق من التخزين المؤقت حسب العلامة
 * 
 * Note: This uses Next.js revalidateTag which requires Next.js 13.4+
 */
export async function revalidateCacheTag(tag: string): Promise<void> {
  try {
    const { revalidateTag } = await import('next/cache');
    revalidateTag(tag);
    console.log(`[Cache] Revalidated tag: ${tag}`);
  } catch (error) {
    console.error(`[Cache] Failed to revalidate tag ${tag}:`, error);
  }
}

/**
 * Revalidate cache by path
 * إعادة التحقق من التخزين المؤقت حسب المسار
 */
export async function revalidateCachePath(path: string): Promise<void> {
  try {
    const { revalidatePath } = await import('next/cache');
    revalidatePath(path);
    console.log(`[Cache] Revalidated path: ${path}`);
  } catch (error) {
    console.error(`[Cache] Failed to revalidate path ${path}:`, error);
  }
}

/**
 * Invalidate game cache using Next.js tags
 * إبطال ذاكرة التخزين المؤقت للعبة باستخدام علامات Next.js
 */
export async function invalidateGameCacheNext(gameId: string): Promise<void> {
  await revalidateCacheTag(CacheTags.GAME(gameId));
  await revalidateCacheTag(CacheTags.GAMES);
  await revalidateCacheTag(CacheTags.GAMES_LIST);
  await revalidateCacheTag(CacheTags.STATS);
}

/**
 * Invalidate all games cache using Next.js tags
 * إبطال جميع ذاكرة التخزين المؤقت للألعاب باستخدام علامات Next.js
 */
export async function invalidateAllGamesCacheNext(): Promise<void> {
  await revalidateCacheTag(CacheTags.GAMES);
  await revalidateCacheTag(CacheTags.GAMES_LIST);
  await revalidateCacheTag(CacheTags.GAMES_PUBLISHED);
  await revalidateCacheTag(CacheTags.GAMES_DRAFT);
  await revalidateCacheTag(CacheTags.STATS);
}

// ==================== CACHED DATA FETCHERS ====================

/**
 * Example: Cached function to get published games
 * مثال: دالة مخزنة مؤقتاً للحصول على الألعاب المنشورة
 */
export const getCachedPublishedGames = cachedFunction(
  async () => {
    const { db } = await import('../db');
    return db.game.findMany({
      where: { reviewStatus: 'published' },
      orderBy: { publishedAt: 'desc' },
      take: 50,
    });
  },
  ['published-games'],
  {
    revalidate: 3600, // 1 hour
    tags: [CacheTags.GAMES_PUBLISHED, CacheTags.GAMES],
  }
);

/**
 * Example: Cached function to get game by slug
 * مثال: دالة مخزنة مؤقتاً للحصول على لعبة حسب الـ slug
 */
export function getCachedGameBySlug(slug: string) {
  return cachedFunction(
    async () => {
      const { db } = await import('../db');
      return db.game.findUnique({
        where: { slug },
        include: {
          country: true,
          heritageField: true,
          media: true,
          references: true,
          contributor: true,
        },
      });
    },
    ['game-by-slug', slug],
    {
      revalidate: 1800, // 30 minutes
      tags: [CacheTags.GAMES, `game-slug-${slug}`],
    }
  )();
}

/**
 * Example: Cached function to get countries list
 * مثال: دالة مخزنة مؤقتاً للحصول على قائمة الدول
 */
export const getCachedCountries = cachedFunction(
  async () => {
    const { db } = await import('../db');
    return db.country.findMany({
      orderBy: { name: 'asc' },
    });
  },
  ['countries-list'],
  {
    revalidate: 86400, // 24 hours
    tags: [CacheTags.COUNTRIES],
  }
);

/**
 * Example: Cached function to get heritage fields
 * مثال: دالة مخزنة مؤقتاً للحصول على المجالات التراثية
 */
export const getCachedHeritageFields = cachedFunction(
  async () => {
    const { db } = await import('../db');
    return db.heritageField.findMany({
      orderBy: { name: 'asc' },
    });
  },
  ['heritage-fields-list'],
  {
    revalidate: 86400, // 24 hours
    tags: [CacheTags.HERITAGE_FIELDS],
  }
);

/**
 * Example: Cached function to get dashboard statistics
 * مثال: دالة مخزنة مؤقتاً للحصول على إحصائيات لوحة التحكم
 */
export const getCachedDashboardStats = cachedFunction(
  async () => {
    const { db } = await import('../db');
    
    const [
      totalGames,
      publishedGames,
      draftGames,
      underReviewGames,
      pendingSimilarities,
      totalContributors,
    ] = await Promise.all([
      db.game.count(),
      db.game.count({ where: { reviewStatus: 'published' } }),
      db.game.count({ where: { reviewStatus: 'draft' } }),
      db.game.count({ where: { reviewStatus: 'under_review' } }),
      db.gameSimilarity.count({ where: { status: 'pending' } }),
      db.contributor.count(),
    ]);
    
    return {
      totalGames,
      publishedGames,
      draftGames,
      underReviewGames,
      pendingSimilarities,
      totalContributors,
      timestamp: new Date().toISOString(),
    };
  },
  ['dashboard-stats'],
  {
    revalidate: 300, // 5 minutes
    tags: [CacheTags.DASHBOARD_STATS, CacheTags.STATS],
  }
);