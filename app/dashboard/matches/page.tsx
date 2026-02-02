// Potential Matches Page
// صفحة التطابقات المحتملة

import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { getPendingSimilarities, getGameConcepts } from '@/lib/actions/similarity'
import { MatchesTable } from '@/components/similarity/MatchesTable'
import { ConceptsPanel } from '@/components/similarity/ConceptsPanel'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { GitCompare, AlertCircle, Loader2 } from 'lucide-react'

export default async function MatchesPage() {
  const user = await getCurrentUser()

  // Redirect if not reviewer or admin
  if (!user || !['reviewer', 'admin'].includes(user.role)) {
    redirect('/dashboard')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-l from-brand/10 to-white rounded-2xl p-8 border-2 border-brand/20 shadow-lg mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-14 h-14 bg-brand rounded-xl flex items-center justify-center shadow-lg">
                <GitCompare className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-brand-deepest">التطابقات المحتملة</h1>
                <p className="text-gray-600 mt-1">
                  مراجعة الألعاب المتشابهة وربطها بمفاهيم ثقافية
                </p>
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <div className="text-right">
              <p className="text-sm text-gray-500">نظام التطابق الذكي</p>
              <p className="text-xs text-gray-400">مدعوم بالذكاء الاصطناعي</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🤖</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-2 border-amber-200 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-700 font-medium mb-1">تطابقات معلقة</p>
                <Suspense fallback={<div className="h-10 w-20 bg-amber-100 animate-pulse rounded-lg" />}>
                  <PendingCount />
                </Suspense>
                <p className="text-xs text-gray-500 mt-1">بانتظار المراجعة</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                <AlertCircle className="w-7 h-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-brand/30 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-brand-deep font-medium mb-1">مفاهيم ثقافية</p>
                <Suspense fallback={<div className="h-10 w-20 bg-brand/10 animate-pulse rounded-lg" />}>
                  <ConceptsCount />
                </Suspense>
                <p className="text-xs text-gray-500 mt-1">عائلات الألعاب</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-brand to-brand-deep rounded-xl flex items-center justify-center shadow-lg">
                <GitCompare className="w-7 h-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 font-medium mb-1">الحالة</p>
                <p className="text-3xl font-bold text-green-600">نشط</p>
                <p className="text-xs text-gray-500 mt-1">النظام يعمل</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <div className="relative">
                  <Loader2 className="w-7 h-7 text-white animate-spin" />
                  <div className="absolute inset-0 w-7 h-7 bg-green-300 rounded-full animate-ping opacity-20"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Matches Table */}
        <div className="lg:col-span-2">
          <Card className="border-2 border-gray-200 shadow-lg">
            <CardHeader className="bg-gradient-to-l from-gray-50 to-white border-b-2 border-gray-200">
              <CardTitle className="flex items-center gap-3 text-brand-deepest">
                <div className="w-10 h-10 bg-brand/10 rounded-lg flex items-center justify-center">
                  <GitCompare className="w-5 h-5 text-brand" />
                </div>
                <div>
                  <span className="text-xl">التطابقات المعلقة للمراجعة</span>
                  <p className="text-xs text-gray-500 font-normal mt-1">
                    راجع وقرر بشأن التطابقات المقترحة
                  </p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <Suspense fallback={<MatchesTableSkeleton />}>
                <MatchesTableContent />
              </Suspense>
            </CardContent>
          </Card>
        </div>

        {/* Concepts Panel */}
        <div>
          <Suspense fallback={<ConceptsPanelSkeleton />}>
            <ConceptsPanelContent />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

// Server Components
async function PendingCount() {
  const matches = await getPendingSimilarities()
  return <p className="text-4xl font-bold text-amber-600">{matches.length}</p>
}

async function ConceptsCount() {
  const concepts = await getGameConcepts()
  return <p className="text-4xl font-bold text-brand-deep">{concepts.length}</p>
}

async function MatchesTableContent() {
  const matches = await getPendingSimilarities()
  return <MatchesTable matches={matches} />
}

async function ConceptsPanelContent() {
  const concepts = await getGameConcepts()
  return <ConceptsPanel concepts={concepts} />
}

// Skeletons
function MatchesTableSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-20 bg-gray-100 animate-pulse rounded-lg" />
      ))}
    </div>
  )
}

function ConceptsPanelSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="h-6 bg-gray-200 animate-pulse rounded w-1/2" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 animate-pulse rounded" />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}