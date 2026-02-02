'use client'

// Dashboard Games List Page with Search and Filters
// صفحة قائمة الألعاب مع البحث والتصفية

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Gamepad2, Plus, Search, Filter, Eye, Edit, Clock, ChevronLeft, ChevronRight, 
  Globe, Award, Tag, Users, Calendar, MapPin, X, Loader2, SlidersHorizontal 
} from 'lucide-react'
import { GameActions } from '@/components/dashboard/GameActions'

export default function GamesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [loading, setLoading] = useState(true)
  const [games, setGames] = useState<any[]>([])
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    underReview: 0,
    draft: 0
  })
  const [user, setUser] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalGames, setTotalGames] = useState(0)
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    status: 'all',
    country: 'all',
    gameType: 'all',
    sortBy: 'newest'
  })
  const [countries, setCountries] = useState<any[]>([])
  const [gameTypes, setGameTypes] = useState<string[]>([])

  const ITEMS_PER_PAGE = 10

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput)
      setCurrentPage(1)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchInput])

  // Load data
  useEffect(() => {
    loadData()
  }, [currentPage, searchQuery, filters])

  const loadData = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: ITEMS_PER_PAGE.toString(),
        search: searchQuery,
        status: filters.status,
        country: filters.country,
        gameType: filters.gameType,
        sortBy: filters.sortBy
      })

      const response = await fetch(`/api/games?${params}`)
      const data = await response.json()

      setGames(data.games || [])
      setStats(data.stats || { total: 0, published: 0, underReview: 0, draft: 0 })
      setUser(data.user)
      setTotalPages(data.totalPages || 1)
      setTotalGames(data.total || 0)
      setCountries(data.countries || [])
      setGameTypes(data.gameTypes || [])
    } catch (error) {
      console.error('Error loading games:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (value: string) => {
    setSearchInput(value)
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setSearchInput('')
    setSearchQuery('')
    setFilters({
      status: 'all',
      country: 'all',
      gameType: 'all',
      sortBy: 'newest'
    })
    setCurrentPage(1)
  }

  const hasActiveFilters = searchQuery.length > 0 || filters.status !== 'all' || filters.country !== 'all' || filters.gameType !== 'all'

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800'
      case 'under_review': return 'bg-amber-100 text-amber-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'archived': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published': return 'منشور'
      case 'under_review': return 'قيد المراجعة'
      case 'draft': return 'مسودة'
      case 'rejected': return 'مرفوض'
      case 'archived': return 'مؤرشف'
      default: return status
    }
  }

  if (loading && games.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-brand mx-auto mb-4" />
          <p className="text-gray-600">جاري تحميل الألعاب...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-l from-brand/10 via-brand/5 to-white rounded-2xl p-8 border-2 border-brand/20 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-brand to-brand-deep rounded-2xl flex items-center justify-center shadow-xl">
              <Gamepad2 className="w-9 h-9 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-brand-deepest mb-1">إدارة الألعاب</h1>
              <p className="text-gray-600 text-base">
                عرض وإدارة الألعاب التراثية العربية المسجلة في النظام
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {user && (user.role === 'editor' || user.role === 'reviewer' || user.role === 'admin') && (
              <Link href="/dashboard/games/new">
                <Button className="bg-gradient-to-r from-brand to-brand-deep hover:from-brand-deep hover:to-brand text-white shadow-lg hover:shadow-xl transition-all px-6 py-6 text-base">
                  <Plus className="w-5 h-5 ml-2" />
                  إضافة لعبة جديدة
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-2 border-brand/30 shadow-lg hover:shadow-xl transition-all hover:scale-105 duration-300 bg-gradient-to-br from-white to-brand/5">
          <CardContent className="pt-6 pb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-brand-deep font-semibold mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 bg-brand rounded-full"></span>
                  إجمالي الألعاب
                </p>
                <p className="text-5xl font-bold text-brand-deep mb-1">{stats.total}</p>
                <p className="text-xs text-gray-600 font-medium">جميع الحالات</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-brand to-brand-deep rounded-2xl flex items-center justify-center shadow-xl">
                <Gamepad2 className="w-8 h-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200 shadow-lg hover:shadow-xl transition-all hover:scale-105 duration-300 bg-gradient-to-br from-white to-green-50">
          <CardContent className="pt-6 pb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 font-semibold mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                  منشورة
                </p>
                <p className="text-5xl font-bold text-green-600 mb-1">{stats.published}</p>
                <p className="text-xs text-gray-600 font-medium">متاحة للجمهور</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-xl">
                <Eye className="w-8 h-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-amber-200 shadow-lg hover:shadow-xl transition-all hover:scale-105 duration-300 bg-gradient-to-br from-white to-amber-50">
          <CardContent className="pt-6 pb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-700 font-semibold mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 bg-amber-600 rounded-full animate-pulse"></span>
                  قيد المراجعة
                </p>
                <p className="text-5xl font-bold text-amber-600 mb-1">{stats.underReview}</p>
                <p className="text-xs text-gray-600 font-medium">تحتاج موافقة</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center shadow-xl">
                <Clock className="w-8 h-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all hover:scale-105 duration-300 bg-gradient-to-br from-white to-gray-50">
          <CardContent className="pt-6 pb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-700 font-semibold mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 bg-gray-600 rounded-full"></span>
                  مسودات
                </p>
                <p className="text-5xl font-bold text-gray-600 mb-1">{stats.draft}</p>
                <p className="text-xs text-gray-600 font-medium">قيد التحرير</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-600 rounded-2xl flex items-center justify-center shadow-xl">
                <Edit className="w-8 h-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="border-2 border-brand/20 shadow-lg">
        <CardContent className="pt-6 pb-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="ابحث عن لعبة بالاسم، الوصف، أو الوسوم..."
                  value={searchInput}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pr-10 h-12 text-base border-2 border-gray-200 focus:border-brand"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className={`h-12 px-6 border-2 transition-all ${
                  showFilters 
                    ? 'bg-brand text-white border-brand' 
                    : 'border-gray-200 hover:border-brand hover:bg-brand/5'
                }`}
              >
                <SlidersHorizontal className="w-5 h-5 ml-2" />
                تصفية متقدمة
              </Button>
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="h-12 px-6 border-2 border-red-200 text-red-600 hover:bg-red-50"
                >
                  <X className="w-5 h-5 ml-2" />
                  مسح الفلاتر
                </Button>
              )}
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl border-2 border-gray-200 animate-in slide-in-from-top-2">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">الحالة</label>
                  <select
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="w-full h-10 px-3 border-2 border-gray-200 rounded-lg focus:border-brand focus:outline-none"
                  >
                    <option value="all">جميع الحالات</option>
                    <option value="published">منشور</option>
                    <option value="under_review">قيد المراجعة</option>
                    <option value="draft">مسودة</option>
                    <option value="rejected">مرفوض</option>
                    <option value="archived">مؤرشف</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">الدولة</label>
                  <select
                    value={filters.country}
                    onChange={(e) => handleFilterChange('country', e.target.value)}
                    className="w-full h-10 px-3 border-2 border-gray-200 rounded-lg focus:border-brand focus:outline-none"
                  >
                    <option value="all">جميع الدول</option>
                    {countries.map((country) => (
                      <option key={country.id} value={country.id}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">نوع اللعبة</label>
                  <select
                    value={filters.gameType}
                    onChange={(e) => handleFilterChange('gameType', e.target.value)}
                    className="w-full h-10 px-3 border-2 border-gray-200 rounded-lg focus:border-brand focus:outline-none"
                  >
                    <option value="all">جميع الأنواع</option>
                    {gameTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">الترتيب</label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="w-full h-10 px-3 border-2 border-gray-200 rounded-lg focus:border-brand focus:outline-none"
                  >
                    <option value="newest">الأحدث أولاً</option>
                    <option value="oldest">الأقدم أولاً</option>
                    <option value="name">الاسم (أ-ي)</option>
                    <option value="name_desc">الاسم (ي-أ)</option>
                  </select>
                </div>
              </div>
            )}

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm font-medium text-gray-600">الفلاتر النشطة:</span>
                {searchQuery && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1">
                    البحث: {searchQuery}
                  </Badge>
                )}
                {filters.status !== 'all' && (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-3 py-1">
                    الحالة: {getStatusText(filters.status)}
                  </Badge>
                )}
                {filters.country !== 'all' && (
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 px-3 py-1">
                    الدولة: {countries.find(c => c.id === filters.country)?.name}
                  </Badge>
                )}
                {filters.gameType !== 'all' && (
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 px-3 py-1">
                    النوع: {filters.gameType}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Games List */}
      <Card className="border-2 border-gray-200 shadow-xl">
        <CardHeader className="bg-gradient-to-l from-brand/5 via-gray-50 to-white border-b-2 border-gray-200 pb-6">
          <CardTitle className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-brand to-brand-deep rounded-xl flex items-center justify-center shadow-lg">
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold text-brand-deepest">قائمة الألعاب المسجلة</span>
              <p className="text-sm text-gray-600 font-normal mt-1">
                عرض {totalGames} {totalGames === 1 ? 'لعبة' : totalGames === 2 ? 'لعبتان' : 'لعبة'} في النظام
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-brand mx-auto mb-4" />
              <p className="text-gray-600">جاري البحث...</p>
            </div>
          ) : games.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Gamepad2 className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {hasActiveFilters ? 'لا توجد نتائج' : 'لا توجد ألعاب'}
              </h3>
              <p className="text-gray-600 text-lg mb-6 max-w-md mx-auto">
                {hasActiveFilters 
                  ? 'لم يتم العثور على ألعاب تطابق معايير البحث. جرب تعديل الفلاتر.'
                  : user?.role === 'viewer' 
                    ? 'لا توجد ألعاب منشورة حالياً. يرجى التحقق لاحقاً.'
                    : 'ابدأ بإضافة أول لعبة تراثية إلى النظام'}
              </p>
              {hasActiveFilters && (
                <Button
                  onClick={clearFilters}
                  variant="outline"
                  className="border-2 border-brand text-brand hover:bg-brand hover:text-white"
                >
                  <X className="w-4 h-4 ml-2" />
                  مسح الفلاتر
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {games.map((game) => (
                <div
                  key={game.id}
                  className="border-2 border-gray-200 rounded-xl p-6 hover:border-brand/30 hover:bg-brand/5 transition-all shadow-sm hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex-1 space-y-4">
                      {/* Header Section */}
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-brand to-brand-deep rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                          <Gamepad2 className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-gray-900 text-xl">
                              {game.canonicalName}
                            </h3>
                            <Badge className={`${getStatusColor(game.reviewStatus)} font-medium px-3 py-1`}>
                              {getStatusText(game.reviewStatus)}
                            </Badge>
                            {game.conceptId && (
                              <Badge variant="outline" className="border-indigo-300 text-indigo-700 bg-indigo-50 px-3 py-1">
                                🔗 مرتبط بمفهوم
                              </Badge>
                            )}
                          </div>
                          
                          {/* Description Preview */}
                          {game.description && (
                            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                              {game.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Main Info Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg">
                          <Globe className="w-4 h-4 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs text-blue-600 font-medium">الدولة</p>
                            <p className="text-sm font-semibold truncate">{game.country.name}</p>
                          </div>
                        </div>
                        
                        {game.region && (
                          <div className="flex items-center gap-2 bg-cyan-50 text-cyan-700 px-3 py-2 rounded-lg">
                            <MapPin className="w-4 h-4 flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="text-xs text-cyan-600 font-medium">المنطقة</p>
                              <p className="text-sm font-semibold truncate">{game.region}</p>
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2 bg-purple-50 text-purple-700 px-3 py-2 rounded-lg">
                          <Award className="w-4 h-4 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs text-purple-600 font-medium">مجال التراث</p>
                            <p className="text-sm font-semibold truncate">{game.heritageField.name}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-2 rounded-lg">
                          <Tag className="w-4 h-4 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs text-green-600 font-medium">نوع اللعبة</p>
                            <p className="text-sm font-semibold truncate">{game.gameType}</p>
                          </div>
                        </div>
                      </div>

                      {/* Additional Info Row */}
                      <div className="flex flex-wrap items-center gap-3 text-sm">
                        {game.contributor && (
                          <span className="flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-lg border border-amber-200">
                            <Users className="w-3.5 h-3.5" />
                            <span className="font-medium">أضيفت بواسطة:</span>
                            <span className="font-semibold">{game.contributor.name}</span>
                          </span>
                        )}
                        
                        <span className="flex items-center gap-1.5 bg-gray-50 text-gray-700 px-3 py-1.5 rounded-lg border border-gray-200">
                          <Calendar className="w-3.5 h-3.5" />
                          <span className="font-medium">
                            {new Date(game.createdAt).toLocaleDateString('ar-SA', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        </span>

                        {game.publishedAt && (
                          <span className="flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1.5 rounded-lg border border-green-200">
                            <Eye className="w-3.5 h-3.5" />
                            <span className="font-medium">نُشرت في:</span>
                            <span className="font-semibold">
                              {new Date(game.publishedAt).toLocaleDateString('ar-SA', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                          </span>
                        )}
                      </div>

                      {/* Tags Section */}
                      {game.tags && game.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
                          <span className="text-xs text-gray-500 font-medium self-center">الوسوم:</span>
                          {game.tags.slice(0, 5).map(({ tag }: any) => (
                            <span
                              key={tag.id}
                              className="px-2.5 py-1 text-xs bg-gray-100 text-gray-700 rounded-full border border-gray-200 hover:bg-gray-200 transition-colors"
                            >
                              #{tag.name}
                            </span>
                          ))}
                          {game.tags.length > 5 && (
                            <span className="px-2.5 py-1 text-xs bg-brand/10 text-brand rounded-full border border-brand/20 font-semibold">
                              +{game.tags.length - 5} وسم إضافي
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Actions Section */}
                    <div className="flex-shrink-0">
                      <GameActions
                        gameId={game.id}
                        gameSlug={game.slug}
                        gameName={game.canonicalName}
                        userRole={user?.role}
                        contributorId={game.contributorId}
                        currentUserId={user?.id}
                        reviewStatus={game.reviewStatus}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Pagination Controls */}
          {totalPages > 1 && !loading && (
            <div className="flex flex-col md:flex-row items-center justify-between mt-6 pt-6 border-t-2 border-gray-200 gap-4">
              <div className="text-sm text-gray-600 font-medium bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
                عرض <span className="text-brand font-bold">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> - <span className="text-brand font-bold">{Math.min(currentPage * ITEMS_PER_PAGE, totalGames)}</span> من أصل <span className="text-brand font-bold">{totalGames}</span> لعبة
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                  className="flex items-center gap-2"
                >
                  <ChevronRight className="w-4 h-4" />
                  السابق
                </Button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-4 py-2 ${
                          currentPage === pageNum
                            ? 'bg-gradient-to-r from-brand to-brand-deep text-white'
                            : ''
                        }`}
                      >
                        {pageNum}
                      </Button>
                    )
                  })}
                </div>
                
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                  className="flex items-center gap-2"
                >
                  التالي
                  <ChevronLeft className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info */}
      {user && (
        <Card className="border-2 border-blue-200 bg-gradient-to-l from-blue-50 to-white shadow-md">
          <CardContent className="pt-6 pb-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Eye className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-bold text-blue-900 mb-2 text-base">معلومات الصلاحيات</h4>
                <p className="text-sm text-blue-800 leading-relaxed">
                  <strong className="text-blue-900">ملاحظة:</strong> يعتمد ما تراه من ألعاب على صلاحيات دورك في النظام.
                  {user.role === 'admin' && (
                    <span className="block mt-2 bg-blue-100 px-3 py-2 rounded-lg">
                      🔓 <strong>مدير النظام:</strong> يمكنك رؤية وإدارة جميع الألعاب بكافة حالاتها
                    </span>
                  )}
                  {user.role === 'reviewer' && (
                    <span className="block mt-2 bg-blue-100 px-3 py-2 rounded-lg">
                      👁️ <strong>مراجع:</strong> يمكنك رؤية الألعاب المنشورة والألعاب قيد المراجعة فقط
                    </span>
                  )}
                  {user.role === 'editor' && (
                    <span className="block mt-2 bg-blue-100 px-3 py-2 rounded-lg">
                      ✏️ <strong>محرر:</strong> يمكنك رؤية ألعابك الخاصة (بكافة حالاتها) والألعاب المنشورة للآخرين
                    </span>
                  )}
                  {user.role === 'viewer' && (
                    <span className="block mt-2 bg-blue-100 px-3 py-2 rounded-lg">
                      👀 <strong>مشاهد:</strong> يمكنك رؤية الألعاب المنشورة فقط
                    </span>
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
