'use client'

import React, { useState } from 'react'
import {
  Activity,
  Brain,
  Award,
  Anchor,
  ScrollText,
  Smile,
  LayoutGrid,
  Users,
  Heart,
  Trophy,
  Target,
  Sparkles,
  Star,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  GripVertical,
  Save,
  X,
  AlertCircle,
  CheckCircle,
} from 'lucide-react'
import {
  createCategory,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus,
  reorderCategories,
} from '@/lib/actions/category'

// Available icons
const availableIcons = [
  { name: 'LayoutGrid', component: LayoutGrid },
  { name: 'Activity', component: Activity },
  { name: 'Brain', component: Brain },
  { name: 'Award', component: Award },
  { name: 'Anchor', component: Anchor },
  { name: 'ScrollText', component: ScrollText },
  { name: 'Smile', component: Smile },
  { name: 'Users', component: Users },
  { name: 'Heart', component: Heart },
  { name: 'Trophy', component: Trophy },
  { name: 'Target', component: Target },
  { name: 'Sparkles', component: Sparkles },
  { name: 'Star', component: Star },
]

interface Category {
  id: string
  name: string
  slug: string
  description?: string | null
  icon: string
  order: number
  isActive: boolean
  color?: string | null
}

interface CategoriesClientProps {
  categories: Category[]
  userRole: string
}

export function CategoriesClient({ categories: initialCategories, userRole }: CategoriesClientProps) {
  const [categories, setCategories] = useState(initialCategories)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    icon: 'LayoutGrid',
    color: '#3B7C5F',
    isActive: true,
  })

  // Show message for 5 seconds
  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 5000)
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      icon: 'LayoutGrid',
      color: '#3B7C5F',
      isActive: true,
    })
    setEditingCategory(null)
    setIsAddModalOpen(false)
  }

  // Auto-generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\u0600-\u06FFa-z0-9\s-]/g, '') // Keep Arabic, English, numbers, spaces, hyphens
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
      .replace(/[\u0600-\u06FF]/g, (match) => {
        // Transliterate common Arabic words
        const map: Record<string, string> = {
          'ا': 'a',
          'ب': 'b',
          'ت': 't',
          'ث': 'th',
          'ج': 'j',
          'ح': 'h',
          'خ': 'kh',
          'د': 'd',
          'ذ': 'dh',
          'ر': 'r',
          'ز': 'z',
          'س': 's',
          'ش': 'sh',
          'ص': 's',
          'ض': 'd',
          'ط': 't',
          'ظ': 'z',
          'ع': 'a',
          'غ': 'gh',
          'ف': 'f',
          'ق': 'q',
          'ك': 'k',
          'ل': 'l',
          'م': 'm',
          'ن': 'n',
          'ه': 'h',
          'و': 'w',
          'ي': 'y',
        }
        return map[match] || ''
      })
  }

  // Handle form input change
  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value }
      // Auto-generate slug when name changes
      if (field === 'name' && !editingCategory) {
        updated.slug = generateSlug(value)
      }
      return updated
    })
  }

  // Handle create category
  const handleCreate = async () => {
    setIsLoading(true)
    try {
      const result = await createCategory({
        ...formData,
        order: categories.length,
      })

      if (result.success && result.category) {
        setCategories([...categories, result.category])
        showMessage('success', result.message)
        resetForm()
      } else {
        showMessage('error', result.message)
      }
    } catch (error) {
      showMessage('error', 'حدث خطأ أثناء إضافة التصنيف')
    }
    setIsLoading(false)
  }

  // Handle update category
  const handleUpdate = async () => {
    if (!editingCategory) return

    setIsLoading(true)
    try {
      const result = await updateCategory(editingCategory.id, formData)

      if (result.success && result.category) {
        setCategories(categories.map((cat) => (cat.id === editingCategory.id ? result.category! : cat)))
        showMessage('success', result.message)
        resetForm()
      } else {
        showMessage('error', result.message)
      }
    } catch (error) {
      showMessage('error', 'حدث خطأ أثناء تحديث التصنيف')
    }
    setIsLoading(false)
  }

  // Handle delete category
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`هل أنت متأكد من حذف التصنيف "${name}"؟`)) return

    setIsLoading(true)
    try {
      const result = await deleteCategory(id)

      if (result.success) {
        setCategories(categories.filter((cat) => cat.id !== id))
        showMessage('success', result.message)
      } else {
        showMessage('error', result.message)
      }
    } catch (error) {
      showMessage('error', 'حدث خطأ أثناء حذف التصنيف')
    }
    setIsLoading(false)
  }

  // Handle toggle status
  const handleToggleStatus = async (id: string) => {
    setIsLoading(true)
    try {
      const result = await toggleCategoryStatus(id)

      if (result.success && result.category) {
        setCategories(categories.map((cat) => (cat.id === id ? result.category! : cat)))
        showMessage('success', result.message)
      } else {
        showMessage('error', result.message)
      }
    } catch (error) {
      showMessage('error', 'حدث خطأ أثناء تغيير حالة التصنيف')
    }
    setIsLoading(false)
  }

  // Handle edit button click
  const handleEditClick = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      icon: category.icon,
      color: category.color || '#3B7C5F',
      isActive: category.isActive,
    })
    setIsAddModalOpen(true)
  }

  const IconComponent = availableIcons.find((icon) => icon.name === formData.icon)?.component || LayoutGrid

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-brand-deepest">إدارة التصنيفات</h1>
            <p className="mt-2 text-gray-600">
              إدارة تصنيفات الألعاب التي تظهر في الصفحة الرئيسية
            </p>
          </div>
          <button
            onClick={() => {
              resetForm()
              setIsAddModalOpen(true)
            }}
            className="flex items-center gap-2 rounded-xl bg-brand px-6 py-3 font-bold text-white shadow-lg transition-all hover:bg-brand-deepest hover:scale-105"
          >
            <Plus className="h-5 w-5" />
            إضافة تصنيف جديد
          </button>
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
              <CheckCircle className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
            <p className="font-medium">{message.text}</p>
          </div>
        )}

        {/* Categories Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories
            .sort((a, b) => a.order - b.order)
            .map((category) => {
              const Icon = availableIcons.find((icon) => icon.name === category.icon)?.component || LayoutGrid

              return (
                <div
                  key={category.id}
                  className={`group relative rounded-2xl border-2 bg-white p-6 shadow-sm transition-all hover:shadow-md ${
                    category.isActive ? 'border-gray-200' : 'border-gray-300 bg-gray-50 opacity-60'
                  }`}
                >
                  {/* Drag Handle */}
                  <div className="absolute right-2 top-2 cursor-move text-gray-400 opacity-0 transition-opacity group-hover:opacity-100">
                    <GripVertical className="h-5 w-5" />
                  </div>

                  {/* Category Icon */}
                  <div
                    className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl"
                    style={{ backgroundColor: `${category.color || '#3B7C5F'}20` }}
                  >
                    <Icon className="h-8 w-8" style={{ color: category.color || '#3B7C5F' }} />
                  </div>

                  {/* Category Info */}
                  <h3 className="mb-2 text-xl font-bold text-brand-deepest">{category.name}</h3>
                  <p className="mb-1 text-sm text-gray-500">الرابط: {category.slug}</p>
                  {category.description && (
                    <p className="mb-4 text-sm text-gray-600 line-clamp-2">{category.description}</p>
                  )}

                  {/* Status Badge */}
                  <div className="mb-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${
                        category.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {category.isActive ? (
                        <>
                          <Eye className="h-3 w-3" /> نشط
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-3 w-3" /> مخفي
                        </>
                      )}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditClick(category)}
                      disabled={isLoading}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700 transition-colors hover:bg-blue-100 disabled:opacity-50"
                    >
                      <Edit className="h-4 w-4" />
                      تعديل
                    </button>
                    <button
                      onClick={() => handleToggleStatus(category.id)}
                      disabled={isLoading}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-amber-50 px-4 py-2 text-sm font-bold text-amber-700 transition-colors hover:bg-amber-100 disabled:opacity-50"
                    >
                      {category.isActive ? (
                        <>
                          <EyeOff className="h-4 w-4" />
                          إخفاء
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4" />
                          تفعيل
                        </>
                      )}
                    </button>
                    {userRole === 'admin' && (
                      <button
                        onClick={() => handleDelete(category.id, category.name)}
                        disabled={isLoading}
                        className="flex items-center justify-center rounded-lg bg-red-50 px-3 py-2 text-sm font-bold text-red-700 transition-colors hover:bg-red-100 disabled:opacity-50"
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
        {categories.length === 0 && (
          <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-white py-20 text-center">
            <LayoutGrid className="mx-auto mb-4 h-16 w-16 text-gray-300" />
            <h3 className="mb-2 text-xl font-bold text-gray-700">لا توجد تصنيفات</h3>
            <p className="mb-6 text-gray-500">ابدأ بإضافة تصنيف جديد</p>
            <button
              onClick={() => {
                resetForm()
                setIsAddModalOpen(true)
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3 font-bold text-white transition-all hover:bg-brand-deepest"
            >
              <Plus className="h-5 w-5" />
              إضافة تصنيف جديد
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-8 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-brand-deepest">
                {editingCategory ? 'تعديل التصنيف' : 'إضافة تصنيف جديد'}
              </h2>
              <button
                onClick={resetForm}
                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  اسم التصنيف <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="مثال: ألعاب حركية"
                  className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-right transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  الرابط (Slug) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  placeholder="مثال: physical-games"
                  className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 font-mono text-left transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                />
                <p className="mt-1 text-xs text-gray-500">حروف إنجليزية صغيرة وأرقام وشرطات فقط</p>
              </div>

              {/* Description */}
              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">الوصف</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="وصف مختصر للتصنيف"
                  rows={3}
                  className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-right transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                />
              </div>

              {/* Icon Selection */}
              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  الأيقونة <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-7 gap-2">
                  {availableIcons.map((icon) => {
                    const Icon = icon.component
                    const isSelected = formData.icon === icon.name
                    return (
                      <button
                        key={icon.name}
                        type="button"
                        onClick={() => handleInputChange('icon', icon.name)}
                        className={`flex h-14 items-center justify-center rounded-lg border-2 transition-all ${
                          isSelected
                            ? 'border-brand bg-brand text-white shadow-lg'
                            : 'border-gray-200 bg-white text-gray-400 hover:border-brand/40 hover:text-brand'
                        }`}
                      >
                        <Icon className="h-6 w-6" />
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Color */}
              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">اللون</label>
                <div className="flex items-center gap-4">
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => handleInputChange('color', e.target.value)}
                    className="h-12 w-20 cursor-pointer rounded-lg border-2 border-gray-200"
                  />
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-lg"
                      style={{ backgroundColor: `${formData.color}20` }}
                    >
                      <IconComponent className="h-6 w-6" style={{ color: formData.color }} />
                    </div>
                    <span className="font-mono text-sm text-gray-600">{formData.color}</span>
                  </div>
                </div>
              </div>

              {/* Active Status */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => handleInputChange('isActive', e.target.checked)}
                  className="h-5 w-5 cursor-pointer rounded border-gray-300 text-brand focus:ring-2 focus:ring-brand/20"
                />
                <label htmlFor="isActive" className="cursor-pointer text-sm font-bold text-gray-700">
                  نشط (يظهر في الصفحة الرئيسية)
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={editingCategory ? handleUpdate : handleCreate}
                  disabled={isLoading || !formData.name || !formData.slug}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3 font-bold text-white transition-all hover:bg-brand-deepest disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Save className="h-5 w-5" />
                  {isLoading ? 'جاري الحفظ...' : editingCategory ? 'تحديث' : 'إضافة'}
                </button>
                <button
                  onClick={resetForm}
                  disabled={isLoading}
                  className="rounded-xl border-2 border-gray-200 px-6 py-3 font-bold text-gray-700 transition-all hover:bg-gray-50 disabled:opacity-50"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
