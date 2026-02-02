'use client'

import React, { useState } from 'react'
import {
  X,
  Send,
  Sparkles,
  User,
  Mail,
  MapPin,
  FileText,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'
import { submitGameSuggestion } from '@/lib/actions/suggestion'

interface SuggestGameModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SuggestGameModal({ isOpen, onClose }: SuggestGameModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const [formData, setFormData] = useState({
    gameName: '',
    description: '',
    country: '',
    submitterName: '',
    submitterEmail: '',
    additionalInfo: '',
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error message when user starts typing
    if (submitStatus === 'error') {
      setSubmitStatus('idle')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    try {
      const result = await submitGameSuggestion(formData)

      if (result.success) {
        setSubmitStatus('success')
        // Reset form after 2 seconds
        setTimeout(() => {
          setFormData({
            gameName: '',
            description: '',
            country: '',
            submitterName: '',
            submitterEmail: '',
            additionalInfo: '',
          })
          setSubmitStatus('idle')
          onClose()
        }, 2000)
      } else {
        setSubmitStatus('error')
        setErrorMessage(result.message)
      }
    } catch (error) {
      setSubmitStatus('error')
      setErrorMessage('حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-gradient-to-br from-brand-deepest to-brand px-8 py-6 text-white">
            <button
              onClick={onClose}
              className="absolute left-4 top-4 rounded-lg p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/20 backdrop-blur-sm">
                <Sparkles className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h2 className="text-2xl font-black">اقترح لعبة تراثية</h2>
                <p className="text-sm text-white/80">ساعدنا في توثيق التراث العربي</p>
              </div>
            </div>
          </div>

          {/* Success Message */}
          {submitStatus === 'success' && (
            <div className="m-6 flex items-center gap-3 rounded-2xl border-2 border-green-200 bg-green-50 p-4">
              <CheckCircle2 className="h-6 w-6 flex-shrink-0 text-green-600" />
              <div>
                <p className="font-bold text-green-900">تم إرسال اقتراحك بنجاح!</p>
                <p className="text-sm text-green-700">سنقوم بمراجعته وإضافته قريباً</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {submitStatus === 'error' && (
            <div className="m-6 flex items-center gap-3 rounded-2xl border-2 border-red-200 bg-red-50 p-4">
              <AlertCircle className="h-6 w-6 flex-shrink-0 text-red-600" />
              <div>
                <p className="font-bold text-red-900">حدث خطأ</p>
                <p className="text-sm text-red-700">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6 p-8">
            {/* Game Name */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-700">
                <FileText className="h-4 w-4 text-brand" />
                اسم اللعبة <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.gameName}
                onChange={(e) => handleInputChange('gameName', e.target.value)}
                placeholder="مثال: الغميضة، الطماطم، الصقلة..."
                required
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-right transition-all focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              />
            </div>

            {/* Description */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-700">
                <FileText className="h-4 w-4 text-brand" />
                وصف اللعبة وطريقة اللعب <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="اشرح كيف تُلعب هذه اللعبة... القواعد، الأدوات، عدد اللاعبين..."
                required
                rows={5}
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-right transition-all focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              />
              <p className="mt-1 text-xs text-gray-500">الحد الأدنى: 10 أحرف</p>
            </div>

            {/* Country/Region */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-700">
                <MapPin className="h-4 w-4 text-brand" />
                الدولة أو المنطقة
              </label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                placeholder="مثال: السعودية، الخليج، العراق..."
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-right transition-all focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              />
            </div>

            {/* Additional Info */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-700">
                <FileText className="h-4 w-4 text-brand" />
                معلومات إضافية
              </label>
              <textarea
                value={formData.additionalInfo}
                onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                placeholder="أي معلومات إضافية: الأسماء البديلة، المصادر، الفئة العمرية..."
                rows={3}
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-right transition-all focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              />
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-4 text-sm font-medium text-gray-500">
                  معلوماتك الشخصية
                </span>
              </div>
            </div>

            {/* Submitter Name */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-700">
                <User className="h-4 w-4 text-brand" />
                اسمك <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.submitterName}
                onChange={(e) => handleInputChange('submitterName', e.target.value)}
                placeholder="الاسم الكامل أو اسم مستعار"
                required
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-right transition-all focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              />
            </div>

            {/* Submitter Email */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-700">
                <Mail className="h-4 w-4 text-brand" />
                بريدك الإلكتروني <span className="text-gray-400">(اختياري)</span>
              </label>
              <input
                type="email"
                value={formData.submitterEmail}
                onChange={(e) => handleInputChange('submitterEmail', e.target.value)}
                placeholder="للتواصل معك في حال الحاجة"
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-left transition-all focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              />
            </div>

            {/* Info Note */}
            <div className="rounded-xl bg-blue-50 p-4">
              <p className="text-sm text-blue-900">
                <strong>ملاحظة:</strong> سيتم مراجعة اقتراحك من قبل فريقنا قبل إضافته للمنصة.
                شكراً لمساهمتك في حفظ التراث! 🎉
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={isSubmitting || submitStatus === 'success'}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand px-6 py-4 font-bold text-white shadow-lg transition-all hover:bg-brand-deepest disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    جاري الإرسال...
                  </>
                ) : submitStatus === 'success' ? (
                  <>
                    <CheckCircle2 className="h-5 w-5" />
                    تم الإرسال
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    إرسال الاقتراح
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="rounded-xl border-2 border-gray-200 px-6 py-4 font-bold text-gray-700 transition-all hover:bg-gray-50 disabled:opacity-50"
              >
                إلغاء
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
