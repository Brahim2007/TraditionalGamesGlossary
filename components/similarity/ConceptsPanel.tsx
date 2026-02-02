'use client'

// Concepts Panel Component
// مكون لوحة المفاهيم

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createGameConcept } from '@/lib/actions/similarity'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Plus,
  BookOpen,
  Users,
  Globe,
  ChevronRight,
  Loader2,
  Check,
} from 'lucide-react'

interface ConceptsPanelProps {
  concepts: any[] // GameConcept with relations
}

export function ConceptsPanel({ concepts }: ConceptsPanelProps) {
  const [isCreating, setIsCreating] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  })
  const router = useRouter()

  const handleCreateConcept = async () => {
    if (!formData.name.trim()) return

    setIsCreating(true)
    try {
      await createGameConcept(formData.name, formData.description)
      setFormData({ name: '', description: '' })
      setShowForm(false)
      router.refresh()
    } catch (error) {
      console.error('Failed to create concept:', error)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Card className="border-2 border-brand/20 shadow-lg">
      <CardHeader className="bg-gradient-to-l from-brand/5 to-white">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-brand-deepest">
            <div className="w-10 h-10 bg-brand rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span>المفاهيم الثقافية</span>
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowForm(!showForm)}
            className="border-brand/40 text-brand hover:bg-brand hover:text-white"
          >
            <Plus className="w-4 h-4 ml-1" />
            جديد
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Create Form */}
        {showForm && (
          <div className="bg-gradient-to-br from-brand/5 to-white p-5 rounded-xl border-2 border-brand/30 shadow-sm">
            <h4 className="font-bold text-brand-deepest mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5" />
              إنشاء مفهوم جديد
            </h4>
            <div className="space-y-3">
              <Input
                placeholder="اسم المفهوم (مثال: ألعاب الحجارة)"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                disabled={isCreating}
                className="border-brand/30 focus:border-brand"
              />
              <Textarea
                placeholder="وصف المفهوم (اختياري)"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                disabled={isCreating}
                rows={3}
                className="border-brand/30 focus:border-brand"
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleCreateConcept}
                  disabled={isCreating || !formData.name.trim()}
                  className="flex-1 bg-brand hover:bg-brand-deep"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="w-4 h-4 ml-1 animate-spin" />
                      جارٍ الإنشاء...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 ml-1" />
                      إنشاء
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowForm(false)
                    setFormData({ name: '', description: '' })
                  }}
                  disabled={isCreating}
                  className="border-gray-300"
                >
                  إلغاء
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Concepts List */}
        <div className="space-y-3">
          {concepts.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p>لا توجد مفاهيم بعد</p>
              <p className="text-sm mt-1">أنشئ مفهومًا لربط الألعاب المتشابهة</p>
            </div>
          ) : (
            concepts.map((concept) => (
              <div
                key={concept.id}
                className="border-2 border-gray-200 rounded-xl p-4 hover:border-brand/50 hover:bg-brand/5 cursor-pointer transition-all shadow-sm hover:shadow-md group"
                onClick={() => router.push(`/dashboard/concepts/${concept.id}`)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-brand/10 rounded-lg flex items-center justify-center group-hover:bg-brand/20 transition-colors">
                        <BookOpen className="w-4 h-4 text-brand" />
                      </div>
                      <h4 className="font-bold text-gray-900 group-hover:text-brand transition-colors">
                        {concept.name}
                      </h4>
                    </div>
                    {concept.description && (
                      <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed pr-10">
                        {concept.description}
                      </p>
                    )}
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-brand group-hover:translate-x-1 transition-all flex-shrink-0" />
                </div>

                <div className="flex items-center gap-4 text-xs text-gray-500 pt-3 border-t border-gray-200">
                  <span className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                    <Users className="w-3 h-3" />
                    <span className="font-medium">{concept.games?.length || 0}</span>
                    <span>لعبة</span>
                  </span>
                  {concept.createdBy && (
                    <span className="flex items-center gap-1.5 bg-green-50 text-green-700 px-2 py-1 rounded-full">
                      <Globe className="w-3 h-3" />
                      <span className="font-medium">{concept.createdBy.name}</span>
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Info */}
        <div className="bg-brand/5 rounded-lg p-4 border border-brand/20">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-brand/20 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-sm">💡</span>
            </div>
            <div className="text-xs text-gray-700 leading-relaxed">
              <p className="font-medium text-brand-deepest mb-1">
                ما هي المفاهيم الثقافية؟
              </p>
              <p>
                تجمع الألعاب المتشابهة من مناطق مختلفة تحت مفهوم ثقافي واحد،
                مما يساعد في فهم التنوعات الإقليمية للعبة واحدة.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}