'use client'

import React, { useState } from 'react'
import {
  Activity,
  Brain,
  Award,
  Anchor,
  ScrollText,
  Smile,
  LayoutGrid,
  Users,
  LucideIcon,
  Heart,
  Trophy,
  Target,
  Sparkles,
  Star,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

// Icon mapping - maps icon names from database to Lucide components
const iconMap: Record<string, LucideIcon> = {
  LayoutGrid,
  Activity,
  Brain,
  Award,
  Anchor,
  ScrollText,
  Smile,
  Users,
  Heart,
  Trophy,
  Target,
  Sparkles,
  Star,
}

interface Category {
  id: string
  name: string
  slug: string
  description?: string | null
  icon: string
  order: number
  isActive: boolean
  color?: string | null
}

interface CategoryGridProps {
  categories: Category[]
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  const [selectedCategory, setSelectedCategory] = useState('الكل')

  // Filter only active categories
  const activeCategories = categories.filter((cat) => cat.isActive)

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
      {activeCategories.map((cat) => {
        const Icon = iconMap[cat.icon] || LayoutGrid
        const isSelected = selectedCategory === cat.name

        return (
          <Link
            key={cat.id}
            href={`/gallery?category=${encodeURIComponent(cat.slug)}`}
            onClick={() => setSelectedCategory(cat.name)}
            className={cn(
              'flex min-w-[150px] flex-col items-center justify-center gap-4 rounded-2xl border-2 p-5 transition-all duration-300 snap-start hover:scale-105 cursor-pointer',
              isSelected
                ? 'scale-105 transform border-brand bg-brand text-white shadow-xl'
                : 'border-gray-200 bg-surface-subtle text-gray-500 hover:border-brand/40 hover:bg-white hover:shadow-md'
            )}
            style={
              cat.color && !isSelected
                ? {
                    borderColor: `${cat.color}20`,
                  }
                : undefined
            }
          >
            <Icon
              className={cn(
                'h-8 w-8',
                isSelected ? 'text-accent' : 'text-brand-light'
              )}
              style={
                cat.color && !isSelected
                  ? {
                      color: cat.color,
                    }
                  : undefined
              }
            />
            <span className="text-sm font-bold text-center">{cat.name}</span>
            {cat.description && (
              <span className="text-xs text-center opacity-70 line-clamp-2 hidden md:block">
                {cat.description}
              </span>
            )}
          </Link>
        )
      })}
    </div>
  )
}
