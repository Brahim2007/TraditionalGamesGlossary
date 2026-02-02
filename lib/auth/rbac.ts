// Role-Based Access Control
// التحكم في الوصول بناءً على الأدوار

import { ContributorRole } from '@prisma/client'
import type { Permission } from './types'
import { ROLE_ROUTES } from './constants'

/**
 * Role hierarchy (higher includes lower permissions)
 * تسلسل الأدوار (الأعلى يتضمن صلاحيات الأدنى)
 */
const ROLE_HIERARCHY: Record<ContributorRole, number> = {
  viewer: 1,
  editor: 2,
  reviewer: 3,
  admin: 4,
}

/**
 * Permissions assigned to each role
 * الصلاحيات المخصصة لكل دور
 */
const ROLE_PERMISSIONS: Record<ContributorRole, Permission[]> = {
  viewer: [],
  editor: ['game:create', 'game:edit'],
  reviewer: [
    'game:create',
    'game:edit',
    'game:review',
    'game:publish',
    'similarity:review',
    'concept:create',
    'concept:edit',
  ],
  admin: [
    'game:create',
    'game:edit',
    'game:delete',
    'game:review',
    'game:publish',
    'similarity:review',
    'concept:create',
    'concept:edit',
    'user:manage',
    'settings:manage',
  ],
}

/**
 * Arabic role names
 * أسماء الأدوار بالعربية
 */
export const ROLE_NAMES: Record<ContributorRole, string> = {
  viewer: 'مستعرض',
  editor: 'محرر',
  reviewer: 'مُراجع',
  admin: 'مدير النظام',
}

/**
 * Role descriptions
 * وصف الأدوار
 */
export const ROLE_DESCRIPTIONS: Record<ContributorRole, string> = {
  viewer: 'يمكنه عرض المحتوى فقط',
  editor: 'يمكنه إضافة وتعديل الألعاب',
  reviewer: 'يمكنه مراجعة ونشر الألعاب ومراجعة التطابقات',
  admin: 'صلاحيات كاملة على النظام',
}

/**
 * Check if a role has a specific permission
 * التحقق من امتلاك الدور لصلاحية معينة
 */
export function hasPermission(
  role: ContributorRole,
  permission: Permission
): boolean {
  return ROLE_PERMISSIONS[role].includes(permission)
}

/**
 * Check if a role has multiple permissions (all required)
 * التحقق من امتلاك الدور لعدة صلاحيات (جميعها مطلوبة)
 */
export function hasAllPermissions(
  role: ContributorRole,
  permissions: Permission[]
): boolean {
  return permissions.every((p) => hasPermission(role, p))
}

/**
 * Check if a role has any of the specified permissions
 * التحقق من امتلاك الدور لأي من الصلاحيات المحددة
 */
export function hasAnyPermission(
  role: ContributorRole,
  permissions: Permission[]
): boolean {
  return permissions.some((p) => hasPermission(role, p))
}

/**
 * Get all permissions for a role
 * الحصول على جميع صلاحيات الدور
 */
export function getRolePermissions(role: ContributorRole): Permission[] {
  return [...ROLE_PERMISSIONS[role]]
}

/**
 * Check if role A is higher than or equal to role B
 * التحقق من أن الدور A أعلى من أو يساوي الدور B
 */
export function isRoleAtLeast(
  role: ContributorRole,
  requiredRole: ContributorRole
): boolean {
  return ROLE_HIERARCHY[role] >= ROLE_HIERARCHY[requiredRole]
}

/**
 * Check if a role can access a specific route
 * التحقق من قدرة الدور على الوصول لمسار معين
 */
export function canAccessRoute(role: ContributorRole, route: string): boolean {
  // Check exact route match first
  const allowedRoles = ROLE_ROUTES[route]
  if (allowedRoles) {
    return allowedRoles.includes(role)
  }

  // Check for pattern matches (e.g., /dashboard/games/*)
  for (const [pattern, roles] of Object.entries(ROLE_ROUTES)) {
    if (pattern.endsWith('*')) {
      const base = pattern.slice(0, -1)
      if (route.startsWith(base)) {
        return roles.includes(role)
      }
    }
  }

  // Default: allow if no specific restriction
  return true
}

/**
 * Get the minimum role required for a route
 * الحصول على الدور الأدنى المطلوب للمسار
 */
export function getMinimumRoleForRoute(
  route: string
): ContributorRole | null {
  const allowedRoles = ROLE_ROUTES[route]
  if (!allowedRoles || allowedRoles.length === 0) {
    return null
  }

  // Find the lowest role in the hierarchy
  let minRole: ContributorRole | null = null
  let minLevel = Infinity

  for (const role of allowedRoles) {
    const level = ROLE_HIERARCHY[role as ContributorRole]
    if (level < minLevel) {
      minLevel = level
      minRole = role as ContributorRole
    }
  }

  return minRole
}

/**
 * Filter actions based on role permissions
 * تصفية الإجراءات بناءً على صلاحيات الدور
 */
export function filterActionsByRole<T extends { permission: Permission }>(
  role: ContributorRole,
  actions: T[]
): T[] {
  return actions.filter((action) => hasPermission(role, action.permission))
}
