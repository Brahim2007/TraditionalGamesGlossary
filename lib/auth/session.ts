// Session Management
// إدارة الجلسات

import { cookies } from 'next/headers'
import { db } from '@/lib/db'
import { generateToken } from './password'
import {
  SESSION_COOKIE_NAME,
  SESSION_DURATION_DEFAULT,
  SESSION_DURATION_REMEMBER,
} from './constants'
import type { AuthUser, SessionData } from './types'

/**
 * Create a new session for a user
 * إنشاء جلسة جديدة للمستخدم
 */
export async function createSession(
  contributorId: string,
  rememberMe: boolean = false,
  ipAddress?: string,
  userAgent?: string
): Promise<SessionData> {
  const token = generateToken(32)
  const duration = rememberMe ? SESSION_DURATION_REMEMBER : SESSION_DURATION_DEFAULT
  const expiresAt = new Date(Date.now() + duration)

  const session = await db.session.create({
    data: {
      contributorId,
      token,
      expiresAt,
      ipAddress,
      userAgent,
    },
  })

  // Update user's last active timestamp
  await db.contributor.update({
    where: { id: contributorId },
    data: { lastActive: new Date() },
  })

  return session
}

/**
 * Set session cookie
 * تعيين كوكي الجلسة
 */
export async function setSessionCookie(
  token: string,
  expiresAt: Date
): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiresAt,
    path: '/',
  })
}

/**
 * Get session token from cookies
 * الحصول على رمز الجلسة من الكوكيز
 */
export async function getSessionToken(): Promise<string | null> {
  const cookieStore = await cookies()
  const cookie = cookieStore.get(SESSION_COOKIE_NAME)
  return cookie?.value ?? null
}

/**
 * Validate session and get user
 * التحقق من الجلسة والحصول على المستخدم
 */
export async function validateSession(token: string): Promise<AuthUser | null> {
  const session = await db.session.findUnique({
    where: { token },
    include: {
      contributor: true,
    },
  })

  if (!session) {
    return null
  }

  // Check if session has expired
  if (session.expiresAt < new Date()) {
    await db.session.delete({ where: { id: session.id } })
    return null
  }

  const { contributor } = session

  return {
    id: contributor.id,
    name: contributor.name,
    email: contributor.email,
    role: contributor.role,
    avatarUrl: contributor.avatarUrl,
    institution: contributor.institution,
  }
}

/**
 * Get current user from session cookie
 * الحصول على المستخدم الحالي من كوكي الجلسة
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const token = await getSessionToken()
  if (!token) return null
  return validateSession(token)
}

/**
 * Destroy a session
 * إنهاء الجلسة
 */
export async function destroySession(token: string): Promise<void> {
  await db.session.deleteMany({
    where: { token },
  })
}

/**
 * Clear session cookie
 * مسح كوكي الجلسة
 */
export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}

/**
 * Cleanup expired sessions
 * تنظيف الجلسات المنتهية
 */
export async function cleanupExpiredSessions(): Promise<number> {
  const result = await db.session.deleteMany({
    where: {
      expiresAt: { lt: new Date() },
    },
  })
  return result.count
}

/**
 * Get all active sessions for a user
 * الحصول على جميع الجلسات النشطة للمستخدم
 */
export async function getUserSessions(
  contributorId: string
): Promise<SessionData[]> {
  return db.session.findMany({
    where: {
      contributorId,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: 'desc' },
  })
}

/**
 * Revoke all sessions for a user (except current)
 * إلغاء جميع جلسات المستخدم (باستثناء الحالية)
 */
export async function revokeOtherSessions(
  contributorId: string,
  currentToken: string
): Promise<number> {
  const result = await db.session.deleteMany({
    where: {
      contributorId,
      token: { not: currentToken },
    },
  })
  return result.count
}
