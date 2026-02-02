'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Book, Info, LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavItem {
  name: string
  href: string
  icon: LucideIcon
}

const navigation: NavItem[] = [
  { name: 'الرئيسية', href: '/', icon: Home },
  { name: 'الألعاب التراثية العربية', href: '/gallery', icon: Book },
  { name: 'عن المشروع', href: '/about', icon: Info },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="hidden md:flex gap-1 rounded-full bg-gray-100/80 p-1">
      {navigation.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href || 
                        (item.href !== '/' && pathname.startsWith(item.href))
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300',
              isActive
                ? 'bg-brand text-white shadow-md scale-105'
                : 'text-gray-500 hover:text-black hover:bg-gray-50'
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{item.name}</span>
          </Link>
        )
      })}
    </nav>
  )
}
