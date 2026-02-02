// Authentication Module Exports
// تصديرات وحدة المصادقة

// Types
export type {
  AuthUser,
  SessionData,
  AuthResult,
  AuthErrorCode,
  Permission,
  LoginCredentials,
  PasswordResetRequest,
  PasswordReset,
} from './types'

export { AUTH_ERROR_MESSAGES } from './types'

// Constants
export {
  SESSION_COOKIE_NAME,
  SESSION_DURATION_DEFAULT,
  SESSION_DURATION_REMEMBER,
  PASSWORD_MIN_LENGTH,
  PROTECTED_ROUTES,
  AUTH_ROUTES,
  ROLE_ROUTES,
  DEFAULT_LOGIN_REDIRECT,
  LOGIN_PAGE,
} from './constants'

// Password utilities
export {
  hashPassword,
  verifyPassword,
  validatePassword,
  generateToken,
} from './password'

// Session management
export {
  createSession,
  setSessionCookie,
  getSessionToken,
  validateSession,
  getCurrentUser,
  destroySession,
  clearSessionCookie,
  cleanupExpiredSessions,
  getUserSessions,
  revokeOtherSessions,
} from './session'

// Role-based access control
export {
  hasPermission,
  hasAllPermissions,
  hasAnyPermission,
  getRolePermissions,
  isRoleAtLeast,
  canAccessRoute,
  getMinimumRoleForRoute,
  filterActionsByRole,
  ROLE_NAMES,
  ROLE_DESCRIPTIONS,
} from './rbac'
