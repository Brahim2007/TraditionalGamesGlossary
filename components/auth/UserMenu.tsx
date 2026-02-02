'use client'

// User Menu Component
// مكون قائمة المستخدم

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { logout } from '@/lib/actions/auth'
import { ROLE_NAMES } from '@/lib/auth/rbac'
import type { AuthUser } from '@/lib/auth/types'
import { ContributorRole } from '@prisma/client'
import {
  User,
  Settings,
  LogOut,
  ChevronDown,
  Shield,
  Loader2,
} from 'lucide-react'

interface UserMenuProps {
  user: AuthUser
}

export function UserMenu({ user }: UserMenuProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)

  const handleLogout = () => {
    startTransition(async () => {
      await logout()
    })
  }

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-medium">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            initials
          )}
        </div>

        {/* User Info */}
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium text-gray-900">{user.name}</p>
          <p className="text-xs text-gray-500">
            {ROLE_NAMES[user.role as ContributorRole]}
          </p>
        </div>

        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div className="absolute left-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border z-20">
            {/* User Header */}
            <div className="p-4 border-b">
              <p className="font-medium text-gray-900">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
              <div className="flex items-center gap-1 mt-2">
                <Shield className="w-3 h-3 text-primary-600" />
                <span className="text-xs text-primary-600">
                  {ROLE_NAMES[user.role as ContributorRole]}
                </span>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-2">
              <button
                onClick={() => {
                  setIsOpen(false)
                  router.push('/dashboard/profile')
                }}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <User className="w-4 h-4" />
                الملف الشخصي
              </button>

              {user.role === 'admin' && (
                <button
                  onClick={() => {
                    setIsOpen(false)
                    router.push('/dashboard/settings')
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <Settings className="w-4 h-4" />
                  الإعدادات
                </button>
              )}
            </div>

            {/* Logout */}
            <div className="p-2 border-t">
              <button
                onClick={handleLogout}
                disabled={isPending}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
              >
                {isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <LogOut className="w-4 h-4" />
                )}
                تسجيل الخروج
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
