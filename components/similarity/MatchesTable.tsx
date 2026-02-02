'use client'

// Matches Table Component
// مكون جدول التطابقات

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  acceptSimilarity,
  rejectSimilarity,
  postponeSimilarity,
} from '@/lib/actions/similarity'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Check,
  X,
  Clock,
  ChevronDown,
  ChevronUp,
  Globe,
  Users,
  Gamepad2,
  ExternalLink,
  Eye,
} from 'lucide-react'
import type { GameSimilarity } from '@prisma/client'

interface MatchesTableProps {
  matches: any[] // GameSimilarity with relations
}

export function MatchesTable({ matches }: MatchesTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState<string | null>(null)
  const router = useRouter()

  if (matches.length === 0) {
    return (
      <div className="text-center py-12">
        <Gamepad2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900">لا توجد تطابقات معلقة</h3>
        <p className="text-gray-500 mt-2">
          جميع التطابقات تمت مراجعتها أو لا توجد تطابقات جديدة
        </p>
      </div>
    )
  }

  const handleAction = async (
    similarityId: string,
    action: 'accept' | 'reject' | 'postpone',
    conceptId?: string
  ) => {
    setIsProcessing(similarityId)
    try {
      if (action === 'accept') {
        await acceptSimilarity(similarityId, conceptId)
      } else if (action === 'reject') {
        await rejectSimilarity(similarityId)
      } else if (action === 'postpone') {
        await postponeSimilarity(similarityId)
      }
      router.refresh()
    } catch (error) {
      console.error('Action failed:', error)
    } finally {
      setIsProcessing(null)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'bg-green-100 text-green-800'
    if (score >= 0.65) return 'bg-amber-100 text-amber-800'
    return 'bg-red-100 text-red-800'
  }

  return (
    <div className="space-y-4">
      {matches.map((match) => {
        const isExpanded = expandedId === match.id
        const isProcessingMatch = isProcessing === match.id
        const scorePercentage = Math.round(match.overallScore * 100)

        return (
          <div
            key={match.id}
            className="border-2 border-gray-200 rounded-xl overflow-hidden bg-white hover:border-brand/30 transition-all shadow-sm hover:shadow-md"
          >
            {/* Header */}
            <div className="p-5 bg-gradient-to-l from-gray-50 to-white">
              <div className="flex items-start justify-between gap-4 mb-4">
                {/* Score Badge */}
                <div
                  className={`px-4 py-2 rounded-xl font-bold text-lg shadow-sm ${getScoreColor(
                    match.overallScore
                  )}`}
                >
                  {scorePercentage}%
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 shadow-sm"
                    onClick={() => handleAction(match.id, 'accept')}
                    disabled={isProcessingMatch}
                  >
                    {isProcessingMatch ? (
                      'جارٍ...'
                    ) : (
                      <>
                        <Check className="w-4 h-4 ml-1" />
                        قبول
                      </>
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="text-amber-600 border-amber-300 hover:bg-amber-50"
                    onClick={() => handleAction(match.id, 'postpone')}
                    disabled={isProcessingMatch}
                  >
                    <Clock className="w-4 h-4 ml-1" />
                    تأجيل
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-300 hover:bg-red-50"
                    onClick={() => handleAction(match.id, 'reject')}
                    disabled={isProcessingMatch}
                  >
                    <X className="w-4 h-4 ml-1" />
                    رفض
                  </Button>
                </div>
              </div>

              {/* Game Names with Links */}
              <div className="space-y-3">
                {/* Game A */}
                <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-gray-200">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Gamepad2 className="w-4 h-4 text-brand" />
                      <Link
                        href={`/game/${match.gameA.slug}`}
                        target="_blank"
                        className="font-bold text-brand-deepest hover:text-brand hover:underline flex items-center gap-1"
                      >
                        {match.gameA.canonicalName || match.gameA.name}
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                    <div className="text-xs text-gray-500 flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Globe className="w-3 h-3" />
                        {match.gameA.country.name}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {match.gameA.heritageField.name}
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/dashboard/games/edit/${match.gameA.id}`}
                    target="_blank"
                  >
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>

                {/* Separator */}
                <div className="flex items-center justify-center">
                  <div className="flex items-center gap-2 text-gray-400">
                    <div className="h-px w-12 bg-gray-300"></div>
                    <span className="text-2xl">↕</span>
                    <div className="h-px w-12 bg-gray-300"></div>
                  </div>
                </div>

                {/* Game B */}
                <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-gray-200">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Gamepad2 className="w-4 h-4 text-brand" />
                      <Link
                        href={`/game/${match.gameB.slug}`}
                        target="_blank"
                        className="font-bold text-brand-deepest hover:text-brand hover:underline flex items-center gap-1"
                      >
                        {match.gameB.canonicalName || match.gameB.name}
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                    <div className="text-xs text-gray-500 flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Globe className="w-3 h-3" />
                        {match.gameB.country.name}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {match.gameB.heritageField.name}
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/dashboard/games/edit/${match.gameB.id}`}
                    target="_blank"
                  >
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Expand Button */}
              <div className="mt-4 flex justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setExpandedId(isExpanded ? null : match.id)
                  }
                  className="w-full"
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp className="w-4 h-4 ml-1" />
                      إخفاء التفاصيل
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4 ml-1" />
                      عرض التفاصيل
                    </>
                  )}
                </Button>
              </div>
            </div>


            {/* Expanded Details */}
            {isExpanded && (
              <div className="border-t-2 border-gray-200 bg-gradient-to-br from-gray-50 to-white p-6">
                {/* Scores Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {/* Structural Score */}
                  <div className="bg-white p-4 rounded-xl border-2 border-blue-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Gamepad2 className="w-5 h-5 text-blue-600" />
                      </div>
                      <h4 className="font-bold text-gray-900">
                        التشابه البنيوي
                      </h4>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge
                        className={`text-lg px-3 py-1 ${
                          match.structuralScore >= 0.7
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {Math.round((match.structuralScore || 0) * 100)}%
                      </Badge>
                      <span className="text-xs text-gray-500">
                        آليات اللعب والأدوات
                      </span>
                    </div>
                  </div>

                  {/* Semantic Score */}
                  <div className="bg-white p-4 rounded-xl border-2 border-purple-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Users className="w-5 h-5 text-purple-600" />
                      </div>
                      <h4 className="font-bold text-gray-900">
                        التشابه الدلالي
                      </h4>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge
                        className={`text-lg px-3 py-1 ${
                          match.semanticScore >= 0.6
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {Math.round((match.semanticScore || 0) * 100)}%
                      </Badge>
                      <span className="text-xs text-gray-500">
                        الوصف والقواعد
                      </span>
                    </div>
                  </div>

                  {/* Heritage Score */}
                  <div className="bg-white p-4 rounded-xl border-2 border-amber-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                        <Globe className="w-5 h-5 text-amber-600" />
                      </div>
                      <h4 className="font-bold text-gray-900">
                        التشابه التراثي
                      </h4>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge
                        className={`text-lg px-3 py-1 ${
                          match.heritageScore >= 0.6
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {Math.round((match.heritageScore || 0) * 100)}%
                      </Badge>
                      <span className="text-xs text-gray-500">
                        التصنيف والمنطقة
                      </span>
                    </div>
                  </div>
                </div>

                {/* Explanation */}
                {match.explanation && (
                  <div className="bg-white p-4 rounded-xl border-2 border-indigo-200 shadow-sm mb-4">
                    <h4 className="font-bold text-indigo-900 mb-3 flex items-center gap-2">
                      <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-xs">📝</span>
                      </div>
                      الشرح التفصيلي
                    </h4>
                    <p className="text-sm text-gray-700 leading-relaxed bg-indigo-50/50 p-3 rounded-lg">
                      {typeof match.explanation === 'object'
                        ? (match.explanation as any).summary || 'لا يوجد شرح'
                        : match.explanation}
                    </p>
                  </div>
                )}

                {/* Algorithm Info */}
                <div className="bg-gray-100 rounded-lg p-3 text-xs text-gray-600 flex flex-wrap items-center gap-4">
                  <span className="flex items-center gap-1">
                    <span className="font-medium">الخوارزمية:</span>
                    <Badge variant="outline" className="text-xs">
                      {match.algorithm}
                    </Badge>
                  </span>
                  {match.isAiAssisted && (
                    <Badge className="bg-purple-100 text-purple-700 border-purple-200">
                      🤖 مساعدة الذكاء الاصطناعي
                    </Badge>
                  )}
                  <span className="flex items-center gap-1">
                    <span className="font-medium">تم الحساب:</span>
                    <span>{new Date(match.createdAt).toLocaleDateString('ar-SA')}</span>
                  </span>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}