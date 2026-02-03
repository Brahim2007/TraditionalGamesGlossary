import { Metadata } from 'next'
import { getGameBySlug } from '@/lib/actions/game'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  Gamepad2,
  Users,
  Clock,
  Target,
  BookOpen,
  Award,
  MapPin,
  Calendar,
  Book,
  Heart,
  Brain,
  Trophy,
  Star,
  List,
  CheckCircle,
  Volume2,
  Globe,
  Home as HomeIcon,
  Landmark,
  Sparkles,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { FormattedContent } from '@/components/ui/formatted-content'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const result = await getGameBySlug(slug)

  if (!result.success || !result.game) {
    return { title: 'اللعبة غير موجودة' }
  }

  return {
    title: `${result.game.canonicalName} | مسرد الألعاب التراثية`,
    description: result.game.description.substring(0, 160),
  }
}

export default async function GameDetailPage({ params }: PageProps) {
  const { slug } = await params
  const result = await getGameBySlug(slug)

  if (!result.success || !result.game) {
    return (
      <div className="min-h-screen bg-[#f5f5f0] flex items-center justify-center px-6">
        <div className="text-center">
          <div className="w-24 h-24 bg-[#2d5f4f]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Gamepad2 className="w-12 h-12 text-[#2d5f4f]" />
          </div>
          <h1 className="text-3xl font-bold text-[#1a3d32] mb-4">اللعبة غير موجودة</h1>
          <p className="text-[#666666] mb-8">عذراً، لم نتمكن من العثور على اللعبة المطلوبة.</p>
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#d4af37] to-[#e6c758] text-[#1a3d32] px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
          >
            <Book className="w-5 h-5" />
            العودة للمعرض
          </Link>
        </div>
      </div>
    )
  }

  const game = result.game

  // Safe data extraction
  const primaryMedia = game.media?.[0] || null
  const tags = game.tags?.map((t) => t.tag?.name).filter(Boolean) || []
  const references =
    game.references?.map((r) => ({
      citation: r.citation || 'غير محدد',
      sourceType: r.sourceType || 'غير محدد',
      author: r.author || 'غير معروف',
      year: r.year || 'غير محدد',
    })) || []

  const countryName = game.country?.name || 'غير محدد'
  const region = game.region || 'غير محدد'
  const heritageFieldName = game.heritageField?.name || 'غير محدد'

  // Similar games
  const similarGames = [
    ...(game.similaritiesAsA?.map((s: any) => ({ ...s.gameB, similarity: s })) || []),
    ...(game.similaritiesAsB?.map((s: any) => ({ ...s.gameA, similarity: s })) || []),
  ]

  return (
    <div className="min-h-screen bg-[#f5f5f0]">
      {/* Hero Header */}
      <div
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1a3d32 0%, #2d5f4f 50%, #3d7563 100%)',
        }}
      >
        {/* Subtle Pattern Overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '32px 32px'
          }} />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-10">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center gap-3 text-sm">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-white/70 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/10"
            >
              <HomeIcon className="h-4 w-4" />
              <span>الرئيسية</span>
            </Link>
            <ArrowRight className="h-4 w-4 rotate-180 text-white/30" />
            <Link
              href="/gallery"
              className="flex items-center gap-1.5 text-white/70 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/10"
            >
              <Book className="h-4 w-4" />
              <span>المعرض</span>
            </Link>
            <ArrowRight className="h-4 w-4 rotate-180 text-white/30" />
            <span className="text-white font-medium bg-white/10 px-4 py-1.5 rounded-lg">
              {game.canonicalName}
            </span>
          </nav>

          {/* Game Title Section */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div className="flex-1">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <span className="bg-[#f7d794] text-[#3d2e27] text-sm font-semibold px-4 py-2 rounded-lg shadow-sm">
                  {heritageFieldName}
                </span>
                <span className="bg-white/20 backdrop-blur-sm text-white text-sm font-medium px-4 py-2 rounded-lg border border-white/20">
                  {game.gameType}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 leading-tight">
                {game.canonicalName}
              </h1>

              {/* Local Names */}
              {game.localNames && game.localNames.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mb-5">
                  <span className="text-white/60 text-sm">أسماء أخرى:</span>
                  {game.localNames.map((n: string) => (
                    <span
                      key={n}
                      className="bg-white/10 text-white text-sm px-3 py-1 rounded-lg border border-white/10"
                    >
                      {n}
                    </span>
                  ))}
                </div>
              )}

              {/* Location */}
              <div className="flex items-center gap-3 text-white/80">
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
                  <MapPin className="h-4 w-4 text-[#d4af37]" />
                  <span>{countryName}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
                  <Globe className="h-4 w-4 text-[#d4af37]" />
                  <span>{region}</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex gap-4">
              {game.playersCount && (
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 text-center border border-white/10 min-w-[100px]">
                  <Users className="h-6 w-6 text-[#d4af37] mx-auto mb-2" />
                  <div className="text-white font-bold text-lg">{game.playersCount}</div>
                  <div className="text-white/60 text-xs">لاعب</div>
                </div>
              )}
              {game.ageGroup && (
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 text-center border border-white/10 min-w-[100px]">
                  <Calendar className="h-6 w-6 text-[#d4af37] mx-auto mb-2" />
                  <div className="text-white font-bold text-lg">{game.ageGroup}</div>
                  <div className="text-white/60 text-xs">العمر</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Curved Bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-[#f5f5f0]" style={{
          borderRadius: '32px 32px 0 0'
        }} />
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Game Image */}
            {primaryMedia && (
              <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-[#e0e0e0] hover:shadow-lg transition-shadow">
                <div className="relative aspect-video w-full">
                  <Image
                    src={primaryMedia.url}
                    alt={game.canonicalName}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                {primaryMedia.caption && (
                  <div className="px-6 py-4 border-t border-[#e0e0e0] bg-[#faf9f5]">
                    <p className="text-sm text-[#666666]">{primaryMedia.caption}</p>
                  </div>
                )}
              </div>
            )}

            {/* Description */}
            <ContentCard icon={BookOpen} title="الوصف" iconColor="#2d5f4f">
              <p className="text-[#333333] leading-relaxed whitespace-pre-wrap text-lg">
                {game.description}
              </p>
            </ContentCard>

            {/* Cultural Concept */}
            {game.concept && (
              <ContentCard icon={Brain} title="المفهوم الثقافي" iconColor="#4a9d9c" highlight>
                <div className="bg-[#4a9d9c]/10 rounded-xl p-6 border border-[#4a9d9c]/20">
                  <div className="flex items-center gap-3 mb-3">
                    <Sparkles className="h-5 w-5 text-[#4a9d9c]" />
                    <h3 className="text-xl font-bold text-[#1a3d32]">{game.concept.name}</h3>
                  </div>
                  {game.concept.description && (
                    <p className="text-[#666666] leading-relaxed">{game.concept.description}</p>
                  )}
                  <div className="mt-4 flex items-center gap-2 text-sm text-[#4a9d9c]">
                    <CheckCircle className="h-4 w-4" />
                    <span>هذه اللعبة جزء من مجموعة ألعاب متشابهة ثقافياً</span>
                  </div>
                </div>
              </ContentCard>
            )}

            {/* Rules */}
            {game.rules && game.rules.length > 0 && (
              <ContentCard
                icon={List}
                title="قواعد اللعب"
                iconColor="#2d5f4f"
                badge={`${game.rules.length} قاعدة`}
              >
                <div className="space-y-3">
                  {game.rules.map((rule: string, index: number) => (
                    <div
                      key={index}
                      className="flex gap-4 p-4 bg-[#faf9f5] rounded-xl border border-[#e0e0e0] hover:border-[#2d5f4f]/30 transition-colors"
                    >
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#2d5f4f] to-[#3d7563] text-sm font-bold text-white">
                        {index + 1}
                      </div>
                      <p className="pt-1 text-[#333333] leading-relaxed">{rule}</p>
                    </div>
                  ))}
                </div>
              </ContentCard>
            )}

            {/* Win/Loss System */}
            {game.winLossSystem && (
              <ContentCard icon={Trophy} title="نظام الفوز والخسارة" iconColor="#d4af37">
                <FormattedContent content={game.winLossSystem} type="win-loss" />
              </ContentCard>
            )}

            {/* Start/End Mechanism */}
            {game.startEndMechanism && (
              <ContentCard icon={Award} title="آلية البدء والانتهاء" iconColor="#5a8f7b">
                <FormattedContent content={game.startEndMechanism} type="start-end" />
              </ContentCard>
            )}

            {/* Oral Tradition */}
            {game.oralTradition && (
              <ContentCard icon={Volume2} title="الموروث الشفهي" iconColor="#ff6b6b">
                <div className="bg-gradient-to-br from-[#ff6b6b]/10 to-[#f4a582]/10 rounded-xl p-6 border border-[#ff6b6b]/20">
                  <p className="text-[#333333] leading-relaxed whitespace-pre-wrap font-medium">
                    {game.oralTradition}
                  </p>
                </div>
              </ContentCard>
            )}

            {/* Social Context */}
            {game.socialContext && (
              <ContentCard icon={Heart} title="السياق الاجتماعي" iconColor="#f4a582">
                <FormattedContent content={game.socialContext} type="social-context" />
              </ContentCard>
            )}

            {/* References */}
            {references.length > 0 && (
              <ContentCard
                icon={Book}
                title="المراجع"
                iconColor="#6b5850"
                badge={`${references.length} مصدر`}
              >
                <div className="space-y-3">
                  {references.map((ref, index: number) => (
                    <div key={index} className="p-4 bg-[#faf9f5] rounded-xl border border-[#e0e0e0]">
                      <p className="text-[#333333] font-medium mb-3">{ref.citation}</p>
                      <div className="flex flex-wrap gap-2 text-xs">
                        {ref.sourceType && ref.sourceType !== 'غير محدد' && (
                          <span className="bg-[#6b5850]/10 text-[#6b5850] px-3 py-1.5 rounded-lg font-medium">
                            {ref.sourceType}
                          </span>
                        )}
                        {ref.author && ref.author !== 'غير معروف' && (
                          <span className="bg-[#6b5850]/10 text-[#6b5850] px-3 py-1.5 rounded-lg font-medium">
                            {ref.author}
                          </span>
                        )}
                        {ref.year && ref.year !== 'غير محدد' && (
                          <span className="bg-[#6b5850]/10 text-[#6b5850] px-3 py-1.5 rounded-lg font-medium">
                            {ref.year}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ContentCard>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Similar Games */}
            {similarGames.length > 0 && (
              <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-[#e0e0e0]">
                <div className="p-5 bg-gradient-to-l from-[#2d5f4f]/10 to-transparent border-b border-[#e0e0e0]">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-gradient-to-br from-[#2d5f4f] to-[#3d7563] rounded-xl flex items-center justify-center shadow-md">
                      <Gamepad2 className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#1a3d32]">ألعاب مشابهة</h3>
                      <p className="text-xs text-[#666666]">{similarGames.length} لعبة ذات صلة</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto">
                  {similarGames.map((similarGame: any) => (
                    <Link
                      key={similarGame.id}
                      href={`/game/${similarGame.slug}`}
                      className="block p-3 rounded-xl border border-[#e0e0e0] hover:border-[#2d5f4f]/30 hover:bg-[#faf9f5] transition-all group hover:-translate-y-1 hover:shadow-md"
                    >
                      <div className="flex gap-3">
                        {similarGame.media?.[0] && (
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                            <Image
                              src={similarGame.media[0].url}
                              alt={similarGame.canonicalName}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-[#1a3d32] group-hover:text-[#2d5f4f] transition-colors truncate">
                            {similarGame.canonicalName}
                          </h4>
                          <p className="text-xs text-[#666666] mb-2">
                            {similarGame.country?.name}
                          </p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-[#e0e0e0] rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-[#2d5f4f] to-[#4a8c77] rounded-full"
                                style={{
                                  width: `${(similarGame.similarity.overallScore * 100).toFixed(0)}%`,
                                }}
                              />
                            </div>
                            <span className="text-xs font-bold text-[#2d5f4f]">
                              {(similarGame.similarity.overallScore * 100).toFixed(0)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Game Details - Bookshelf Style */}
            <div
              className="rounded-2xl shadow-md overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #6b5850 0%, #4a3730 100%)',
              }}
            >
              <div className="p-5 border-b border-white/10">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <Landmark className="h-5 w-5 text-[#d4af37]" />
                  تفاصيل اللعبة
                </h3>
              </div>
              <div className="divide-y divide-white/10">
                <DetailRow icon={Globe} label="البلد" value={countryName} />
                <DetailRow icon={MapPin} label="المنطقة" value={region} />
                <DetailRow icon={Gamepad2} label="نوع اللعبة" value={game.gameType} />
                <DetailRow icon={Landmark} label="مجال التراث" value={heritageFieldName} />
                <DetailRow icon={Users} label="عدد اللاعبين" value={game.playersCount} />
                <DetailRow icon={Calendar} label="الفئة العمرية" value={game.ageGroup} />
                <DetailRow icon={Heart} label="الممارسون" value={game.practitioners} />
                <DetailRow icon={Clock} label="التوقيت" value={game.timing} />
                <DetailRow icon={Target} label="الأدوات" value={game.tools?.join('، ')} />
                <DetailRow icon={Globe} label="بيئة اللعب" value={game.environment} />
              </div>
            </div>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="bg-white rounded-2xl shadow-md p-5 border border-[#e0e0e0]">
                <div className="flex items-center gap-2 mb-4">
                  <Star className="h-5 w-5 text-[#d4af37]" />
                  <h3 className="font-bold text-[#1a3d32]">الوسوم</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag: string, index: number) => (
                    <span
                      key={`${tag}-${index}`}
                      className="bg-[#f7d794] text-[#3d2e27] px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-[#e6c758] transition-colors cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Back to Gallery Button */}
            <Link
              href="/gallery"
              className="flex items-center justify-center gap-3 w-full py-4 px-6 bg-gradient-to-r from-[#d4af37] to-[#e6c758] text-[#1a3d32] rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <ArrowRight className="h-5 w-5" />
              العودة للمعرض
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

// Content Card Component
function ContentCard({
  icon: Icon,
  title,
  badge,
  iconColor,
  highlight,
  children,
}: {
  icon: any
  title: string
  badge?: string
  iconColor: string
  highlight?: boolean
  children: React.ReactNode
}) {
  return (
    <div className={`bg-white rounded-2xl shadow-md overflow-hidden border border-[#e0e0e0] hover:shadow-lg transition-all ${highlight ? 'ring-2 ring-[#4a9d9c]/20' : ''}`}>
      <div className="flex items-center justify-between p-5 border-b border-[#e0e0e0] bg-[#faf9f5]">
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center shadow-md"
            style={{ background: `linear-gradient(135deg, ${iconColor} 0%, ${iconColor}dd 100%)` }}
          >
            <Icon className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-lg font-bold text-[#1a3d32]">{title}</h2>
        </div>
        {badge && (
          <span className="text-xs font-semibold text-[#666666] bg-[#e0e0e0] px-3 py-1.5 rounded-lg">
            {badge}
          </span>
        )}
      </div>
      <div className="p-6">{children}</div>
    </div>
  )
}

// Detail Row Component for Sidebar
function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: any
  label: string
  value?: string | null
}) {
  if (!value || value === 'غير محدد') return null

  return (
    <div className="flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-colors">
      <div className="flex items-center gap-3">
        <Icon className="h-4 w-4 text-[#d4af37] flex-shrink-0" />
        <span className="text-sm text-white/70">{label}</span>
      </div>
      <span className="text-sm font-medium text-white text-left">{value}</span>
    </div>
  )
}
