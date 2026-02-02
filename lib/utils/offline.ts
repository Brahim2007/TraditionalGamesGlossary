/**
 * Offline Mode Utilities
 * أدوات وضع عدم الاتصال
 * 
 * This module provides utilities for offline functionality
 * يوفر هذا الوحدة أدوات لوظيفة عدم الاتصال
 */

// ==================== OFFLINE DETECTION ====================

/**
 * Check if browser is online
 * التحقق إذا كان المتصفح متصلاً
 */
export function isOnline(): boolean {
  return typeof navigator !== 'undefined' ? navigator.onLine : true;
}

/**
 * Listen to online/offline events
 * الاستماع إلى أحداث الاتصال/عدم الاتصال
 */
export function onConnectionChange(
  onOnline: () => void,
  onOffline: () => void
): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }
  
  window.addEventListener('online', onOnline);
  window.addEventListener('offline', onOffline);
  
  // Return cleanup function
  return () => {
    window.removeEventListener('online', onOnline);
    window.removeEventListener('offline', onOffline);
  };
}

/**
 * Wait for connection to be restored
 * انتظار استعادة الاتصال
 */
export function waitForConnection(timeout?: number): Promise<void> {
  return new Promise((resolve, reject) => {
    if (isOnline()) {
      resolve();
      return;
    }
    
    const onOnline = () => {
      cleanup();
      resolve();
    };
    
    const cleanup = onConnectionChange(onOnline, () => {});
    
    if (timeout) {
      setTimeout(() => {
        cleanup();
        reject(new Error('Connection timeout'));
      }, timeout);
    }
  });
}

// ==================== LOCAL STORAGE ====================

/**
 * Local storage wrapper with offline support
 * غلاف التخزين المحلي مع دعم عدم الاتصال
 */
export class OfflineStorage {
  private prefix: string;
  
  constructor(prefix: string = 'tgg_offline') {
    this.prefix = prefix;
  }
  
  /**
   * Get item from storage
   * الحصول على عنصر من التخزين
   */
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(`${this.prefix}_${key}`);
      if (!item) return null;
      
      const parsed = JSON.parse(item);
      
      // Check expiration
      if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
        this.remove(key);
        return null;
      }
      
      return parsed.value as T;
    } catch (error) {
      console.error('Failed to get from offline storage:', error);
      return null;
    }
  }
  
  /**
   * Set item in storage
   * تعيين عنصر في التخزين
   */
  set<T>(key: string, value: T, ttl?: number): boolean {
    try {
      const item = {
        value,
        createdAt: Date.now(),
        expiresAt: ttl ? Date.now() + ttl : null,
      };
      
      localStorage.setItem(`${this.prefix}_${key}`, JSON.stringify(item));
      return true;
    } catch (error) {
      console.error('Failed to set in offline storage:', error);
      return false;
    }
  }
  
  /**
   * Remove item from storage
   * إزالة عنصر من التخزين
   */
  remove(key: string): void {
    try {
      localStorage.removeItem(`${this.prefix}_${key}`);
    } catch (error) {
      console.error('Failed to remove from offline storage:', error);
    }
  }
  
  /**
   * Clear all items
   * مسح جميع العناصر
   */
  clear(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Failed to clear offline storage:', error);
    }
  }
  
  /**
   * Get all keys
   * الحصول على جميع المفاتيح
   */
  keys(): string[] {
    try {
      const keys = Object.keys(localStorage);
      return keys
        .filter(key => key.startsWith(this.prefix))
        .map(key => key.replace(`${this.prefix}_`, ''));
    } catch (error) {
      console.error('Failed to get keys from offline storage:', error);
      return [];
    }
  }
  
  /**
   * Get storage size in bytes
   * الحصول على حجم التخزين بالبايتات
   */
  getSize(): number {
    try {
      let size = 0;
      const keys = Object.keys(localStorage);
      
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          const item = localStorage.getItem(key);
          if (item) {
            size += item.length + key.length;
          }
        }
      });
      
      return size;
    } catch (error) {
      console.error('Failed to get storage size:', error);
      return 0;
    }
  }
}

// ==================== OFFLINE QUEUE ====================

/**
 * Queue for offline requests
 * قائمة انتظار للطلبات في وضع عدم الاتصال
 */
export class OfflineQueue {
  private storage: OfflineStorage;
  private queueKey: string;
  
  constructor(queueKey: string = 'request_queue') {
    this.storage = new OfflineStorage();
    this.queueKey = queueKey;
  }
  
  /**
   * Add request to queue
   * إضافة طلب إلى قائمة الانتظار
   */
  enqueue(request: OfflineRequest): void {
    const queue = this.getQueue();
    queue.push({
      ...request,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      retries: 0,
    });
    this.storage.set(this.queueKey, queue);
  }
  
  /**
   * Get next request from queue
   * الحصول على الطلب التالي من قائمة الانتظار
   */
  dequeue(): OfflineRequestWithMeta | null {
    const queue = this.getQueue();
    if (queue.length === 0) return null;
    
    const request = queue.shift();
    this.storage.set(this.queueKey, queue);
    
    return request || null;
  }
  
  /**
   * Get all requests in queue
   * الحصول على جميع الطلبات في قائمة الانتظار
   */
  getQueue(): OfflineRequestWithMeta[] {
    return this.storage.get<OfflineRequestWithMeta[]>(this.queueKey) || [];
  }
  
  /**
   * Clear queue
   * مسح قائمة الانتظار
   */
  clear(): void {
    this.storage.remove(this.queueKey);
  }
  
  /**
   * Get queue size
   * الحصول على حجم قائمة الانتظار
   */
  size(): number {
    return this.getQueue().length;
  }
  
  /**
   * Process queue when online
   * معالجة قائمة الانتظار عند الاتصال
   */
  async processQueue(
    processor: (request: OfflineRequestWithMeta) => Promise<boolean>
  ): Promise<{ processed: number; failed: number }> {
    let processed = 0;
    let failed = 0;
    
    const queue = this.getQueue();
    const newQueue: OfflineRequestWithMeta[] = [];
    
    for (const request of queue) {
      try {
        const success = await processor(request);
        
        if (success) {
          processed++;
        } else {
          // Retry with exponential backoff
          if (request.retries < 3) {
            request.retries++;
            newQueue.push(request);
          } else {
            failed++;
          }
        }
      } catch (error) {
        console.error('Failed to process offline request:', error);
        
        if (request.retries < 3) {
          request.retries++;
          newQueue.push(request);
        } else {
          failed++;
        }
      }
    }
    
    this.storage.set(this.queueKey, newQueue);
    
    return { processed, failed };
  }
}

// ==================== OFFLINE CACHE ====================

/**
 * Cache for offline data
 * ذاكرة تخزين مؤقت لبيانات عدم الاتصال
 */
export class OfflineCache {
  private storage: OfflineStorage;
  
  constructor() {
    this.storage = new OfflineStorage('tgg_cache');
  }
  
  /**
   * Cache data for offline use
   * تخزين البيانات للاستخدام في وضع عدم الاتصال
   */
  cache<T>(key: string, data: T, ttl?: number): void {
    this.storage.set(key, data, ttl);
  }
  
  /**
   * Get cached data
   * الحصول على البيانات المخزنة مؤقتاً
   */
  getCached<T>(key: string): T | null {
    return this.storage.get<T>(key);
  }
  
  /**
   * Remove cached data
   * إزالة البيانات المخزنة مؤقتاً
   */
  removeCached(key: string): void {
    this.storage.remove(key);
  }
  
  /**
   * Clear all cached data
   * مسح جميع البيانات المخزنة مؤقتاً
   */
  clearCache(): void {
    this.storage.clear();
  }
  
  /**
   * Get cache statistics
   * الحصول على إحصائيات ذاكرة التخزين المؤقت
   */
  getStats(): { keys: number; size: string } {
    const keys = this.storage.keys();
    const size = this.storage.getSize();
    
    return {
      keys: keys.length,
      size: `${(size / 1024).toFixed(2)} KB`,
    };
  }
}

// ==================== OFFLINE SYNC ====================

/**
 * Sync manager for offline data
 * مدير المزامنة لبيانات عدم الاتصال
 */
export class OfflineSyncManager {
  private queue: OfflineQueue;
  private cache: OfflineCache;
  private isSyncing: boolean = false;
  
  constructor() {
    this.queue = new OfflineQueue();
    this.cache = new OfflineCache();
    
    // Auto-sync when connection is restored
    if (typeof window !== 'undefined') {
      onConnectionChange(
        () => this.sync(),
        () => console.log('[Offline] Connection lost')
      );
    }
  }
  
  /**
   * Add request to sync queue
   * إضافة طلب إلى قائمة المزامنة
   */
  addToQueue(request: OfflineRequest): void {
    this.queue.enqueue(request);
    console.log('[Offline] Request queued for sync');
  }
  
  /**
   * Sync queued requests
   * مزامنة الطلبات في قائمة الانتظار
   */
  async sync(): Promise<void> {
    if (this.isSyncing) {
      console.log('[Offline] Sync already in progress');
      return;
    }
    
    if (!isOnline()) {
      console.log('[Offline] Cannot sync - offline');
      return;
    }
    
    this.isSyncing = true;
    console.log('[Offline] Starting sync...');
    
    try {
      const result = await this.queue.processQueue(async (request) => {
        try {
          const response = await fetch(request.url, {
            method: request.method,
            headers: request.headers,
            body: request.body ? JSON.stringify(request.body) : undefined,
          });
          
          return response.ok;
        } catch (error) {
          console.error('[Offline] Sync request failed:', error);
          return false;
        }
      });
      
      console.log(`[Offline] Sync completed: ${result.processed} processed, ${result.failed} failed`);
    } catch (error) {
      console.error('[Offline] Sync error:', error);
    } finally {
      this.isSyncing = false;
    }
  }
  
  /**
   * Cache data for offline use
   * تخزين البيانات للاستخدام في وضع عدم الاتصال
   */
  cacheData<T>(key: string, data: T, ttl?: number): void {
    this.cache.cache(key, data, ttl);
  }
  
  /**
   * Get cached data
   * الحصول على البيانات المخزنة مؤقتاً
   */
  getCachedData<T>(key: string): T | null {
    return this.cache.getCached<T>(key);
  }
  
  /**
   * Get sync status
   * الحصول على حالة المزامنة
   */
  getStatus(): OfflineSyncStatus {
    return {
      online: isOnline(),
      syncing: this.isSyncing,
      queueSize: this.queue.size(),
      cacheStats: this.cache.getStats(),
    };
  }
  
  /**
   * Clear all offline data
   * مسح جميع بيانات عدم الاتصال
   */
  clearAll(): void {
    this.queue.clear();
    this.cache.clearCache();
    console.log('[Offline] All offline data cleared');
  }
}

// ==================== OFFLINE-FIRST FETCH ====================

/**
 * Fetch with offline-first strategy
 * جلب البيانات مع استراتيجية عدم الاتصال أولاً
 */
export async function offlineFirstFetch<T>(
  url: string,
  options?: RequestInit,
  cacheKey?: string
): Promise<T> {
  const cache = new OfflineCache();
  const key = cacheKey || url;
  
  // Try cache first
  const cached = cache.getCached<T>(key);
  
  if (!isOnline()) {
    if (cached) {
      console.log('[Offline] Returning cached data');
      return cached;
    }
    throw new Error('No cached data available offline');
  }
  
  try {
    // Fetch from network
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Cache the result
    cache.cache(key, data, 24 * 60 * 60 * 1000); // 24 hours
    
    return data;
  } catch (error) {
    // If fetch fails and we have cache, return it
    if (cached) {
      console.log('[Offline] Network failed, returning cached data');
      return cached;
    }
    
    throw error;
  }
}

/**
 * Fetch with network-first strategy
 * جلب البيانات مع استراتيجية الشبكة أولاً
 */
export async function networkFirstFetch<T>(
  url: string,
  options?: RequestInit,
  cacheKey?: string
): Promise<T> {
  const cache = new OfflineCache();
  const key = cacheKey || url;
  
  if (!isOnline()) {
    const cached = cache.getCached<T>(key);
    if (cached) {
      return cached;
    }
    throw new Error('No network connection and no cached data');
  }
  
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    cache.cache(key, data, 24 * 60 * 60 * 1000);
    
    return data;
  } catch (error) {
    const cached = cache.getCached<T>(key);
    if (cached) {
      console.log('[Offline] Network failed, returning cached data');
      return cached;
    }
    throw error;
  }
}

// ==================== TYPES ====================

export interface OfflineRequest {
  url: string;
  method: string;
  headers?: Record<string, string>;
  body?: any;
}

export interface OfflineRequestWithMeta extends OfflineRequest {
  id: string;
  timestamp: number;
  retries: number;
}

export interface OfflineSyncStatus {
  online: boolean;
  syncing: boolean;
  queueSize: number;
  cacheStats: {
    keys: number;
    size: string;
  };
}

// ==================== EXPORT SINGLETON ====================

export const offlineSync = new OfflineSyncManager();
export const offlineStorage = new OfflineStorage();
export const offlineCache = new OfflineCache();
