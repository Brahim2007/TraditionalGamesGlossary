'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import {
  Search,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

interface Game {
  id: string
  name: string
  slug: string
  country: string
  countryId: string
  gameType: string
  ageGroup: string
  playersCount: string
  description: string
  imageUrl: string
  tags: string[]
}

interface Country {
  id: string
  name: string
  region: string
  gamesCount: number
}

interface Category {
  id: string
  name: string
  slug: string
  icon: string
  color?: string
}

interface GalleryClientProps {
  games: Game[]
  countries: Country[]
  categories?: Category[]
}

export default function GalleryClient({ games, countries, categories = [] }: GalleryClientProps) {
  const searchParams = useSearchParams()
  const categoryFromUrl = searchParams.get('category')
  
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCountry, setFilterCountry] = useState('الكل')
  const [filterType, setFilterType] = useState('الكل')
  const [filterCategory, setFilterCategory] = useState('الكل')

  // Set filter from URL parameter on mount
  useEffect(() => {
    if (categoryFromUrl) {
      // Map category slug to Arabic name
      const categoryMap: Record<string, string> = {
        'all': 'الكل',
        'physical-games': 'ألعاب حركية',
        'mental-games': 'ألعاب ذهنية',
        'gulf-heritage': 'تراث خليجي',
        'sea-games': 'ألعاب بحرية',
        'iraqi-heritage': 'تراث عراقي',
        'fun-games': 'ألعاب طريفة',
      }
      
      const categoryName = categoryMap[categoryFromUrl] || 'الكل'
      setFilterCategory(categoryName)
      setFilterType(categoryName)
    }
  }, [categoryFromUrl])

  // Extract unique game types from all games
  const gameTypes = ['الكل', ...Array.from(new Set(games.flatMap(g => {
    // Extract types from gameType field (e.g., "حركية / دقة" -> ["حركية", "دقة"])
    return g.gameType.split('/').map(t => t.trim())
  })))]

  // Create countries list with "الكل" option
  const countriesList = ['الكل', ...countries.map(c => c.name)]

  const filteredGames = games.filter((game) => {
    const matchesSearch =
      game.name.includes(searchTerm) ||
      game.description.includes(searchTerm)
    const matchesCountry =
      filterCountry === 'الكل' || game.country === filterCountry
    const matchesType =
      filterType === 'الكل' || game.gameType.includes(filterType) || game.tags.some(tag => tag.includes(filterType))
    return matchesSearch && matchesCountry && matchesType
  })

  const resetFilters = () => {
    setFilterCountry('الكل')
    setFilterType('الكل')
    setFilterCategory('الكل')
    setSearchTerm('')
    
    // Clear URL parameters
    const url = new URL(window.location.href)
    url.searchParams.delete('category')
    window.history.pushState({}, '', url.toString())
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
        {/* Animated Background Pattern */}
        <div className="fixed inset-0 -z-10 opacity-[0.03]">
          <div className="absolute inset-0 bg-[url('/pattern.svg')] bg-repeat" />
        </div>

        {/* Enhanced Hero Section */}
        <div className="relative mb-16 overflow-hidden bg-gradient-to-br from-brand-deepest via-brand-deep to-brand px-6 py-24 text-surface-bg shadow-2xl">
          {/* Animated Background Layers */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 animate-pulse" />
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/20" />
          <div className="absolute top-0 left-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-blob" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-accent/10 to-white/5 rounded-full blur-3xl animate-blob animation-delay-4000" />
          
          <div className="relative z-10 mx-auto max-w-7xl text-center">
            <div className="inline-flex items-center gap-3 mb-6 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20 animate-fade-in">
              <Sparkles className="h-5 w-5 text-accent animate-pulse" />
              <span className="text-sm font-semibold text-white/90">مجموعة شاملة من الألعاب التراثية</span>
            </div>
            
            <h1 className="mb-8 text-5xl font-black leading-tight md:text-6xl animate-slide-up text-white drop-shadow-2xl">
              الأرشيف الرقمي الشامل
            </h1>
            
            <p className="mx-auto max-w-3xl text-xl font-light leading-relaxed text-gray-200 animate-slide-up animation-delay-200 mb-8">
              استكشف المجموعة الكاملة للألعاب الشعبية، واستخدم أدوات التصفية
              الدقيقة للوصول إلى تراث منطقتك.
            </p>

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-6 animate-slide-up animation-delay-400">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-4 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <div className="text-3xl font-bold text-accent mb-1">{games.length}</div>
                <div className="text-sm text-white/80">لعبة تراثية</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-4 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <div className="text-3xl font-bold text-accent mb-1">{countries.length}</div>
                <div className="text-sm text-white/80">دولة عربية</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-4 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <div className="text-3xl font-bold text-accent mb-1">{gameTypes.length - 1}</div>
                <div className="text-sm text-white/80">نوع لعبة</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="mx-auto max-w-7xl px-6 pb-24">
          <div className="flex flex-col gap-12 lg:flex-row">
            {/* Enhanced Sidebar Filters */}
            <aside className="space-y-8 lg:w-1/4 animate-slide-in-right">
              <div className="sticky top-28 rounded-2xl border-2 border-gray-200 bg-white p-7 shadow-xl hover:shadow-2xl transition-all duration-300">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between border-b-2 border-gray-200 pb-5">
                  <div className="flex items-center gap-3 text-brand-deepest">
                    <div className="p-2 bg-gradient-to-br from-brand-deepest to-brand rounded-xl">
                      <Filter className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold">تصفية النتائج</h3>
                  </div>
                  {(filterCountry !== 'الكل' ||
                    filterType !== 'الكل' ||
                    searchTerm) && (
                    <button
                      onClick={resetFilters}
                      className="flex items-center gap-1 text-xs font-bold text-white bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 px-3 py-2 rounded-lg transition-all duration-300 hover:scale-105 shadow-md"
                    >
                      <X className="h-3 w-3" />
                      إعادة تعيين
                    </button>
                  )}
                </div>

                {/* Enhanced Search */}
                <div className="relative mb-8 group">
                  <Input
                    type="text"
                    placeholder="ابحث عن لعبة..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-14 pr-12 text-base border-2 border-gray-200 focus:border-brand transition-all duration-300 rounded-xl shadow-sm hover:shadow-md bg-gradient-to-r from-white to-gray-50"
                  />
                  <Search className="absolute right-4 top-4 h-6 w-6 text-gray-400 group-hover:text-brand transition-colors duration-300" />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute left-3 top-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X className="h-4 w-4 text-gray-500" />
                    </button>
                  )}
                </div>

                {/* Enhanced Country Filter */}
                <div className="mb-8">
                  <h4 className="mb-5 text-sm font-bold uppercase tracking-wider text-gray-600 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-brand" />
                    الدولة
                  </h4>
                  <Select value={filterCountry} onValueChange={setFilterCountry}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="اختر الدولة" />
                    </SelectTrigger>
                    <SelectContent>
                      {countriesList.map((c) => {
                        const country = countries.find(country => country.name === c)
                        const gamesCount = country ? country.gamesCount : games.length
                        
                        return (
                          <SelectItem key={c} value={c}>
                            <div className="flex items-center justify-between w-full gap-3">
                              <span className="font-medium">{c}</span>
                              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                {gamesCount}
                              </span>
                            </div>
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </div>

                {/* Enhanced Type Filter */}
                <div>
                  <h4 className="mb-5 text-sm font-bold uppercase tracking-wider text-gray-600 flex items-center gap-2">
                    <LayoutGrid className="h-4 w-4 text-brand" />
                    نوع اللعبة
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {gameTypes.map((t, idx) => (
                      <button
                        key={t}
                        onClick={() => setFilterType(t)}
                        className={cn(
                          'rounded-xl border-2 px-4 py-2.5 text-sm font-semibold transition-all duration-300 hover:scale-105 hover:shadow-md',
                          filterType === t
                            ? 'border-brand-deepest bg-gradient-to-r from-brand-deepest to-brand text-white shadow-lg scale-105'
                            : 'border-gray-200 bg-white text-gray-600 hover:border-accent hover:text-accent hover:bg-accent/5'
                        )}
                        style={{ animationDelay: `${idx * 50}ms` }}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Enhanced Games Grid */}
            <div className="lg:w-3/4 animate-slide-in-left">
              <div className="mb-10 flex items-center justify-between bg-gradient-to-r from-white to-gray-50 p-6 rounded-2xl border-2 border-gray-200 shadow-md">
                <h2 className="flex items-center gap-3 text-2xl font-bold text-brand-deepest">
                  <div className="p-2 bg-gradient-to-br from-brand to-brand-light rounded-xl">
                    <LayoutGrid className="h-6 w-6 text-white" />
                  </div>
                  <span>النتائج</span>
                </h2>
                <div className="flex items-center gap-3">
                  <span className="rounded-full border-2 border-brand/30 bg-gradient-to-r from-brand/10 to-accent/10 px-6 py-2.5 text-base font-bold text-brand-deepest shadow-md backdrop-blur-sm">
                    {filteredGames.length} {filteredGames.length === 1 ? 'لعبة' : 'ألعاب'}
                  </span>
                </div>
              </div>

              {filteredGames.length > 0 ? (
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  {filteredGames.map((game, idx) => (
                    <Link
                      key={game.id}
                      href={`/game/${game.slug}`}
                      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border-2 border-gray-200 bg-white transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl hover:border-brand/30 hover:-translate-y-2 animate-scale-in"
                      style={{ animationDelay: `${idx * 100}ms` }}
                    >
                      {/* Enhanced Image */}
                      <div className="relative h-72 w-full overflow-hidden bg-gradient-to-br from-brand-deepest/10 to-brand/5">
                        <div className="absolute inset-0 z-10 bg-gradient-to-t from-brand-deepest/90 via-brand-deepest/40 to-transparent transition-all duration-500 group-hover:from-brand-deepest/95" />
                        <Image
                          src={game.imageUrl}
                          alt={game.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
                        />
                        
                        {/* Decorative Corner Elements */}
                        <div className="absolute top-4 right-4 w-12 h-12 border-t-4 border-r-4 border-accent/60 rounded-tr-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="absolute bottom-4 left-4 w-12 h-12 border-b-4 border-l-4 border-accent/60 rounded-bl-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        <div className="absolute bottom-0 left-0 right-0 z-20 p-6">
                          <div className="mb-3 flex items-center gap-2">
                            <span className="rounded-xl bg-gradient-to-r from-accent to-accent/80 px-3 py-1.5 text-xs font-bold text-brand-deepest shadow-lg backdrop-blur-sm border border-white/20">
                              {game.gameType.split('/')[0]}
                            </span>
                            <Sparkles className="h-4 w-4 text-accent animate-pulse" />
                          </div>
                          <h3 className="mb-2 text-2xl font-bold text-white drop-shadow-2xl group-hover:scale-105 transition-transform duration-300">
                            {game.name}
                          </h3>
                          <div className="flex items-center gap-2 text-sm font-semibold text-gray-100 bg-black/20 backdrop-blur-sm px-3 py-1.5 rounded-lg inline-flex">
                            <MapPin className="h-4 w-4 text-accent" />
                            <span>{game.country}</span>
                          </div>
                        </div>
                      </div>

                      {/* Enhanced Content */}
                      <div className="flex flex-grow flex-col p-6 bg-gradient-to-b from-white to-gray-50/50">
                        <p className="mb-6 line-clamp-2 flex-grow text-sm leading-relaxed text-gray-700 font-medium">
                          {game.description}
                        </p>
                        <div className="flex items-center justify-between border-t-2 border-gray-200 pt-5">
                          <div className="flex gap-3 text-xs text-gray-600 font-medium">
                            <span className="flex items-center gap-1.5 bg-gray-100 px-3 py-2 rounded-lg">
                              <Users className="h-4 w-4 text-brand" />
                              {game.playersCount.split(' ')[0]}
                            </span>
                            <span className="flex items-center gap-1.5 bg-gray-100 px-3 py-2 rounded-lg">
                              <Calendar className="h-4 w-4 text-brand" />
                              {game.ageGroup.split(' ')[0]}
                            </span>
                          </div>
                          <span className="flex items-center gap-2 text-sm font-bold text-brand-deepest transition-all duration-300 group-hover:text-accent group-hover:gap-3">
                            عرض التفاصيل 
                            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="rounded-3xl border-2 border-dashed border-gray-300 bg-gradient-to-br from-white to-gray-50 p-20 text-center shadow-xl animate-fade-in">
                  <div className="relative inline-block mb-6">
                    <Search className="mx-auto h-20 w-20 text-accent/40 animate-pulse" />
                    <div className="absolute inset-0 bg-accent/20 rounded-full blur-2xl animate-blob" />
                  </div>
                  <h3 className="text-3xl font-bold text-brand-deepest mb-4">
                    لا توجد نتائج مطابقة
                  </h3>
                  <p className="mx-auto mb-10 mt-3 max-w-md text-gray-600 text-lg leading-relaxed">
                    لم نتمكن من العثور على ألعاب تطابق معايير البحث الحالية.
                    جرب تعديل الفلاتر أو البحث بكلمات مختلفة.
                  </p>
                  <button
                    onClick={resetFilters}
                    className="group rounded-xl bg-gradient-to-r from-brand-deepest to-brand px-8 py-4 text-base font-bold text-white shadow-2xl shadow-brand-deepest/30 transition-all duration-300 hover:scale-105 hover:shadow-3xl hover:from-brand hover:to-brand-light inline-flex items-center gap-3"
                  >
                    <LayoutGrid className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                    عرض جميع الألعاب
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
