// Authentication Types for Traditional Games Glossary
// أنواع نظام المصادقة

import { ContributorRole } from '@prisma/client'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: ContributorRole
  avatarUrl: string | null
  institution: string | null
}

export interface SessionData {
  id: string
  token: string
  contributorId: string
  expiresAt: Date
  createdAt: Date
}

export interface AuthResult {
  success: boolean
  user?: AuthUser
  error?: string
  errorCode?: AuthErrorCode
}

export type AuthErrorCode =
  | 'INVALID_CREDENTIALS'
  | 'USER_NOT_FOUND'
  | 'ACCOUNT_DISABLED'
  | 'SESSION_EXPIRED'
  | 'UNAUTHORIZED'
  | 'INSUFFICIENT_PERMISSIONS'
  | 'INVALID_TOKEN'
  | 'SERVER_ERROR'

// Arabic error messages
export const AUTH_ERROR_MESSAGES: Record<AuthErrorCode, string> = {
  INVALID_CREDENTIALS: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
  USER_NOT_FOUND: 'لم يتم العثور على المستخدم',
  ACCOUNT_DISABLED: 'تم تعطيل هذا الحساب',
  SESSION_EXPIRED: 'انتهت صلاحية الجلسة، يرجى تسجيل الدخول مجدداً',
  UNAUTHORIZED: 'غير مصرح بالوصول',
  INSUFFICIENT_PERMISSIONS: 'لا تملك الصلاحيات الكافية لهذا الإجراء',
  INVALID_TOKEN: 'رمز غير صالح',
  SERVER_ERROR: 'حدث خطأ في الخادم، يرجى المحاولة لاحقاً',
}

export type Permission =
  | 'game:create'
  | 'game:edit'
  | 'game:delete'
  | 'game:review'
  | 'game:publish'
  | 'similarity:review'
  | 'concept:create'
  | 'concept:edit'
  | 'user:manage'
  | 'settings:manage'

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface PasswordResetRequest {
  email: string
}

export interface PasswordReset {
  token: string
  newPassword: string
}
