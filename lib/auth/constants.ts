// Authentication Constants
// ثوابت نظام المصادقة

// Session configuration
export const SESSION_COOKIE_NAME = 'tgg_session'
export const SESSION_DURATION_DEFAULT = 7 * 24 * 60 * 60 * 1000 // 7 days in ms
export const SESSION_DURATION_REMEMBER = 30 * 24 * 60 * 60 * 1000 // 30 days in ms

// Password requirements
export const PASSWORD_MIN_LENGTH = 8
export const PASSWORD_SALT_ROUNDS = 12

// Token configuration
export const TOKEN_LENGTH = 32 // bytes
export const RESET_TOKEN_EXPIRY = 60 * 60 * 1000 // 1 hour in ms

// Protected routes
export const PROTECTED_ROUTES = [
  '/dashboard',
  '/dashboard/games',
  '/dashboard/games/new',
  '/dashboard/review',
  '/dashboard/matches',
  '/dashboard/settings',
  '/dashboard/stats',
]

// Auth routes (redirect to dashboard if logged in)
export const AUTH_ROUTES = ['/login', '/forgot-password', '/reset-password']

// Role-based route access
export const ROLE_ROUTES: Record<string, string[]> = {
  '/dashboard/review': ['reviewer', 'admin'],
  '/dashboard/matches': ['reviewer', 'admin'],
  '/dashboard/settings': ['admin'],
  '/dashboard/games/new': ['editor', 'reviewer', 'admin'],
}

// Default redirect after login
export const DEFAULT_LOGIN_REDIRECT = '/dashboard'

// Login page
export const LOGIN_PAGE = '/login'
