'use client'

import React, { useState } from 'react'
import {
  Clock,
  CheckCircle2,
  XCircle,
  Trash2,
  Eye,
  Calendar,
  User,
  Mail,
  MapPin,
  FileText,
  Sparkles,
  Filter,
  AlertCircle,
  Loader2,
} from 'lucide-react'
import {
  reviewSuggestion,
  deleteSuggestion,
} from '@/lib/actions/suggestion'
import { formatDistanceToNow } from 'date-fns'
import { ar } from 'date-fns/locale'

interface Suggestion {
  id: string
  gameName: string
  description: string
  country: string | null
  submitterName: string
  submitterEmail: string | null
  additionalInfo: string | null
  status: string
  reviewNotes: string | null
  reviewedBy: { name: string; email: string } | null
  reviewedAt: Date | null
  createdAt: Date
}

interface Stats {
  total: number
  pending: number
  approved: number
  rejected: number
  converted: number
}

interface SuggestionsClientProps {
  suggestions: Suggestion[]
  stats: Stats
  userRole: string
}

export function SuggestionsClient({
  suggestions: initialSuggestions,
  stats: initialStats,
  userRole,
}: SuggestionsClientProps) {
  const [suggestions, setSuggestions] = useState(initialSuggestions)
  const [stats, setStats] = useState(initialStats)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [reviewNotes, setReviewNotes] = useState('')

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 5000)
  }

  const filteredSuggestions = suggestions.filter((s) =>
    filterStatus === 'all' ? true : s.status === filterStatus
  )

  const handleReview = async (id: string, status: 'approved' | 'rejected' | 'converted') => {
    setIsLoading(true)
    try {
      const result = await reviewSuggestion(id, status, reviewNotes)

      if (result.success) {
        // Update local state
        setSuggestions(
          suggestions.map((s) =>
            s.id === id ? { ...s, status, reviewNotes, reviewedAt: new Date() } : s
          )
        )

        // Update stats
        setStats((prev) => ({
          ...prev,
          pending: prev.pending - 1,
          [status]: prev[status] + 1,
        }))

        showMessage('success', result.message)
        setSelectedSuggestion(null)
        setReviewNotes('')
      } else {
        showMessage('error', result.message)
      }
    } catch (error) {
      showMessage('error', 'حدث خطأ أثناء المراجعة')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string, gameName: string) => {
    if (!confirm(`هل أنت متأكد من حذف مقترح "${gameName}"؟`)) return

    setIsLoading(true)
    try {
      const result = await deleteSuggestion(id)

      if (result.success) {
        setSuggestions(suggestions.filter((s) => s.id !== id))
        setStats((prev) => ({ ...prev, total: prev.total - 1 }))
        showMessage('success', result.message)
        setSelectedSuggestion(null)
      } else {
        showMessage('error', result.message)
      }
    } catch (error) {
      showMessage('error', 'حدث خطأ أثناء الحذف')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      approved: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200',
      converted: 'bg-blue-100 text-blue-800 border-blue-200',
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const getStatusIcon = (status: string) => {
    const icons = {
      pending: Clock,
      approved: CheckCircle2,
      rejected: XCircle,
      converted: Sparkles,
    }
    return icons[status as keyof typeof icons] || Clock
  }

  const getStatusLabel = (status: string) => {
    const labels = {
      pending: 'قيد المراجعة',
      approved: 'موافق عليه',
      rejected: 'مرفوض',
      converted: 'تم تحويله إلى لعبة',
    }
    return labels[status as keyof typeof labels] || status
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-brand-deepest">مقترحات الألعاب</h1>
          <p className="mt-2 text-gray-600">مراجعة مقترحات الألعاب من المستخدمين</p>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-6 flex items-center gap-3 rounded-xl border-2 p-4 ${
              message.type === 'success'
                ? 'border-green-200 bg-green-50 text-green-800'
                : 'border-red-200 bg-red-50 text-red-800'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
            <p className="font-medium">{message.text}</p>
          </div>
        )}

        {/* Stats */}
        <div className="mb-8 grid gap-4 md:grid-cols-5">
          <div className="rounded-xl bg-white border-2 border-gray-100 p-6 shadow-sm">
            <div className="text-3xl font-bold text-brand-deepest">{stats.total}</div>
            <div className="text-sm text-gray-600">إجمالي المقترحات</div>
          </div>
          <div className="rounded-xl bg-yellow-50 border-2 border-yellow-100 p-6">
            <div className="text-3xl font-bold text-yellow-800">{stats.pending}</div>
            <div className="text-sm text-yellow-700">قيد المراجعة</div>
          </div>
          <div className="rounded-xl bg-green-50 border-2 border-green-100 p-6">
            <div className="text-3xl font-bold text-green-800">{stats.approved}</div>
            <div className="text-sm text-green-700">موافق عليها</div>
          </div>
          <div className="rounded-xl bg-red-50 border-2 border-red-100 p-6">
            <div className="text-3xl font-bold text-red-800">{stats.rejected}</div>
            <div className="text-sm text-red-700">مرفوضة</div>
          </div>
          <div className="rounded-xl bg-blue-50 border-2 border-blue-100 p-6">
            <div className="text-3xl font-bold text-blue-800">{stats.converted}</div>
            <div className="text-sm text-blue-700">تم تحويلها</div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex items-center gap-3">
          <Filter className="h-5 w-5 text-gray-500" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-lg border-2 border-gray-200 px-4 py-2 font-medium transition-colors focus:border-brand focus:outline-none"
          >
            <option value="all">جميع الحالات ({stats.total})</option>
            <option value="pending">قيد المراجعة ({stats.pending})</option>
            <option value="approved">موافق عليها ({stats.approved})</option>
            <option value="rejected">مرفوضة ({stats.rejected})</option>
            <option value="converted">تم تحويلها ({stats.converted})</option>
          </select>
        </div>

        {/* Suggestions List */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredSuggestions.map((suggestion) => {
            const StatusIcon = getStatusIcon(suggestion.status)

            return (
              <div
                key={suggestion.id}
                className="group rounded-2xl border-2 border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md"
              >
                {/* Status Badge */}
                <div className="mb-4 flex items-center justify-between">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full border-2 px-3 py-1 text-xs font-bold ${getStatusColor(
                      suggestion.status
                    )}`}
                  >
                    <StatusIcon className="h-3 w-3" />
                    {getStatusLabel(suggestion.status)}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(suggestion.createdAt), {
                      addSuffix: true,
                      locale: ar,
                    })}
                  </span>
                </div>

                {/* Game Name */}
                <h3 className="mb-2 text-xl font-bold text-brand-deepest line-clamp-1">
                  {suggestion.gameName}
                </h3>

                {/* Description */}
                <p className="mb-4 text-sm text-gray-600 line-clamp-3">
                  {suggestion.description}
                </p>

                {/* Metadata */}
                <div className="mb-4 space-y-2">
                  {suggestion.country && (
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <MapPin className="h-3 w-3" />
                      {suggestion.country}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <User className="h-3 w-3" />
                    {suggestion.submitterName}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedSuggestion(suggestion)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-brand/10 px-4 py-2 text-sm font-bold text-brand transition-colors hover:bg-brand/20"
                  >
                    <Eye className="h-4 w-4" />
                    عرض
                  </button>
                  {userRole === 'admin' && suggestion.status !== 'converted' && (
                    <button
                      onClick={() => handleDelete(suggestion.id, suggestion.gameName)}
                      disabled={isLoading}
                      className="rounded-lg bg-red-50 px-3 py-2 text-sm font-bold text-red-700 transition-colors hover:bg-red-100 disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Empty State */}
        {filteredSuggestions.length === 0 && (
          <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-white py-20 text-center">
            <FileText className="mx-auto mb-4 h-16 w-16 text-gray-300" />
            <h3 className="mb-2 text-xl font-bold text-gray-700">لا توجد مقترحات</h3>
            <p className="text-gray-500">
              {filterStatus === 'all'
                ? 'لم يتم إرسال أي مقترحات بعد'
                : `لا توجد مقترحات بحالة "${getStatusLabel(filterStatus)}"`}
            </p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedSuggestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-gradient-to-br from-brand-deepest to-brand px-8 py-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{selectedSuggestion.gameName}</h2>
                  <p className="text-sm text-white/80">
                    {formatDistanceToNow(new Date(selectedSuggestion.createdAt), {
                      addSuffix: true,
                      locale: ar,
                    })}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedSuggestion(null)}
                  className="rounded-lg p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 space-y-6">
              {/* Status */}
              <div>
                <label className="text-sm font-bold text-gray-500">الحالة</label>
                <div className="mt-2">
                  <span
                    className={`inline-flex items-center gap-2 rounded-full border-2 px-4 py-2 text-sm font-bold ${getStatusColor(
                      selectedSuggestion.status
                    )}`}
                  >
                    {React.createElement(getStatusIcon(selectedSuggestion.status), {
                      className: 'h-4 w-4',
                    })}
                    {getStatusLabel(selectedSuggestion.status)}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-bold text-gray-500">وصف اللعبة</label>
                <p className="mt-2 whitespace-pre-wrap rounded-xl bg-gray-50 p-4 text-gray-700">
                  {selectedSuggestion.description}
                </p>
              </div>

              {/* Country */}
              {selectedSuggestion.country && (
                <div>
                  <label className="text-sm font-bold text-gray-500">الدولة/المنطقة</label>
                  <p className="mt-2 text-gray-700">{selectedSuggestion.country}</p>
                </div>
              )}

              {/* Additional Info */}
              {selectedSuggestion.additionalInfo && (
                <div>
                  <label className="text-sm font-bold text-gray-500">معلومات إضافية</label>
                  <p className="mt-2 whitespace-pre-wrap rounded-xl bg-gray-50 p-4 text-gray-700">
                    {selectedSuggestion.additionalInfo}
                  </p>
                </div>
              )}

              {/* Submitter Info */}
              <div className="rounded-xl bg-blue-50 p-4">
                <label className="text-sm font-bold text-blue-900">معلومات المقترح</label>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-blue-700">
                    <User className="h-4 w-4" />
                    {selectedSuggestion.submitterName}
                  </div>
                  {selectedSuggestion.submitterEmail && (
                    <div className="flex items-center gap-2 text-sm text-blue-700">
                      <Mail className="h-4 w-4" />
                      {selectedSuggestion.submitterEmail}
                    </div>
                  )}
                </div>
              </div>

              {/* Review Section (for pending suggestions) */}
              {selectedSuggestion.status === 'pending' && (
                <div className="border-t-2 border-gray-100 pt-6">
                  <label className="text-sm font-bold text-gray-700">ملاحظات المراجعة</label>
                  <textarea
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    placeholder="أضف ملاحظات (اختياري)..."
                    rows={3}
                    className="mt-2 w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-right transition-all focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                  />

                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => handleReview(selectedSuggestion.id, 'approved')}
                      disabled={isLoading}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-bold text-white transition-all hover:bg-green-700 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <>
                          <CheckCircle2 className="h-5 w-5" />
                          موافقة
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleReview(selectedSuggestion.id, 'rejected')}
                      disabled={isLoading}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 font-bold text-white transition-all hover:bg-red-700 disabled:opacity-50"
                    >
                      <XCircle className="h-5 w-5" />
                      رفض
                    </button>
                    <button
                      onClick={() => handleReview(selectedSuggestion.id, 'converted')}
                      disabled={isLoading}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white transition-all hover:bg-blue-700 disabled:opacity-50"
                    >
                      <Sparkles className="h-5 w-5" />
                      تحويل
                    </button>
                  </div>
                </div>
              )}

              {/* Review Info (for reviewed suggestions) */}
              {selectedSuggestion.reviewedBy && (
                <div className="rounded-xl bg-gray-50 p-4">
                  <label className="text-sm font-bold text-gray-700">معلومات المراجعة</label>
                  <div className="mt-2 space-y-2">
                    <div className="text-sm text-gray-600">
                      <strong>المراجع:</strong> {selectedSuggestion.reviewedBy.name}
                    </div>
                    {selectedSuggestion.reviewNotes && (
                      <div className="text-sm text-gray-600">
                        <strong>الملاحظات:</strong> {selectedSuggestion.reviewNotes}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
