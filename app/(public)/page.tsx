import { Metadata } from 'next'
import { getCurrentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import Link from 'next/link'
import {
  Search,
  Book,
  Globe,
  LayoutGrid,
  ArrowLeft,
  Award,
  Users,
  MapPin,
  Clock,
  Heart,
  Sparkles,
  Play,
} from 'lucide-react'
import { GameCard } from '@/components/public/GameCard'
import { CategoryGrid } from '@/components/public/CategoryGrid'
import { HeroSection, type HeroVideoConfig } from '@/components/public/HeroSection'
import { getSetting } from '@/lib/actions/settings'
import { getActiveCategories } from '@/lib/actions/category'
import { SuggestGameButton } from '@/components/public/SuggestGameButton'

// SEO Metadata
export const metadata: Metadata = {
  title: 'المسرد التوثيقي للألعاب التراثية العربية | الأرشيف الرقمي المفتوح',
  description: 'منصة توثيقية تفاعلية تحفظ قواعد وقيم الألعاب التقليدية في العالم العربي. اكتشف أكثر من 100 لعبة شعبية من مختلف الدول العربية.',
  keywords: ['ألعاب شعبية', 'ألعاب تراثية', 'تراث عربي', 'ألعاب أطفال', 'ثقافة عربية'],
  openGraph: {
    title: 'المسرد التوثيقي للألعاب التراثية العربية',
    description: 'منصة توثيقية تفاعلية تحفظ قواعد وقيم الألعاب التقليدية في العالم العربي',
    type: 'website',
    locale: 'ar_SA',
  },
}

export default async function HomePage() {
  // Get current user for authentication state
  const user = await getCurrentUser()

  // Fetch hero video configuration from settings
  const heroVideoSetting = await getSetting('hero_video_config')
  let heroVideos: HeroVideoConfig[] = [
    {
    type: 'local',
    src: '/videos/traditional-games-hero.mp4',
    poster: '/images/hero-poster.jpg',
    },
    {
      type: 'local',
      src: '/videos/traditional-games-hero1.mp4',
      poster: '/images/hero-poster.jpg',
    },
    {
      type: 'local',
      src: '/videos/traditional-games-hero2.mp4',
      poster: '/images/hero-poster.jpg',
    },
  ]

  try {
    if (heroVideoSetting.setting?.value) {
      const parsedVideo = JSON.parse(heroVideoSetting.setting.value)
      // إذا كان الإعداد المحفوظ هو مصفوفة، استخدمها مباشرة
      if (Array.isArray(parsedVideo)) {
        heroVideos = parsedVideo
      } else {
        // إذا كان فيديو واحد، ضعه في مصفوفة
        heroVideos = [parsedVideo]
      }
    }
  } catch {
    // استخدام الإعدادات الافتراضية
  }

  // Fetch statistics for all games
  const totalGamesCount = await db.game.count()
  const publishedGamesCount = await db.game.count({
    where: { reviewStatus: 'published' },
  })

  // Get unique regions and countries
  const allGames = await db.game.findMany({
    select: {
      country: {
        select: {
          name: true,
          region: true,
        },
      },
    },
  })

  const uniqueRegions = new Set(allGames.map((g) => g.country.region).filter(Boolean))
  const uniqueCountries = new Set(allGames.map((g) => g.country.name))

  // Fetch real games from database for display
  const publishedGames = await db.game.findMany({
    where: { reviewStatus: 'published' },
    include: {
      country: true,
      heritageField: true,
      tags: { include: { tag: true } },
      media: {
        take: 1,
        select: { url: true },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 6,
  })

  // Transform games for display
  const gamesData = publishedGames.map((game) => ({
    id: game.id,
    name: game.canonicalName,
    slug: game.slug,
    localNames: game.localNames,
    country: game.country.name,
    region: game.region || 'غير محدد',
    gameType: game.gameType,
    ageGroup: game.ageGroup || 'غير محدد',
    playersCount: game.playersCount || 'غير محدد',
    description:
      game.description.length > 150
        ? game.description.substring(0, 150) + '...'
        : game.description,
    imageUrl:
      game.media && game.media.length > 0
        ? game.media[0].url
        : 'https://images.unsplash.com/photo-1611195955636-f3830fbac00c?auto=format&fit=crop&q=80&w=800',
    tags: game.tags.map((gt) => gt.tag.name).slice(0, 3),
  }))

  // Fetch categories from database
  const categoriesResult = await getActiveCategories()
  const categories = categoriesResult.categories || []

  const stats = {
    totalGames: totalGamesCount,
    publishedGames: publishedGamesCount,
    regions: uniqueRegions.size,
    countries: uniqueCountries.size,
  }

  return (
    <>
      {/* Hero Section with Video Background */}
      <HeroSection videos={heroVideos} stats={stats} autoSwitchInterval={15} />

      {/* Quick Stats Bar */}
      <section className="relative -mt-16 z-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center group cursor-default">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-brand to-brand-light rounded-2xl mb-3 group-hover:scale-110 transition-transform shadow-lg">
                  <Book className="w-7 h-7 text-white" />
                </div>
                <div className="text-3xl font-black text-brand-deepest">{totalGamesCount}</div>
                <div className="text-sm text-gray-500 font-medium">لعبة موثقة</div>
              </div>

              <div className="text-center group cursor-default">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-accent to-accent-dark rounded-2xl mb-3 group-hover:scale-110 transition-transform shadow-lg">
                  <Globe className="w-7 h-7 text-brand-deepest" />
                </div>
                <div className="text-3xl font-black text-brand-deepest">{uniqueCountries.size}</div>
                <div className="text-sm text-gray-500 font-medium">دولة عربية</div>
              </div>

              <div className="text-center group cursor-default">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-3 group-hover:scale-110 transition-transform shadow-lg">
                  <MapPin className="w-7 h-7 text-white" />
                </div>
                <div className="text-3xl font-black text-brand-deepest">{uniqueRegions.size}</div>
                <div className="text-sm text-gray-500 font-medium">إقليم جغرافي</div>
              </div>

              <div className="text-center group cursor-default">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl mb-3 group-hover:scale-110 transition-transform shadow-lg">
                  <Award className="w-7 h-7 text-white" />
                </div>
                <div className="text-3xl font-black text-brand-deepest">{publishedGamesCount}</div>
                <div className="text-sm text-gray-500 font-medium">لعبة منشورة</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Brief Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 bg-brand/10 rounded-full px-4 py-2 mb-6">
                <Sparkles className="w-4 h-4 text-brand" />
                <span className="text-brand font-bold text-sm">من نحن</span>
              </div>

              <h2 className="text-4xl font-black text-brand-deepest mb-6 leading-tight">
                نحفظ ذاكرة الأجيال
                <span className="text-transparent bg-clip-text bg-gradient-to-l from-accent to-accent-dark">
                  {' '}
                  للأجيال القادمة
                </span>
              </h2>

              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                المسرد التوثيقي للألعاب التراثية العربية هو مشروع توثيقي رقمي يهدف إلى حفظ وأرشفة الألعاب
                الشعبية التي لعبها أجدادنا عبر الأجيال. نسعى لتوثيق القواعد، القيم، والسياق
                الاجتماعي لكل لعبة.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Heart className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-bold text-brand-deepest">توثيق أمين</div>
                    <div className="text-sm text-gray-500">مصادر موثقة ومراجعة</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Globe className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-bold text-brand-deepest">تغطية شاملة</div>
                    <div className="text-sm text-gray-500">من كل الدول العربية</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Users className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-bold text-brand-deepest">مشاركة مجتمعية</div>
                    <div className="text-sm text-gray-500">ساهم في الإضافة</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Clock className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <div className="font-bold text-brand-deepest">تحديث مستمر</div>
                    <div className="text-sm text-gray-500">إضافات جديدة دائماً</div>
                  </div>
                </div>
              </div>

              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-brand font-bold hover:text-brand-deepest transition-colors"
              >
                اقرأ المزيد عن المشروع
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>

            {/* Visual Element */}
            <div className="order-1 lg:order-2 relative">
              <div className="relative aspect-square max-w-md mx-auto">
                {/* Decorative circles */}
                <div className="absolute inset-0 bg-gradient-to-br from-brand/20 to-accent/20 rounded-full blur-3xl" />
                <div className="absolute top-8 right-8 w-24 h-24 bg-accent/30 rounded-full animate-float" />
                <div className="absolute bottom-12 left-12 w-16 h-16 bg-brand/30 rounded-full animate-float animation-delay-2000" />

                {/* Main card */}
                <div className="relative bg-white rounded-3xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-brand to-brand-light rounded-2xl p-6 text-white">
                      <Play className="w-8 h-8 mb-2" />
                      <div className="text-2xl font-black">{totalGamesCount}+</div>
                      <div className="text-sm opacity-80">لعبة</div>
                    </div>
                    <div className="bg-gradient-to-br from-accent to-accent-dark rounded-2xl p-6 text-brand-deepest">
                      <Globe className="w-8 h-8 mb-2" />
                      <div className="text-2xl font-black">{uniqueCountries.size}</div>
                      <div className="text-sm opacity-80">دولة</div>
                    </div>
                    <div className="col-span-2 bg-gray-50 rounded-2xl p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-brand/10 rounded-full flex items-center justify-center">
                          <Heart className="w-6 h-6 text-brand" />
                        </div>
                        <div>
                          <div className="font-bold text-brand-deepest">حفظ التراث</div>
                          <div className="text-sm text-gray-500">للأجيال القادمة</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Search Section */}
      <section id="search" className="relative bg-white py-20 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="h-1 w-12 bg-gradient-to-r from-brand to-accent rounded-full" />
              <h2 className="text-4xl font-black text-brand-deepest">ابحث عن لعبتك المفضلة</h2>
              <div className="h-1 w-12 bg-gradient-to-l from-brand to-accent rounded-full" />
            </div>
            <p className="text-gray-600 text-lg font-medium max-w-2xl mx-auto">
              استخدم البحث المتقدم للعثور على الألعاب حسب الدولة، النوع، أو الفئة العمرية
            </p>
          </div>

          {/* Search Box */}
          <div className="max-w-4xl mx-auto">
            <div className="group relative bg-gradient-to-br from-white to-gray-50 rounded-3xl border-2 border-gray-200 p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:border-brand/30">
              {/* Main Search Input */}
              <div className="relative mb-6">
                <div className="absolute right-5 top-1/2 -translate-y-1/2 z-10">
                  <Search className="h-6 w-6 text-gray-400 group-hover:text-brand transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="ابحث باسم اللعبة، الدولة، أو الوصف..."
                  className="w-full h-16 pr-16 pl-6 text-lg border-2 border-gray-200 rounded-2xl focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all bg-white shadow-sm"
                />
              </div>

              {/* Quick Filters */}
              <div className="flex flex-wrap gap-3 mb-6">
                <span className="text-sm font-bold text-gray-600">بحث سريع:</span>
                <button className="px-4 py-2 bg-brand/10 hover:bg-brand hover:text-white text-brand-deepest rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105 border border-brand/20">
                  ألعاب حركية
                </button>
                <button className="px-4 py-2 bg-accent/10 hover:bg-accent hover:text-brand-deepest text-accent-dark rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105 border border-accent/20">
                  ألعاب ذهنية
                </button>
                <button className="px-4 py-2 bg-blue-50 hover:bg-blue-500 hover:text-white text-blue-700 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105 border border-blue-200">
                  ألعاب جماعية
                </button>
                <button className="px-4 py-2 bg-purple-50 hover:bg-purple-500 hover:text-white text-purple-700 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105 border border-purple-200">
                  ألعاب الأطفال
                </button>
              </div>

              {/* Search Button */}
              <Link
                href="/gallery"
                className="group/btn w-full inline-flex items-center justify-center gap-3 bg-gradient-to-r from-brand-deepest to-brand hover:from-brand hover:to-brand-light px-8 py-4 rounded-2xl text-lg font-bold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
              >
                <Search className="h-6 w-6 group-hover/btn:scale-110 transition-transform" />
                بحث متقدم في المعرض
                <ArrowLeft className="h-5 w-5 group-hover/btn:-translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="mx-auto max-w-7xl px-6 py-20 bg-gray-50">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-1 w-8 bg-gradient-to-l from-brand to-accent rounded-full" />
              <span className="text-brand font-bold text-sm">التصنيفات</span>
            </div>
            <h2 className="text-3xl font-black text-brand-deepest">تصفح حسب التصنيف</h2>
            <p className="text-sm text-gray-600 mt-1">{categories.length} تصنيف متاح</p>
          </div>
          <Link
            href="/gallery"
            className="flex items-center gap-1 text-sm font-bold text-brand hover:text-brand-deepest transition-all hover:gap-2 bg-brand/5 px-4 py-2 rounded-lg hover:bg-brand/10"
          >
            عرض الكل <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>

        {categories.length > 0 ? (
          <CategoryGrid categories={categories} />
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-gray-200">
            <LayoutGrid className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">لا توجد تصنيفات متاحة حالياً</p>
            {user && (user.role === 'admin' || user.role === 'reviewer') && (
              <Link
                href="/dashboard/categories"
                className="inline-block mt-4 text-sm font-bold text-brand hover:underline"
              >
                إضافة تصنيفات جديدة
              </Link>
            )}
          </div>
        )}
      </section>

      {/* Games Grid */}
      <section id="games" className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-10 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-accent-dark text-white shadow-lg">
            <LayoutGrid className="h-7 w-7" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-brand-deepest">أحدث الإضافات</h2>
            <p className="text-sm text-gray-600 font-medium mt-1">
              {publishedGamesCount} لعبة منشورة من أصل {totalGamesCount}
            </p>
          </div>
        </div>

        {gamesData.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {gamesData.map((game) => (
              <GameCard
                key={game.id}
                id={game.id}
                name={game.name}
                slug={game.slug}
                country={game.country}
                description={game.description}
                gameType={game.gameType}
                playersCount={game.playersCount}
                ageGroup={game.ageGroup}
                imageUrl={game.imageUrl}
                tags={game.tags}
              />
            ))}
          </div>
        ) : (
          <div className="col-span-full rounded-3xl border border-dashed border-gray-200 bg-gray-50 py-32 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm">
              <Search className="h-8 w-8 text-accent" />
            </div>
            <h3 className="text-xl font-bold text-brand-deepest">لا توجد ألعاب منشورة حالياً</h3>
            <p className="text-gray-500 mt-2">كن أول من يضيف لعبة تراثية!</p>
            {user &&
              (user.role === 'editor' || user.role === 'reviewer' || user.role === 'admin') && (
                <Link
                  href="/dashboard/games/new"
                  className="mt-6 inline-block text-sm font-bold text-accent hover:underline"
                >
                  إضافة لعبة جديدة
                </Link>
              )}
          </div>
        )}

        {/* View All Button */}
        {gamesData.length > 0 && (
          <div className="mt-12 text-center">
            <Link
              href="/gallery"
              className="inline-flex items-center gap-3 bg-brand-deepest hover:bg-brand text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <LayoutGrid className="w-5 h-5" />
              عرض جميع الألعاب
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-brand-deepest via-brand to-brand-light py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-black text-white mb-6">ساهم في حفظ التراث</h2>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            نرحب بمساهماتكم في توثيق الألعاب التراثية من مختلف الدول العربية.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <SuggestGameButton 
              variant="cta" 
              className="inline-flex items-center gap-3 bg-accent hover:bg-accent-dark text-brand-deepest px-8 py-4 rounded-2xl font-bold transition-all duration-300 hover:scale-105 shadow-lg"
            />
            <Link
              href="/about"
              className="inline-flex items-center gap-3 bg-white/10 hover:bg-white/20 text-white border-2 border-white/30 px-8 py-4 rounded-2xl font-bold transition-all duration-300 hover:scale-105"
            >
              تعرف على المشروع
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
