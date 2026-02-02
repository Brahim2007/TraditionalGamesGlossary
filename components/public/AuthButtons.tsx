'use client'

// Authentication Buttons Component
// مكون أزرار المصادقة

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { logout } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'
import { LogIn, LogOut, User, LayoutDashboard } from 'lucide-react'

interface AuthButtonsProps {
  user: {
    id: string
    name: string
    email: string
    role: string
    avatarUrl: string | null
  } | null
}

export function AuthButtons({ user }: AuthButtonsProps) {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logout()
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  if (!user) {
    // Not logged in - show login button
    return (
      <div className="flex items-center gap-2">
        <Link href="/login">
          <Button variant="outline" className="gap-2">
            <LogIn className="w-4 h-4" />
            تسجيل الدخول
          </Button>
        </Link>
      </div>
    )
  }

  // Logged in - show user menu
  return (
    <div className="flex items-center gap-3">
      {/* Dashboard Button */}
      <Link href="/dashboard">
        <Button variant="outline" className="gap-2">
          <LayoutDashboard className="w-4 h-4" />
          لوحة التحكم
        </Button>
      </Link>

      {/* User Info */}
      <div className="hidden md:flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm font-medium">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            user.name.charAt(0)
          )}
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900">{user.name.split(' ')[0]}</p>
          <p className="text-xs text-gray-500">{user.role === 'admin' ? 'مدير' : user.role}</p>
        </div>
      </div>

      {/* Logout Button */}
      <Button
        variant="ghost"
        onClick={handleLogout}
        disabled={isLoggingOut}
        className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
      >
        <LogOut className="w-4 h-4" />
        {isLoggingOut ? 'جاري...' : 'تسجيل الخروج'}
      </Button>
    </div>
  )
}