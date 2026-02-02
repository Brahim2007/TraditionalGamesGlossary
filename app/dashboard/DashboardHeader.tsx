'use client'

// Dashboard Header Component
// مكون رأس لوحة التحكم

import { LayoutGrid } from 'lucide-react'
import { UserMenu } from '@/components/auth/UserMenu'
import type { AuthUser } from '@/lib/auth'

interface DashboardHeaderProps {
  user: AuthUser
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-100 bg-white/80 px-6 backdrop-blur-xl lg:h-20">
      {/* Mobile Logo */}
      <div className="flex items-center gap-4 lg:hidden">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-deepest text-white">
          <LayoutGrid className="h-5 w-5" />
        </div>
        <span className="font-bold">لوحة التحكم</span>
      </div>

      {/* Desktop Welcome */}
      <div className="hidden lg:block">
        <h1 className="text-xl font-bold text-brand-deepest">
          مرحباً {user.name.split(' ')[0]}
        </h1>
        <p className="text-sm text-gray-500">
          المسرد التوثيقي للألعاب التراثية العربية
        </p>
      </div>

      {/* User Menu */}
      <UserMenu user={user} />
    </header>
  )
}
