'use client'

// Dashboard Sidebar Component
// مكون الشريط الجانبي للوحة التحكم

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutGrid,
  Home,
  BookOpen,
  Plus,
  Clock,
  Settings,
  ArrowRight,
  BarChart3,
  GitCompare,
  Tag,
  Lightbulb,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AuthUser } from '@/lib/auth'
import { ContributorRole } from '@prisma/client'

interface DashboardSidebarProps {
  user: AuthUser
}

// Navigation links with role requirements
const sidebarLinks = [
  { name: 'الرئيسية', href: '/dashboard', icon: Home, roles: ['viewer', 'editor', 'reviewer', 'admin'] },
  { name: 'الألعاب', href: '/dashboard/games', icon: BookOpen, roles: ['viewer', 'editor', 'reviewer', 'admin'] },
  { name: 'إضافة لعبة', href: '/dashboard/games/new', icon: Plus, roles: ['editor', 'reviewer', 'admin'] },
  { name: 'التصنيفات', href: '/dashboard/categories', icon: Tag, roles: ['reviewer', 'admin'] },
  { name: 'المقترحات', href: '/dashboard/suggestions', icon: Lightbulb, roles: ['reviewer', 'admin'] },
  { name: 'المراجعة', href: '/dashboard/review', icon: Clock, roles: ['reviewer', 'admin'] },
  { name: 'التطابقات', href: '/dashboard/matches', icon: GitCompare, roles: ['reviewer', 'admin'] },
  { name: 'الإحصائيات', href: '/dashboard/stats', icon: BarChart3, roles: ['reviewer', 'admin'] },
  { name: 'الإعدادات', href: '/dashboard/settings', icon: Settings, roles: ['admin'] },
]

export function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname()

  // Filter links based on user role
  const visibleLinks = sidebarLinks.filter((link) =>
    link.roles.includes(user.role as ContributorRole)
  )

  return (
    <aside className="fixed right-0 top-0 z-40 hidden h-screen w-64 border-l border-gray-200 bg-white lg:block">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-20 items-center gap-3 border-b border-gray-100 px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-deepest text-white">
            <LayoutGrid className="h-6 w-6" />
          </div>
          <div>
            <span className="block text-lg font-bold leading-none tracking-tight">
              لوحة التحكم
            </span>
            <span className="text-[10px] font-medium text-gray-400">
              المسرد التوثيقي
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {visibleLinks.map((link) => {
            // تحديد العنصر النشط بدقة - مطابقة تامة فقط
            const isActive = pathname === link.href
            const Icon = link.icon

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all',
                  isActive
                    ? 'bg-brand text-white shadow-lg shadow-brand/20'
                    : 'text-gray-600 hover:bg-brand/5 hover:text-brand'
                )}
              >
                <Icon className="h-5 w-5" />
                {link.name}
              </Link>
            )
          })}
        </nav>

        {/* Back to Site */}
        <div className="border-t border-gray-100 p-4">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-500 transition-all hover:bg-gray-100 hover:text-brand-deepest"
          >
            <ArrowRight className="h-5 w-5" />
            العودة للموقع
          </Link>
        </div>
      </div>
    </aside>
  )
}
