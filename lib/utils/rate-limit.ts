/**
 * Rate Limiting Utilities
 * أدوات تحديد معدل الطلبات
 * 
 * This module provides rate limiting functionality to protect against abuse
 * يوفر هذا الوحدة وظيفة تحديد معدل الطلبات للحماية من الإساءة
 */

interface RateLimitConfig {
  interval: number; // Time window in milliseconds
  uniqueTokenPerInterval: number; // Max number of unique tokens per interval
}

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number; // Timestamp when the limit resets
  retryAfter?: number; // Seconds to wait before retrying
}

/**
 * In-memory rate limiter
 * محدد معدل الطلبات في الذاكرة
 * 
 * Note: For production with multiple servers, use @upstash/ratelimit with Redis
 * ملاحظة: للإنتاج مع خوادم متعددة، استخدم @upstash/ratelimit مع Redis
 */
class InMemoryRateLimiter {
  private requests: Map<string, number[]> = new Map();
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
    
    // Clean up old entries every minute
    setInterval(() => this.cleanup(), 60000);
  }

  /**
   * Check if request is allowed
   * التحقق إذا كان الطلب مسموحاً
   */
  async check(identifier: string, limit: number): Promise<RateLimitResult> {
    const now = Date.now();
    const windowStart = now - this.config.interval;
    
    // Get or create request history for this identifier
    let requests = this.requests.get(identifier) || [];
    
    // Filter out requests outside the current window
    requests = requests.filter(timestamp => timestamp > windowStart);
    
    // Check if limit exceeded
    const remaining = Math.max(0, limit - requests.length);
    const success = requests.length < limit;
    
    if (success) {
      // Add current request
      requests.push(now);
      this.requests.set(identifier, requests);
    }
    
    // Calculate reset time
    const oldestRequest = requests[0] || now;
    const reset = oldestRequest + this.config.interval;
    const retryAfter = success ? undefined : Math.ceil((reset - now) / 1000);
    
    return {
      success,
      limit,
      remaining,
      reset,
      retryAfter,
    };
  }

  /**
   * Clean up old entries
   * تنظيف الإدخالات القديمة
   */
  private cleanup(): void {
    const now = Date.now();
    const windowStart = now - this.config.interval;
    
    for (const [identifier, requests] of this.requests.entries()) {
      const validRequests = requests.filter(timestamp => timestamp > windowStart);
      
      if (validRequests.length === 0) {
        this.requests.delete(identifier);
      } else {
        this.requests.set(identifier, validRequests);
      }
    }
  }

  /**
   * Reset rate limit for identifier
   * إعادة تعيين حد المعدل للمعرف
   */
  reset(identifier: string): void {
    this.requests.delete(identifier);
  }

  /**
   * Get current usage for identifier
   * الحصول على الاستخدام الحالي للمعرف
   */
  getUsage(identifier: string): number {
    const now = Date.now();
    const windowStart = now - this.config.interval;
    const requests = this.requests.get(identifier) || [];
    
    return requests.filter(timestamp => timestamp > windowStart).length;
  }
}

// ==================== RATE LIMITER INSTANCES ====================

/**
 * General API rate limiter
 * محدد معدل API العام
 * 100 requests per minute per IP
 */
export const apiRateLimiter = new InMemoryRateLimiter({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 10000,
});

/**
 * Authentication rate limiter
 * محدد معدل المصادقة
 * 5 login attempts per 15 minutes per IP
 */
export const authRateLimiter = new InMemoryRateLimiter({
  interval: 15 * 60 * 1000, // 15 minutes
  uniqueTokenPerInterval: 10000,
});

/**
 * Search rate limiter
 * محدد معدل البحث
 * 30 searches per minute per IP
 */
export const searchRateLimiter = new InMemoryRateLimiter({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 10000,
});

/**
 * Upload rate limiter
 * محدد معدل الرفع
 * 10 uploads per hour per user
 */
export const uploadRateLimiter = new InMemoryRateLimiter({
  interval: 60 * 60 * 1000, // 1 hour
  uniqueTokenPerInterval: 10000,
});

/**
 * Game creation rate limiter
 * محدد معدل إنشاء الألعاب
 * 20 games per day per user
 */
export const gameCreationRateLimiter = new InMemoryRateLimiter({
  interval: 24 * 60 * 60 * 1000, // 24 hours
  uniqueTokenPerInterval: 10000,
});

// ==================== RATE LIMIT PRESETS ====================

export const RateLimitPresets = {
  // API endpoints
  API_GENERAL: { limit: 100, limiter: apiRateLimiter },
  API_STRICT: { limit: 30, limiter: apiRateLimiter },
  API_RELAXED: { limit: 200, limiter: apiRateLimiter },
  
  // Authentication
  AUTH_LOGIN: { limit: 5, limiter: authRateLimiter },
  AUTH_REGISTER: { limit: 3, limiter: authRateLimiter },
  AUTH_RESET_PASSWORD: { limit: 3, limiter: authRateLimiter },
  
  // Search
  SEARCH_PUBLIC: { limit: 30, limiter: searchRateLimiter },
  SEARCH_AUTHENTICATED: { limit: 60, limiter: searchRateLimiter },
  
  // Content creation
  GAME_CREATE: { limit: 20, limiter: gameCreationRateLimiter },
  MEDIA_UPLOAD: { limit: 10, limiter: uploadRateLimiter },
  
  // Admin actions (more relaxed)
  ADMIN_ACTION: { limit: 500, limiter: apiRateLimiter },
};

// ==================== HELPER FUNCTIONS ====================

/**
 * Get identifier from request
 * الحصول على المعرف من الطلب
 */
export function getIdentifier(request: Request): string {
  // Try to get IP from headers
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIp) {
    return realIp;
  }
  
  // Fallback to a generic identifier
  return 'unknown';
}

/**
 * Get user identifier from session
 * الحصول على معرف المستخدم من الجلسة
 */
export function getUserIdentifier(userId: string, ip: string): string {
  return `user:${userId}:${ip}`;
}

/**
 * Check rate limit and return result
 * التحقق من حد المعدل وإرجاع النتيجة
 */
export async function checkRateLimit(
  identifier: string,
  preset: keyof typeof RateLimitPresets
): Promise<RateLimitResult> {
  const { limit, limiter } = RateLimitPresets[preset];
  return limiter.check(identifier, limit);
}

/**
 * Rate limit middleware for API routes
 * وسيط تحديد المعدل لمسارات API
 */
export async function withRateLimit(
  request: Request,
  preset: keyof typeof RateLimitPresets,
  customIdentifier?: string
): Promise<RateLimitResult> {
  const identifier = customIdentifier || getIdentifier(request);
  return checkRateLimit(identifier, preset);
}

/**
 * Create rate limit response
 * إنشاء استجابة حد المعدل
 */
export function createRateLimitResponse(result: RateLimitResult): Response {
  const headers = new Headers({
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': result.reset.toString(),
  });
  
  if (result.retryAfter) {
    headers.set('Retry-After', result.retryAfter.toString());
  }
  
  return new Response(
    JSON.stringify({
      error: 'تم تجاوز حد الطلبات',
      message: 'Too many requests. Please try again later.',
      retryAfter: result.retryAfter,
    }),
    {
      status: 429,
      headers,
    }
  );
}

/**
 * Rate limit decorator for API handlers
 * مزخرف تحديد المعدل لمعالجات API
 */
export function rateLimit(preset: keyof typeof RateLimitPresets) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    
    descriptor.value = async function (request: Request, ...args: any[]) {
      const result = await withRateLimit(request, preset);
      
      if (!result.success) {
        return createRateLimitResponse(result);
      }
      
      return originalMethod.call(this, request, ...args);
    };
    
    return descriptor;
  };
}

// ==================== UPSTASH INTEGRATION (OPTIONAL) ====================

/**
 * Upstash Rate Limiter (for production with Redis)
 * محدد معدل Upstash (للإنتاج مع Redis)
 * 
 * To use this, install: npm install @upstash/ratelimit @upstash/redis
 * 
 * @example
 * import { Ratelimit } from '@upstash/ratelimit';
 * import { Redis } from '@upstash/redis';
 * 
 * const redis = new Redis({
 *   url: process.env.UPSTASH_REDIS_REST_URL!,
 *   token: process.env.UPSTASH_REDIS_REST_TOKEN!,
 * });
 * 
 * export const upstashRateLimiter = new Ratelimit({
 *   redis,
 *   limiter: Ratelimit.slidingWindow(100, '1 m'),
 *   analytics: true,
 * });
 */

/**
 * Check if Upstash is configured
 * التحقق إذا كان Upstash مكوناً
 */
export function isUpstashConfigured(): boolean {
  return !!(
    process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN
  );
}

/**
 * Initialize Upstash rate limiter (if configured)
 * تهيئة محدد معدل Upstash (إذا كان مكوناً)
 */
export async function initUpstashRateLimiter() {
  if (!isUpstashConfigured()) {
    console.warn('[RateLimit] Upstash not configured, using in-memory rate limiter');
    return null;
  }
  
  try {
    // Dynamically import Upstash modules (optional dependencies)
    // @ts-expect-error - Optional dependency, may not be installed
    const { Ratelimit } = await import('@upstash/ratelimit');
    // @ts-expect-error - Optional dependency, may not be installed
    const { Redis } = await import('@upstash/redis');
    
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
    
    const ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(100, '1 m'),
      analytics: true,
      prefix: 'tgg', // Traditional Games Glossary
    });
    
    console.log('[RateLimit] Upstash rate limiter initialized');
    return ratelimit;
  } catch (error) {
    console.error('[RateLimit] Failed to initialize Upstash:', error);
    return null;
  }
}

// ==================== STATISTICS ====================

/**
 * Get rate limit statistics
 * الحصول على إحصائيات حد المعدل
 */
export function getRateLimitStats() {
  return {
    api: {
      type: 'API General',
      interval: '1 minute',
      limit: RateLimitPresets.API_GENERAL.limit,
    },
    auth: {
      type: 'Authentication',
      interval: '15 minutes',
      limit: RateLimitPresets.AUTH_LOGIN.limit,
    },
    search: {
      type: 'Search',
      interval: '1 minute',
      limit: RateLimitPresets.SEARCH_PUBLIC.limit,
    },
    upload: {
      type: 'Upload',
      interval: '1 hour',
      limit: RateLimitPresets.MEDIA_UPLOAD.limit,
    },
    gameCreation: {
      type: 'Game Creation',
      interval: '24 hours',
      limit: RateLimitPresets.GAME_CREATE.limit,
    },
  };
}
