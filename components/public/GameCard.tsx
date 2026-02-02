'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Users, ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

interface GameCardProps {
  id: string
  name: string
  slug: string
  country: string
  description: string
  gameType: string
  playersCount?: string
  ageGroup?: string
  imageUrl?: string
  tags: string[]
  className?: string
}

export function GameCard({
  name,
  slug,
  country,
  description,
  gameType,
  playersCount,
  ageGroup,
  imageUrl,
  tags,
  className,
}: GameCardProps) {
  const defaultImage =
    'https://images.unsplash.com/photo-1516934024742-b461fba47600?auto=format&fit=crop&q=80&w=800'

  return (
    <Link
      href={`/game/${slug}`}
      className={cn(
        'group flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-surface-subtle p-1',
        'cursor-pointer transition-all duration-500',
        'hover:scale-[1.02] hover:shadow-lg',
        className
      )}
    >
      <div className="flex h-full flex-col rounded-[20px] bg-surface-subtle p-8">
        {/* Image */}
        <div className="relative mb-6 h-48 w-full overflow-hidden rounded-[16px]">
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-brand-deepest/80 to-transparent opacity-70 transition-opacity" />
          <Image
            src={imageUrl || defaultImage}
            alt={name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = defaultImage
            }}
          />
          <div className="absolute bottom-3 right-3 z-20">
            <span className="rounded-full bg-white/90 px-2 py-1 text-[10px] font-bold text-gray-800 shadow-sm backdrop-blur">
              {gameType.split('/')[0]}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="mb-6 flex items-start justify-between">
          <h3 className="mb-2 text-2xl font-bold text-brand-deepest">{name}</h3>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-muted transition-colors duration-300 group-hover:bg-accent group-hover:text-brand-deepest">
            <ArrowLeft className="h-5 w-5 -rotate-45 transition-transform duration-300 group-hover:rotate-0" />
          </div>
        </div>

        {/* Country */}
        <div className="mb-6 flex items-center gap-2 text-xs font-medium text-brand-light">
          <MapPin className="h-4 w-4 text-amber-500" />
          <span>{country}</span>
        </div>

        {/* Description */}
        <p className="mb-8 line-clamp-3 text-sm font-light leading-relaxed text-gray-600">
          {description}
        </p>

        {/* Tags */}
        <div className="mt-auto flex flex-wrap gap-2 border-t border-dashed border-gray-200 pt-6 min-h-[44px]">
          {tags && tags.length > 0 ? (
            tags.slice(0, 3).map((tag, index) => (
              <span
                key={`${tag}-${index}`}
                className="rounded-md border border-brand/30 bg-brand/5 px-2.5 py-1 text-[10px] font-medium text-brand-deepest transition-colors hover:bg-brand/10"
              >
                #{tag}
              </span>
            ))
          ) : (
            <span className="text-[10px] text-gray-400 italic">لا توجد وسوم</span>
          )}
        </div>
      </div>
    </Link>
  )
}
