// Password Hashing Utilities
// أدوات تشفير كلمات المرور

import bcrypt from 'bcrypt'
import { PASSWORD_SALT_ROUNDS, PASSWORD_MIN_LENGTH } from './constants'

/**
 * Hash a password using bcrypt
 * تشفير كلمة المرور باستخدام bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(PASSWORD_SALT_ROUNDS)
  return await bcrypt.hash(password, salt)
}

/**
 * Verify a password against a hash
 * التحقق من كلمة المرور مقابل التشفير
 */
export async function verifyPassword(
  password: string,
  storedHash: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(password, storedHash)
  } catch {
    return false
  }
}

/**
 * Validate password strength
 * التحقق من قوة كلمة المرور
 */
export function validatePassword(password: string): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (password.length < PASSWORD_MIN_LENGTH) {
    errors.push(`كلمة المرور يجب أن تكون ${PASSWORD_MIN_LENGTH} أحرف على الأقل`)
  }

  if (!/[A-Za-z]/.test(password)) {
    errors.push('كلمة المرور يجب أن تحتوي على حرف واحد على الأقل')
  }

  if (!/[0-9]/.test(password)) {
    errors.push('كلمة المرور يجب أن تحتوي على رقم واحد على الأقل')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Generate a secure random token
 * إنشاء رمز عشوائي آمن
 */
export function generateToken(length: number = 32): string {
  const bytes = crypto.getRandomValues(new Uint8Array(length))
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}
