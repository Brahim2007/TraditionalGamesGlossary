// Security Utilities for Traditional Games Glossary
// أدوات الأمان لمعجم الألعاب التراثية

import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

// ==================== RATE LIMITING ====================

interface RateLimitConfig {
  maxRequests: number
  windowMs: number
}

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

const rateLimitStore: RateLimitStore = {}

/**
 * Rate limiting middleware
 * وسيط تحديد معدل الطلبات
 */
export function rateLimit(
  request: NextRequest,
  config: RateLimitConfig = { maxRequests: 100, windowMs: 60 * 1000 } // 100 requests per minute
): { allowed: boolean; remaining: number; resetTime: number } {
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
  const key = `rate-limit:${ip}`
  const now = Date.now()

  if (!rateLimitStore[key] || rateLimitStore[key].resetTime < now) {
    rateLimitStore[key] = {
      count: 1,
      resetTime: now + config.windowMs
    }
    return { allowed: true, remaining: config.maxRequests - 1, resetTime: rateLimitStore[key].resetTime }
  }

  if (rateLimitStore[key].count >= config.maxRequests) {
    return { allowed: false, remaining: 0, resetTime: rateLimitStore[key].resetTime }
  }

  rateLimitStore[key].count++
  return { allowed: true, remaining: config.maxRequests - rateLimitStore[key].count, resetTime: rateLimitStore[key].resetTime }
}

/**
 * API rate limiting wrapper
 * غلاف تحديد معدل الطلبات للـ API
 */
export function withRateLimit(
  handler: Function,
  config?: RateLimitConfig
) {
  return async (request: NextRequest, ...args: any[]) => {
    const rateLimitResult = rateLimit(request, config)
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'تم تجاوز الحد الأقصى للطلبات. يرجى المحاولة لاحقاً.' },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': config?.maxRequests.toString() || '100',
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.resetTime.toString()
          }
        }
      )
    }

    const response = await handler(request, ...args)
    
    // Add rate limit headers to response
    response.headers.set('X-RateLimit-Limit', config?.maxRequests.toString() || '100')
    response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString())
    response.headers.set('X-RateLimit-Reset', rateLimitResult.resetTime.toString())
    
    return response
  }
}

// ==================== CSRF PROTECTION ====================

/**
 * Generate CSRF token
 * إنشاء رمز CSRF
 */
export function generateCsrfToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

/**
 * Validate CSRF token
 * التحقق من صحة رمز CSRF
 */
export function validateCsrfToken(token: string, storedToken: string): boolean {
  if (!token || !storedToken) return false
  
  // Use timing-safe comparison
  return crypto.timingSafeEqual(
    Buffer.from(token, 'hex'),
    Buffer.from(storedToken, 'hex')
  )
}

/**
 * CSRF protection middleware
 * وسيط حماية CSRF
 */
export function csrfProtection(request: NextRequest): { valid: boolean; error?: string } {
  // Skip for GET requests
  if (request.method === 'GET') {
    return { valid: true }
  }

  const csrfToken = request.headers.get('x-csrf-token') || 
                   (request as any).body?.csrfToken
  
  const cookieToken = request.cookies.get('csrf-token')?.value

  if (!csrfToken || !cookieToken) {
    return { valid: false, error: 'رمز CSRF مفقود' }
  }

  if (!validateCsrfToken(csrfToken, cookieToken)) {
    return { valid: false, error: 'رمز CSRF غير صالح' }
  }

  return { valid: true }
}

// ==================== INPUT SANITIZATION ====================

/**
 * Sanitize user input to prevent XSS
 * تطهير مدخلات المستخدم لمنع هجمات XSS
 */
export function sanitizeInput(input: string): string {
  if (!input) return ''
  
  return input
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .replace(/\\/g, '&#x5C;')
    .replace(/`/g, '&#x60;')
    .trim()
}

/**
 * Sanitize HTML content (allow safe tags)
 * تطهير محتوى HTML (السماح بالوسوم الآمنة)
 */
export function sanitizeHtml(html: string): string {
  if (!html) return ''
  
  // Allow only safe HTML tags for rich text
  const allowedTags = {
    'b': [], 'strong': [], 'i': [], 'em': [], 'u': [], 'br': [], 'p': [],
    'ul': [], 'ol': [], 'li': [], 'h1': [], 'h2': [], 'h3': [], 'h4': [], 'h5': [], 'h6': [],
    'a': ['href', 'title', 'target'], 'img': ['src', 'alt', 'title', 'width', 'height'],
    'blockquote': [], 'code': [], 'pre': [], 'span': ['class'], 'div': ['class']
  }
  
  // Simple sanitization - in production, use a library like DOMPurify
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/g, '')
    .replace(/javascript:/gi, '')
    .replace(/data:/gi, '')
}

// ==================== SQL INJECTION PREVENTION ====================

/**
 * Validate and sanitize SQL parameters
 * التحقق من صحة وتطهير معاملات SQL
 */
export function sanitizeSqlParam(param: any): string {
  if (typeof param !== 'string') return param
  
  // Remove SQL injection patterns
  return param
    .replace(/'/g, "''")
    .replace(/--/g, '')
    .replace(/;/g, '')
    .replace(/\/\*/g, '')
    .replace(/\*\//g, '')
    .replace(/union/gi, '')
    .replace(/select/gi, '')
    .replace(/insert/gi, '')
    .replace(/update/gi, '')
    .replace(/delete/gi, '')
    .replace(/drop/gi, '')
    .replace(/create/gi, '')
    .replace(/alter/gi, '')
    .replace(/exec/gi, '')
    .replace(/execute/gi, '')
}

// ==================== HEADER SECURITY ====================

/**
 * Add security headers to response
 * إضافة رؤوس الأمان للاستجابة
 */
export function addSecurityHeaders(response: NextResponse): NextResponse {
  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self'",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "form-action 'self'"
  ].join('; ')

  response.headers.set('Content-Security-Policy', csp)
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  
  // HSTS for production
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  }

  return response
}

// ==================== PASSWORD SECURITY ====================

/**
 * Check if password is in common passwords list
 * التحقق إذا كانت كلمة المرور في قائمة كلمات المرور الشائعة
 */
export function isCommonPassword(password: string): boolean {
  const commonPasswords = [
    '123456', 'password', '12345678', 'qwerty', '123456789',
    '12345', '1234', '111111', '1234567', 'dragon',
    '123123', 'baseball', 'abc123', 'football', 'monkey',
    'letmein', '696969', 'shadow', 'master', '666666',
    'qwertyuiop', '123321', 'mustang', '1234567890',
    'michael', '654321', 'superman', '1qaz2wsx', '7777777',
    'fuckyou', '121212', '000000', 'qazwsx', '123qwe',
    'killer', 'trustno1', 'jordan', 'jennifer', 'zxcvbnm',
    'asdfgh', 'hunter', 'buster', 'soccer', 'harley',
    'batman', 'andrew', 'tigger', 'sunshine', 'iloveyou',
    'fuckme', '2000', 'charlie', 'robert', 'thomas',
    'hockey', 'ranger', 'daniel', 'starwars', 'klaster',
    '112233', 'george', 'asshole', 'computer', 'michelle',
    'jessica', 'pepper', '1111', 'zxcvbn', '555555',
    '11111111', '131313', 'freedom', '777777', 'pass',
    'fuck', 'maggie', '159753', 'aaaaaa', 'ginger',
    'princess', 'joshua', 'cheese', 'amanda', 'summer',
    'love', 'ashley', '6969', 'nicole', 'chelsea',
    'biteme', 'matthew', 'access', 'yankees', '987654321',
    'dallas', 'austin', 'thunder', 'taylor', 'matrix'
  ]
  
  return commonPasswords.includes(password.toLowerCase())
}

/**
 * Calculate password strength score (0-100)
 * حساب درجة قوة كلمة المرور (0-100)
 */
export function calculatePasswordStrength(password: string): number {
  let score = 0
  
  // Length
  if (password.length >= 8) score += 25
  if (password.length >= 12) score += 15
  if (password.length >= 16) score += 10
  
  // Character variety
  if (/[a-z]/.test(password)) score += 10
  if (/[A-Z]/.test(password)) score += 10
  if (/[0-9]/.test(password)) score += 10
  if (/[^a-zA-Z0-9]/.test(password)) score += 10
  
  // Avoid common patterns
  if (!isCommonPassword(password)) score += 20
  
  // Avoid sequential characters
  if (!/(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|012|123|234|345|456|567|678|789)/i.test(password)) {
    score += 10
  }
  
  return Math.min(score, 100)
}

// ==================== SESSION SECURITY ====================

/**
 * Generate secure session ID
 * إنشاء معرف جلسة آمن
 */
export function generateSessionId(): string {
  return crypto.randomBytes(32).toString('hex')
}

/**
 * Validate session ID format
 * التحقق من تنسيق معرف الجلسة
 */
export function isValidSessionId(sessionId: string): boolean {
  return /^[a-f0-9]{64}$/.test(sessionId)
}

// ==================== EXPORT TYPES ====================

export interface SecurityConfig {
  rateLimit?: RateLimitConfig
  enableCsrf?: boolean
  enableCsp?: boolean
}

export type SecurityMiddleware = (request: NextRequest) => Promise<NextResponse | null>

// ==================== SECRETS MANAGEMENT ====================

/**
 * Secrets Manager for environment variables
 * مدير الأسرار لمتغيرات البيئة
 */
export class SecretsManager {
  private static instance: SecretsManager;
  private secrets: Map<string, string> = new Map();

  private constructor() {
    this.loadSecrets();
  }

  static getInstance(): SecretsManager {
    if (!SecretsManager.instance) {
      SecretsManager.instance = new SecretsManager();
    }
    return SecretsManager.instance;
  }

  /**
   * Load secrets from environment variables
   * تحميل الأسرار من متغيرات البيئة
   */
  private loadSecrets(): void {
    // Database
    this.setSecret('DATABASE_URL', process.env.DATABASE_URL);
    this.setSecret('DATABASE_URL_UNPOOLED', process.env.DATABASE_URL_UNPOOLED);
    
    // Authentication
    this.setSecret('SESSION_SECRET', process.env.SESSION_SECRET);
    this.setSecret('JWT_SECRET', process.env.JWT_SECRET);
    
    // API Keys
    this.setSecret('CLOUDINARY_CLOUD_NAME', process.env.CLOUDINARY_CLOUD_NAME);
    this.setSecret('CLOUDINARY_API_KEY', process.env.CLOUDINARY_API_KEY);
    this.setSecret('CLOUDINARY_API_SECRET', process.env.CLOUDINARY_API_SECRET);
    
    // Upstash (Rate Limiting)
    this.setSecret('UPSTASH_REDIS_REST_URL', process.env.UPSTASH_REDIS_REST_URL);
    this.setSecret('UPSTASH_REDIS_REST_TOKEN', process.env.UPSTASH_REDIS_REST_TOKEN);
    
    // Email (if configured)
    this.setSecret('SMTP_HOST', process.env.SMTP_HOST);
    this.setSecret('SMTP_PORT', process.env.SMTP_PORT);
    this.setSecret('SMTP_USER', process.env.SMTP_USER);
    this.setSecret('SMTP_PASSWORD', process.env.SMTP_PASSWORD);
    
    // AI Services (if configured)
    this.setSecret('OPENAI_API_KEY', process.env.OPENAI_API_KEY);
    this.setSecret('ANTHROPIC_API_KEY', process.env.ANTHROPIC_API_KEY);
  }

  /**
   * Set a secret
   * تعيين سر
   */
  private setSecret(key: string, value: string | undefined): void {
    if (value) {
      this.secrets.set(key, value);
    }
  }

  /**
   * Get a secret
   * الحصول على سر
   */
  getSecret(key: string): string | undefined {
    return this.secrets.get(key);
  }

  /**
   * Get a required secret (throws if missing)
   * الحصول على سر مطلوب (يرمي خطأ إذا كان مفقوداً)
   */
  getRequiredSecret(key: string): string {
    const value = this.secrets.get(key);
    if (!value) {
      throw new Error(`Required secret "${key}" is missing`);
    }
    return value;
  }

  /**
   * Check if a secret exists
   * التحقق إذا كان السر موجوداً
   */
  hasSecret(key: string): boolean {
    return this.secrets.has(key);
  }

  /**
   * Validate required secrets
   * التحقق من الأسرار المطلوبة
   */
  validateRequiredSecrets(requiredKeys: string[]): { valid: boolean; missing: string[] } {
    const missing = requiredKeys.filter(key => !this.hasSecret(key));
    return {
      valid: missing.length === 0,
      missing,
    };
  }

  /**
   * Get masked secret for logging
   * الحصول على سر مقنع للتسجيل
   */
  getMaskedSecret(key: string): string {
    const value = this.secrets.get(key);
    if (!value) return 'NOT_SET';
    if (value.length <= 8) return '****';
    return `${value.slice(0, 4)}...${value.slice(-4)}`;
  }

  /**
   * Get all secrets status (for health check)
   * الحصول على حالة جميع الأسرار (للفحص الصحي)
   */
  getSecretsStatus(): Record<string, boolean> {
    const status: Record<string, boolean> = {};
    const allKeys = [
      'DATABASE_URL',
      'SESSION_SECRET',
      'JWT_SECRET',
      'CLOUDINARY_CLOUD_NAME',
      'CLOUDINARY_API_KEY',
      'CLOUDINARY_API_SECRET',
      'UPSTASH_REDIS_REST_URL',
      'UPSTASH_REDIS_REST_TOKEN',
    ];
    
    for (const key of allKeys) {
      status[key] = this.hasSecret(key);
    }
    
    return status;
  }
}

// Export singleton instance
export const secrets = SecretsManager.getInstance();

// ==================== CSRF TOKEN MANAGEMENT ====================

/**
 * CSRF Token Manager
 * مدير رموز CSRF
 */
export class CsrfTokenManager {
  private static tokens: Map<string, { token: string; expiresAt: number }> = new Map();
  private static readonly TOKEN_LIFETIME = 60 * 60 * 1000; // 1 hour

  /**
   * Generate and store CSRF token for session
   * إنشاء وتخزين رمز CSRF للجلسة
   */
  static generateToken(sessionId: string): string {
    const token = generateCsrfToken();
    const expiresAt = Date.now() + this.TOKEN_LIFETIME;
    
    this.tokens.set(sessionId, { token, expiresAt });
    
    // Clean up expired tokens
    this.cleanup();
    
    return token;
  }

  /**
   * Validate CSRF token for session
   * التحقق من صحة رمز CSRF للجلسة
   */
  static validateToken(sessionId: string, token: string): boolean {
    const stored = this.tokens.get(sessionId);
    
    if (!stored) return false;
    if (Date.now() > stored.expiresAt) {
      this.tokens.delete(sessionId);
      return false;
    }
    
    try {
      return validateCsrfToken(token, stored.token);
    } catch {
      return false;
    }
  }

  /**
   * Refresh token for session
   * تحديث الرمز للجلسة
   */
  static refreshToken(sessionId: string): string {
    return this.generateToken(sessionId);
  }

  /**
   * Remove token for session
   * إزالة الرمز للجلسة
   */
  static removeToken(sessionId: string): void {
    this.tokens.delete(sessionId);
  }

  /**
   * Clean up expired tokens
   * تنظيف الرموز المنتهية الصلاحية
   */
  private static cleanup(): void {
    const now = Date.now();
    for (const [sessionId, data] of this.tokens.entries()) {
      if (now > data.expiresAt) {
        this.tokens.delete(sessionId);
      }
    }
  }
}

// ==================== TWO-FACTOR AUTHENTICATION ====================

/**
 * Generate 2FA secret
 * إنشاء سر المصادقة الثنائية
 */
export function generate2FASecret(): string {
  return crypto.randomBytes(20).toString('hex');
}

/**
 * Generate 2FA code (TOTP-like)
 * إنشاء رمز المصادقة الثنائية
 */
export function generate2FACode(secret: string, timestamp?: number): string {
  const time = timestamp || Date.now();
  const counter = Math.floor(time / 30000); // 30 second window
  
  const hmac = crypto.createHmac('sha1', secret);
  hmac.update(counter.toString());
  const hash = hmac.digest();
  
  const offset = hash[hash.length - 1] & 0xf;
  const code = (
    ((hash[offset] & 0x7f) << 24) |
    ((hash[offset + 1] & 0xff) << 16) |
    ((hash[offset + 2] & 0xff) << 8) |
    (hash[offset + 3] & 0xff)
  ) % 1000000;
  
  return code.toString().padStart(6, '0');
}

/**
 * Verify 2FA code
 * التحقق من رمز المصادقة الثنائية
 */
export function verify2FACode(secret: string, code: string, window: number = 1): boolean {
  const now = Date.now();
  
  // Check current time and adjacent windows
  for (let i = -window; i <= window; i++) {
    const timestamp = now + (i * 30000);
    const expectedCode = generate2FACode(secret, timestamp);
    
    if (code === expectedCode) {
      return true;
    }
  }
  
  return false;
}

/**
 * Generate backup codes for 2FA
 * إنشاء رموز احتياطية للمصادقة الثنائية
 */
export function generate2FABackupCodes(count: number = 10): string[] {
  const codes: string[] = [];
  
  for (let i = 0; i < count; i++) {
    const code = crypto.randomBytes(4).toString('hex').toUpperCase();
    codes.push(`${code.slice(0, 4)}-${code.slice(4)}`);
  }
  
  return codes;
}

// ==================== API KEY MANAGEMENT ====================

/**
 * Generate API key
 * إنشاء مفتاح API
 */
export function generateApiKey(prefix: string = 'tgg'): string {
  const key = crypto.randomBytes(32).toString('hex');
  return `${prefix}_${key}`;
}

/**
 * Validate API key format
 * التحقق من تنسيق مفتاح API
 */
export function isValidApiKey(key: string): boolean {
  return /^[a-z]+_[a-f0-9]{64}$/.test(key);
}

/**
 * Hash API key for storage
 * تجزئة مفتاح API للتخزين
 */
export function hashApiKey(key: string): string {
  return crypto.createHash('sha256').update(key).digest('hex');
}

// ==================== ENCRYPTION UTILITIES ====================

/**
 * Encrypt sensitive data
 * تشفير البيانات الحساسة
 */
export function encryptData(data: string, key?: string): string {
  const encryptionKey = key || secrets.getRequiredSecret('SESSION_SECRET');
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    crypto.createHash('sha256').update(encryptionKey).digest(),
    iv
  );
  
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return `${iv.toString('hex')}:${encrypted}`;
}

/**
 * Decrypt sensitive data
 * فك تشفير البيانات الحساسة
 */
export function decryptData(encryptedData: string, key?: string): string {
  const encryptionKey = key || secrets.getRequiredSecret('SESSION_SECRET');
  const [ivHex, encrypted] = encryptedData.split(':');
  
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    crypto.createHash('sha256').update(encryptionKey).digest(),
    iv
  );
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

// ==================== SECURITY AUDIT ====================

/**
 * Perform security audit
 * إجراء تدقيق أمني
 */
export function performSecurityAudit(): {
  passed: boolean;
  issues: string[];
  recommendations: string[];
} {
  const issues: string[] = [];
  const recommendations: string[] = [];
  
  // Check required secrets
  const requiredSecrets = ['DATABASE_URL', 'SESSION_SECRET'];
  const secretsValidation = secrets.validateRequiredSecrets(requiredSecrets);
  
  if (!secretsValidation.valid) {
    issues.push(`Missing required secrets: ${secretsValidation.missing.join(', ')}`);
  }
  
  // Check if in production
  if (process.env.NODE_ENV === 'production') {
    // Check HTTPS
    if (!process.env.NEXTAUTH_URL?.startsWith('https://')) {
      issues.push('HTTPS not configured for production');
    }
    
    // Check if using strong session secret
    const sessionSecret = secrets.getSecret('SESSION_SECRET');
    if (sessionSecret && sessionSecret.length < 32) {
      issues.push('Session secret is too short (minimum 32 characters)');
    }
  }
  
  // Recommendations
  if (!secrets.hasSecret('UPSTASH_REDIS_REST_URL')) {
    recommendations.push('Consider using Upstash Redis for distributed rate limiting');
  }
  
  if (!secrets.hasSecret('SMTP_HOST')) {
    recommendations.push('Configure SMTP for email notifications');
  }
  
  return {
    passed: issues.length === 0,
    issues,
    recommendations,
  };
}