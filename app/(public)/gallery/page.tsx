import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Search,
  SlidersHorizontal,
  LayoutGrid,
  MapPin,
  Users,
  ArrowLeft,
  Sparkles,
  Filter,
  X,
  CheckCircle2,
  Calendar,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { getPublishedGames, getAllCountries } from '@/lib/actions/game'
import { getActiveCategories } from '@/lib/actions/category'
import GalleryClient from './GalleryClient'

export default async function GalleryPage() {
  // Fetch data from database
  const [gamesResult, countriesResult, categoriesResult] = await Promise.all([
    getPublishedGames(),
    getAllCountries(),
    getActiveCategories()
  ])

  const gamesData = gamesResult.success ? gamesResult.games : []
  const countriesData = countriesResult.success ? countriesResult.countries : []
  const categoriesData = categoriesResult.categories || []

  // Transform games data for client component
  const transformedGames = gamesData.map(game => ({
    id: game.id,
    name: game.canonicalName,
    slug: game.slug,
    country: game.country.name,
    countryId: game.country.id,
    gameType: game.gameType,
    ageGroup: game.ageGroup || 'غير محدد',
    playersCount: game.playersCount || 'غير محدد',
    description: game.description,
    imageUrl: game.media && game.media.length > 0 
      ? game.media[0].url 
      : 'https://images.unsplash.com/photo-1611195955636-f3830fbac00c?auto=format&fit=crop&q=80&w=800',
    tags: game.tags.map(t => t.tag.name)
  }))

  // Transform countries data
  const transformedCountries = countriesData.map(country => ({
    id: country.id,
    name: country.name,
    region: country.region || '',
    gamesCount: country._count.games
  }))

  // Transform categories data
  const transformedCategories = categoriesData.map(category => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    icon: category.icon,
    color: category.color || undefined
  }))

  return (
    <GalleryClient 
      games={transformedGames} 
      countries={transformedCountries}
      categories={transformedCategories}
    />
  )
}
