'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, ArrowLeft } from 'lucide-react'

interface FeaturedGameProps {
  name: string
  slug: string
  country: string
  description: string
  imageUrl?: string
  tags: string[]
}

export function FeaturedGame({
  name,
  slug,
  country,
  description,
  imageUrl,
  tags,
}: FeaturedGameProps) {
  const defaultImage =
    'https://images.unsplash.com/photo-1516934024742-b461fba47600?auto=format&fit=crop&q=80&w=800'

  return (
    <Link href={`/game/${slug}`} className="group relative cursor-pointer">
      <div className="absolute inset-0 rotate-3 rounded-[24px] bg-brand-deepest opacity-10 transition-transform duration-300 group-hover:rotate-6" />
      <div className="relative overflow-hidden rounded-[24px] border border-gray-200 bg-surface-subtle p-8 shadow-lg">
        {/* Featured Badge */}
        <div className="absolute left-0 top-0 z-10 rounded-br-2xl bg-accent px-4 py-2 text-xs font-bold text-brand-deepest">
          لعبة مميزة
        </div>

        {/* Image */}
        <div className="relative mb-6 h-64 w-full overflow-hidden rounded-[18px]">
          <div className="absolute inset-0 z-10 bg-black/10 transition-colors group-hover:bg-transparent" />
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
        </div>

        {/* Content */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h3 className="mb-2 text-3xl font-bold text-brand-deepest">
              {name}
            </h3>
            <p className="flex items-center gap-1 text-sm font-medium text-brand-light">
              <MapPin className="h-4 w-4" /> {country}
            </p>
          </div>
          <div className="rounded-full bg-surface-muted p-3 transition-colors duration-300 group-hover:bg-brand-deepest group-hover:text-white">
            <ArrowLeft className="h-6 w-6" />
          </div>
        </div>

        {/* Description */}
        <p className="mb-6 line-clamp-3 text-lg leading-relaxed text-gray-600">
          {description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 min-h-[32px]">
          {tags && tags.length > 0 ? (
            tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-brand/20 bg-brand/10 px-3 py-1 text-xs font-semibold text-brand-deepest transition-colors hover:bg-brand hover:text-white"
              >
                #{tag}
              </span>
            ))
          ) : (
            <span className="text-xs text-gray-400 italic">لا توجد وسوم</span>
          )}
        </div>
      </div>
    </Link>
  )
}
