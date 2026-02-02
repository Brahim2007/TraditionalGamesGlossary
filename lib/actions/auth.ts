'use server'

// Authentication Server Actions
// إجراءات المصادقة

import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { db } from '@/lib/db'
import {
  hashPassword,
  verifyPassword,
  generateToken,
  createSession,
  setSessionCookie,
  getSessionToken,
  destroySession,
  clearSessionCookie,
  getCurrentUser,
  DEFAULT_LOGIN_REDIRECT,
  LOGIN_PAGE,
} from '@/lib/auth'

const RESET_TOKEN_EXPIRY = 60 * 60 * 1000 // 1 hour in ms
import type { AuthResult, AuthUser } from '@/lib/auth'

/**
 * Login with email and password
 * تسجيل الدخول بالبريد الإلكتروني وكلمة المرور
 */
export async function login(formData: FormData): Promise<AuthResult> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const rememberMe = formData.get('rememberMe') === 'true'
  const redirectTo = (formData.get('redirectTo') as string) || DEFAULT_LOGIN_REDIRECT

  if (!email || !password) {
    return {
      success: false,
      error: 'البريد الإلكتروني وكلمة المرور مطلوبان',
      errorCode: 'INVALID_CREDENTIALS',
    }
  }

  try {
    // Find user by email
    const contributor = await db.contributor.findUnique({
      where: { email: email.toLowerCase().trim() },
    })

    if (!contributor) {
      return {
        success: false,
        error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
        errorCode: 'INVALID_CREDENTIALS',
      }
    }

    // Check if password exists
    if (!contributor.passwordHash) {
      return {
        success: false,
        error: 'يرجى تعيين كلمة المرور أولاً',
        errorCode: 'INVALID_CREDENTIALS',
      }
    }

    // Verify password
    const isValid = await verifyPassword(password, contributor.passwordHash)
    if (!isValid) {
      return {
        success: false,
        error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
        errorCode: 'INVALID_CREDENTIALS',
      }
    }

    // Get request metadata
    const headersList = await headers()
    const ipAddress = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown'
    const userAgent = headersList.get('user-agent') || undefined

    // Create session
    const session = await createSession(
      contributor.id,
      rememberMe,
      ipAddress,
      userAgent || undefined
    )

    // Set cookie
    await setSessionCookie(session.token, session.expiresAt)

    // Log system event
    await db.systemLog.create({
      data: {
        action: 'login',
        entityType: 'Contributor',
        entityId: contributor.id,
        userId: contributor.id,
        details: { rememberMe },
        ipAddress,
        userAgent,
      },
    })

    const user: AuthUser = {
      id: contributor.id,
      name: contributor.name,
      email: contributor.email,
      role: contributor.role,
      avatarUrl: contributor.avatarUrl,
      institution: contributor.institution,
    }

    return { success: true, user }
  } catch (error) {
    console.error('Login error:', error)
    return {
      success: false,
      error: 'حدث خطأ في الخادم، يرجى المحاولة لاحقاً',
      errorCode: 'SERVER_ERROR',
    }
  }
}

/**
 * Logout current user
 * تسجيل خروج المستخدم الحالي
 */
export async function logout(): Promise<void> {
  const token = await getSessionToken()

  if (token) {
    // Log the logout
    const user = await getCurrentUser()
    if (user) {
      const headersList = await headers()
      const ipAddress = headersList.get('x-forwarded-for') || 'unknown'
      const userAgent = headersList.get('user-agent') || undefined

      await db.systemLog.create({
        data: {
          action: 'logout',
          entityType: 'Contributor',
          entityId: user.id,
          userId: user.id,
          ipAddress,
          userAgent,
        },
      })
    }

    await destroySession(token)
  }

  await clearSessionCookie()
  redirect(LOGIN_PAGE)
}

/**
 * Get current authenticated user
 * الحصول على المستخدم المصادق الحالي
 */
export async function getAuthUser(): Promise<AuthUser | null> {
  return getCurrentUser()
}

/**
 * Request password reset
 * طلب إعادة تعيين كلمة المرور
 */
export async function requestPasswordReset(
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  const email = formData.get('email') as string

  if (!email) {
    return { success: false, message: 'البريد الإلكتروني مطلوب' }
  }

  try {
    const contributor = await db.contributor.findUnique({
      where: { email: email.toLowerCase().trim() },
    })

    // Always return success to prevent email enumeration
    if (!contributor) {
      return {
        success: true,
        message: 'إذا كان البريد الإلكتروني مسجلاً، ستتلقى رسالة لإعادة تعيين كلمة المرور',
      }
    }

    // Generate reset token
    const resetToken = generateToken(32)
    const resetTokenExp = new Date(Date.now() + RESET_TOKEN_EXPIRY)

    await db.contributor.update({
      where: { id: contributor.id },
      data: {
        resetToken,
        resetTokenExp,
      },
    })

    // TODO: Send email with reset link
    // In production, integrate with email service
    console.log(`Password reset token for ${email}: ${resetToken}`)

    return {
      success: true,
      message: 'إذا كان البريد الإلكتروني مسجلاً، ستتلقى رسالة لإعادة تعيين كلمة المرور',
    }
  } catch (error) {
    console.error('Password reset request error:', error)
    return { success: false, message: 'حدث خطأ، يرجى المحاولة لاحقاً' }
  }
}

/**
 * Reset password with token
 * إعادة تعيين كلمة المرور بالرمز
 */
export async function resetPassword(
  formData: FormData
): Promise<AuthResult> {
  const token = formData.get('token') as string
  const newPassword = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (!token || !newPassword) {
    return {
      success: false,
      error: 'جميع الحقول مطلوبة',
      errorCode: 'INVALID_TOKEN',
    }
  }

  if (newPassword !== confirmPassword) {
    return {
      success: false,
      error: 'كلمتا المرور غير متطابقتين',
      errorCode: 'INVALID_CREDENTIALS',
    }
  }

  if (newPassword.length < 8) {
    return {
      success: false,
      error: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل',
      errorCode: 'INVALID_CREDENTIALS',
    }
  }

  try {
    const contributor = await db.contributor.findFirst({
      where: {
        resetToken: token,
        resetTokenExp: { gt: new Date() },
      },
    })

    if (!contributor) {
      return {
        success: false,
        error: 'رمز غير صالح أو منتهي الصلاحية',
        errorCode: 'INVALID_TOKEN',
      }
    }

    // Hash new password
    const passwordHash = await hashPassword(newPassword)

    // Update password and clear reset token
    await db.contributor.update({
      where: { id: contributor.id },
      data: {
        passwordHash,
        resetToken: null,
        resetTokenExp: null,
      },
    })

    // Log the password reset
    await db.systemLog.create({
      data: {
        action: 'password_reset',
        entityType: 'Contributor',
        entityId: contributor.id,
        userId: contributor.id,
      },
    })

    return { success: true }
  } catch (error) {
    console.error('Password reset error:', error)
    return {
      success: false,
      error: 'حدث خطأ، يرجى المحاولة لاحقاً',
      errorCode: 'SERVER_ERROR',
    }
  }
}

/**
 * Change password for authenticated user
 * تغيير كلمة المرور للمستخدم المصادق
 */
export async function changePassword(
  formData: FormData
): Promise<AuthResult> {
  const currentPassword = formData.get('currentPassword') as string
  const newPassword = formData.get('newPassword') as string
  const confirmPassword = formData.get('confirmPassword') as string

  const user = await getCurrentUser()
  if (!user) {
    return {
      success: false,
      error: 'غير مصرح بالوصول',
      errorCode: 'UNAUTHORIZED',
    }
  }

  if (!currentPassword || !newPassword || !confirmPassword) {
    return {
      success: false,
      error: 'جميع الحقول مطلوبة',
      errorCode: 'INVALID_CREDENTIALS',
    }
  }

  if (newPassword !== confirmPassword) {
    return {
      success: false,
      error: 'كلمتا المرور الجديدة غير متطابقتين',
      errorCode: 'INVALID_CREDENTIALS',
    }
  }

  try {
    const contributor = await db.contributor.findUnique({
      where: { id: user.id },
    })

    if (!contributor || !contributor.passwordHash) {
      return {
        success: false,
        error: 'خطأ في المصادقة',
        errorCode: 'UNAUTHORIZED',
      }
    }

    // Verify current password
    const isValid = await verifyPassword(currentPassword, contributor.passwordHash)
    if (!isValid) {
      return {
        success: false,
        error: 'كلمة المرور الحالية غير صحيحة',
        errorCode: 'INVALID_CREDENTIALS',
      }
    }

    // Hash and update new password
    const passwordHash = await hashPassword(newPassword)
    await db.contributor.update({
      where: { id: user.id },
      data: { passwordHash },
    })

    // Log the password change
    await db.systemLog.create({
      data: {
        action: 'password_change',
        entityType: 'Contributor',
        entityId: user.id,
        userId: user.id,
      },
    })

    return { success: true }
  } catch (error) {
    console.error('Password change error:', error)
    return {
      success: false,
      error: 'حدث خطأ، يرجى المحاولة لاحقاً',
      errorCode: 'SERVER_ERROR',
    }
  }
}
