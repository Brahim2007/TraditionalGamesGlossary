'use client'

import React, { useState, useEffect } from 'react'
import {
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  MessageSquare,
  MapPin,
  Loader2,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { Toaster } from '@/components/ui/toaster'

interface PendingGame {
  id: string
  canonicalName: string
  country: {
    name: string
  }
  contributor: {
    name: string
    email: string
    institution?: string
  }
  createdAt: string
  gameType: string
  description: string
  heritageField: {
    name: string
  }
  media?: Array<{
    url: string
    type: string
  }>
}

interface ReviewStats {
  pending: number
  approved: number
  rejected: number
}

export default function ReviewPage() {
  const [selectedGame, setSelectedGame] = useState<string | null>(null)
  const [feedback, setFeedback] = useState('')
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  const [modalAction, setModalAction] = useState<'reject' | 'revision'>('reject')
  const [pendingReviews, setPendingReviews] = useState<PendingGame[]>([])
  const [stats, setStats] = useState<ReviewStats>({ pending: 0, approved: 0, rejected: 0 })
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const router = useRouter()
  const { toast, toasts, dismiss } = useToast()

  // Fetch pending reviews
  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/review')
      const data = await response.json()

      if (data.success) {
        setPendingReviews(data.pendingGames)
        setStats(data.stats)
      } else {
        toast({
          title: 'خطأ',
          description: data.message || 'فشل تحميل البيانات',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء تحميل البيانات',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInHours / 24)

    if (diffInHours < 1) {
      return 'منذ أقل من ساعة'
    } else if (diffInHours < 24) {
      return `منذ ${diffInHours} ${diffInHours === 1 ? 'ساعة' : 'ساعات'}`
    } else if (diffInDays === 1) {
      return 'أمس'
    } else if (diffInDays < 7) {
      return `منذ ${diffInDays} ${diffInDays <= 2 ? 'يومين' : 'أيام'}`
    } else {
      return date.toLocaleDateString('ar-SA')
    }
  }

  const handleApprove = async (gameId: string) => {
    try {
      setActionLoading(true)
      const response = await fetch(`/api/review/${gameId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'approve',
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: 'نجح',
          description: 'تم الموافقة على اللعبة ونشرها بنجاح',
        })
        // Remove from pending list
        setPendingReviews(prev => prev.filter(game => game.id !== gameId))
        setStats(prev => ({ ...prev, pending: prev.pending - 1, approved: prev.approved + 1 }))
      } else {
        toast({
          title: 'خطأ',
          description: data.message || 'فشل الموافقة على اللعبة',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error approving game:', error)
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء الموافقة على اللعبة',
        variant: 'destructive',
      })
    } finally {
      setActionLoading(false)
    }
  }

  const handleRejectOrRevision = async () => {
    if (!feedback.trim()) {
      toast({
        title: 'تنبيه',
        description: 'يرجى إدخال ملاحظات',
        variant: 'destructive',
      })
      return
    }

    if (!selectedGame) return

    try {
      setActionLoading(true)
      const response = await fetch(`/api/review/${selectedGame}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: modalAction === 'reject' ? 'reject' : 'revision',
          notes: feedback,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: 'نجح',
          description: data.message,
        })
        // Remove from pending list
        setPendingReviews(prev => prev.filter(game => game.id !== selectedGame))
        setStats(prev => ({ 
          ...prev, 
          pending: prev.pending - 1, 
          rejected: modalAction === 'reject' ? prev.rejected + 1 : prev.rejected 
        }))
        setShowFeedbackModal(false)
        setFeedback('')
        setSelectedGame(null)
      } else {
        toast({
          title: 'خطأ',
          description: data.message || 'فشل تنفيذ الإجراء',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error performing action:', error)
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء تنفيذ الإجراء',
        variant: 'destructive',
      })
    } finally {
      setActionLoading(false)
    }
  }

  const openFeedbackModal = (gameId: string, action: 'reject' | 'revision') => {
    setSelectedGame(gameId)
    setModalAction(action)
    setShowFeedbackModal(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-brand" />
      </div>
    )
  }

  return (
    <div className="animate-in fade-in duration-500">
      <Toaster toasts={toasts} onDismiss={dismiss} />
      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>
                {modalAction === 'reject' ? 'رفض اللعبة' : 'طلب تعديلات'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="اكتب ملاحظاتك هنا..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="min-h-[120px]"
                disabled={actionLoading}
              />
              <div className="flex justify-end gap-3">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowFeedbackModal(false)
                    setFeedback('')
                  }}
                  disabled={actionLoading}
                >
                  إلغاء
                </Button>
                <Button
                  variant={modalAction === 'reject' ? 'destructive' : 'default'}
                  onClick={handleRejectOrRevision}
                  disabled={actionLoading}
                >
                  {actionLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 ml-1 animate-spin" />
                      جاري المعالجة...
                    </>
                  ) : (
                    modalAction === 'reject' ? 'رفض' : 'إرسال'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-l from-amber/10 to-white rounded-2xl p-8 border-2 border-amber/20 shadow-lg mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                <CheckCircle2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-4xl font-bold text-brand-deepest">
                  قائمة المراجعة
                </h2>
                <p className="text-gray-600 mt-1">
                  لديك <span className="font-bold text-amber-600">{pendingReviews.length} {pendingReviews.length === 1 ? 'لعبة' : 'ألعاب'}</span>{' '}
                  بانتظار المراجعة والموافقة
                </p>
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <div className="text-right">
              <p className="text-sm text-gray-500">نظام المراجعة</p>
              <p className="text-xs text-gray-400">سريع ودقيق</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">✓</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="border-2 border-amber-200 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
              <Clock className="h-7 w-7 text-white" />
            </div>
            <div>
              <p className="text-4xl font-bold text-amber-600">
                {stats.pending}
              </p>
              <p className="text-sm text-gray-600 font-medium">بانتظار المراجعة</p>
              <p className="text-xs text-gray-500 mt-0.5">يحتاج إلى اهتمام</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-2 border-emerald-200 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <CheckCircle2 className="h-7 w-7 text-white" />
            </div>
            <div>
              <p className="text-4xl font-bold text-emerald-600">{stats.approved}</p>
              <p className="text-sm text-gray-600 font-medium">تمت الموافقة</p>
              <p className="text-xs text-gray-500 mt-0.5">هذا الأسبوع</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-2 border-red-200 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="w-14 h-14 bg-gradient-to-br from-red-400 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
              <XCircle className="h-7 w-7 text-white" />
            </div>
            <div>
              <p className="text-4xl font-bold text-red-600">{stats.rejected}</p>
              <p className="text-sm text-gray-600 font-medium">مرفوضة</p>
              <p className="text-xs text-gray-500 mt-0.5">هذا الأسبوع</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Reviews List */}
      <div className="space-y-4">
        {pendingReviews.map((game) => (
          <Card key={game.id} className="border-2 border-gray-200 shadow-lg hover:shadow-xl hover:border-brand/30 transition-all">
            <CardContent className="p-6">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                {/* Game Info */}
                <div className="flex-1">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                      <Clock className="h-5 w-5 text-amber-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-brand-deepest">
                      {game.canonicalName}
                    </h3>
                    <Badge className="bg-amber-100 text-amber-800 border-amber-200 font-medium">{game.gameType}</Badge>
                  </div>
                  <div className="mb-4 flex flex-wrap items-center gap-3 text-sm">
                    <span className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full">
                      <MapPin className="h-3 w-3" /> {game.country.name}
                    </span>
                    <span className="flex items-center gap-1.5 bg-purple-50 text-purple-700 px-3 py-1.5 rounded-full">
                      <Eye className="h-3 w-3" /> {game.contributor.name}
                      {game.contributor.institution && ` - ${game.contributor.institution}`}
                    </span>
                    <span className="flex items-center gap-1.5 bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full">
                      <Clock className="h-3 w-3" /> {getTimeAgo(game.createdAt)}
                    </span>
                  </div>
                  <div className="mb-3">
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {game.heritageField.name}
                    </span>
                  </div>
                  <p className="leading-relaxed text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-200">
                    {game.description}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 lg:flex-col lg:min-w-[140px]">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 lg:flex-none border-brand/40 text-brand hover:bg-brand/10"
                    onClick={() => router.push(`/games/${game.id}`)}
                  >
                    <Eye className="h-4 w-4 ml-1" /> معاينة
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 lg:flex-none bg-green-600 hover:bg-green-700 shadow-sm"
                    onClick={() => handleApprove(game.id)}
                    disabled={actionLoading}
                  >
                    {actionLoading ? (
                      <Loader2 className="h-4 w-4 ml-1 animate-spin" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 ml-1" />
                    )}
                    موافقة
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 text-amber-600 border-amber-300 hover:bg-amber-50 lg:flex-none"
                    onClick={() => openFeedbackModal(game.id, 'revision')}
                    disabled={actionLoading}
                  >
                    <MessageSquare className="h-4 w-4 ml-1" /> طلب تعديل
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 text-red-600 border-red-300 hover:bg-red-50 lg:flex-none"
                    onClick={() => openFeedbackModal(game.id, 'reject')}
                    disabled={actionLoading}
                  >
                    <XCircle className="h-4 w-4 ml-1" /> رفض
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {pendingReviews.length === 0 && (
        <Card className="py-16 text-center">
          <CardContent>
            <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-emerald-500" />
            <h3 className="mb-2 text-xl font-bold text-brand-deepest">
              لا توجد ألعاب بانتظار المراجعة
            </h3>
            <p className="text-gray-500">
              جميع الألعاب المقدمة تمت مراجعتها. عمل رائع!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
