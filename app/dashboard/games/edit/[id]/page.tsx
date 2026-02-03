'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import {
  ArrowRight,
  ArrowLeft,
  FileText,
  Users,
  Target,
  Image as ImageIcon,
  Check,
  Save,
  Loader2,
  AlertCircle,
  Trash2,
  X,
  UploadCloud,
  Wand2,
  CheckCircle2,
  Brain,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ImageKitUploadButton } from '@/components/ui/imagekit-upload-button'
import { cn } from '@/lib/utils'
import { ARAB_COUNTRIES } from '@/lib/constants/countries'
import { updateGame, deleteGame } from '@/lib/actions/game'
import { getCountryIdByName, getOrCreateHeritageFieldId, getOrCreateTagIds } from '@/lib/actions/helpers'

// Character counter component
function CharCounter({ 
  current, 
  max, 
  min 
}: { 
  current: number
  max: number
  min?: number
}) {
  const percentage = (current / max) * 100
  const isOverLimit = current > max
  const isUnderMin = min && current < min && current > 0
  
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className={cn(
        'font-medium',
        isOverLimit ? 'text-red-600' : 
        isUnderMin ? 'text-yellow-600' : 
        current > max * 0.8 ? 'text-orange-600' : 
        'text-gray-500'
      )}>
        {current} / {max}
      </span>
      {isOverLimit && (
        <span className="text-red-600">⚠️ تجاوز الحد الأقصى</span>
      )}
      {isUnderMin && (
        <span className="text-yellow-600">الحد الأدنى {min} حرف</span>
      )}
    </div>
  )
}

export default function EditGamePage() {
  const router = useRouter()
  const params = useParams()
  const gameId = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [formStep, setFormStep] = useState(1)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState({
    name: '',
    country: '',
    region: '',
    heritageField: '',
    gameType: '',
    localNames: '',
    tags: '',
    description: '',
    ageGroup: '',
    ageGroupDetails: '',
    practitioners: '',
    practitionersDetails: '',
    players: '',
    playersDetails: '',
    tools: '',
    environment: '',
    timing: '',
    rules: ['', '', ''],
    winLoss: '',
    startEnd: '',
    socialContext: '',
    oralTradition: '',
    // Ethno-cognitive archival fields (حقول الأرشفة الإثنو-معرفية)
    ethnographicMeaning: '',
    linguisticOrigin: '',
    cognitiveComplexity: '',
    folkCognitiveFunction: '',
    references: '',
    imageCaption: '',
    uploadedImages: [] as string[],
  })

  // Load game data
  useEffect(() => {
    const loadGame = async () => {
      try {
        const response = await fetch(`/api/games/${gameId}`)
        if (!response.ok) throw new Error('Failed to load game')
        
        const { game } = await response.json()
        
        const newFormData = {
          name: game.canonicalName || '',
          country: game.country?.name || '',
          region: game.region || '',
          heritageField: game.heritageField?.name || '',
          gameType: game.gameType || '',
          localNames: game.localNames?.join(', ') || '',
          tags: game.tags?.map((t: any) => t.tag.name).join(', ') || '',
          description: game.description || '',
          ageGroup: game.ageGroup || '',
          ageGroupDetails: game.ageGroupDetails || '',
          practitioners: game.practitioners || '',
          practitionersDetails: game.practitionersDetails || '',
          players: game.playersCount || '',
          playersDetails: game.playersDetails || '',
          tools: game.tools?.join(', ') || '',
          environment: game.environment || '',
          timing: game.timing || '',
          rules: game.rules?.length > 0 ? game.rules : ['', '', ''],
          winLoss: game.winLossSystem || '',
          startEnd: game.startEndMechanism || '',
          socialContext: game.socialContext || '',
          oralTradition: game.oralTradition || '',
          // Ethno-cognitive archival fields (حقول الأرشفة الإثنو-معرفية)
          ethnographicMeaning: game.ethnographicMeaning || '',
          linguisticOrigin: game.linguisticOrigin || '',
          cognitiveComplexity: game.cognitiveComplexity || '',
          folkCognitiveFunction: game.folkCognitiveFunction || '',
          references: '', // Will be loaded from references table
          imageCaption: game.canonicalName ? `صورة توضيحية للعبة ${game.canonicalName}` : '',
          uploadedImages: game.media?.map((m: any) => m.url) || [],
        }
        
        console.log('📝 Setting form data:', newFormData)
        setFormData(newFormData)
        
        setLoading(false)
      } catch (error) {
        console.error('Error loading game:', error)
        alert('فشل تحميل بيانات اللعبة')
        router.push('/dashboard/games')
      }
    }

    loadGame()
  }, [gameId, router])

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const updateRule = (index: number, value: string) => {
    const newRules = [...formData.rules]
    newRules[index] = value
    setFormData((prev) => ({ ...prev, rules: newRules }))
  }

  const addRule = () => {
    setFormData((prev) => ({ ...prev, rules: [...prev.rules, ''] }))
  }

  const handleSave = async () => {
    if (saving) return
    setSaving(true)

    try {
      // Get country ID
      const countryId = await getCountryIdByName(formData.country)
      if (!countryId) {
        alert('يرجى اختيار دولة صحيحة')
        setSaving(false)
        return
      }

      // Get heritage field ID
      const heritageFieldId = await getOrCreateHeritageFieldId(formData.heritageField)

      // Get tag IDs
      const tagsArray = formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(t => t) : []
      const tagIds = await getOrCreateTagIds(tagsArray)

      // Prepare update data
      const updateData = {
        canonicalName: formData.name,
        countryId,
        region: formData.region || null,
        heritageFieldId,
        gameType: formData.gameType,
        localNames: formData.localNames ? formData.localNames.split(',').map(n => n.trim()).filter(n => n) : [],
        ageGroup: formData.ageGroup || null,
        ageGroupDetails: formData.ageGroupDetails || null,
        practitioners: formData.practitioners || null,
        practitionersDetails: formData.practitionersDetails || null,
        playersCount: formData.players || null,
        playersDetails: formData.playersDetails || null,
        tools: formData.tools ? formData.tools.split(',').map(t => t.trim()).filter(t => t) : [],
        environment: formData.environment || null,
        timing: formData.timing || null,
        description: formData.description,
        rules: formData.rules.filter(r => r.trim().length > 0),
        winLossSystem: formData.winLoss || null,
        startEndMechanism: formData.startEnd || null,
        oralTradition: formData.oralTradition || null,
        socialContext: formData.socialContext || null,
        // Ethno-cognitive archival fields (حقول الأرشفة الإثنو-معرفية)
        ethnographicMeaning: formData.ethnographicMeaning || null,
        linguisticOrigin: formData.linguisticOrigin || null,
        cognitiveComplexity: formData.cognitiveComplexity || null,
        folkCognitiveFunction: formData.folkCognitiveFunction || null,
        tagIds,
        uploadedImages: formData.uploadedImages,
      }

      const result = await updateGame(gameId, updateData)

      if (result.success) {
        alert('✅ تم تحديث اللعبة بنجاح!')
        router.push('/dashboard/games')
      } else {
        alert(`❌ فشل التحديث: ${result.message}`)
      }
    } catch (error) {
      console.error('Error updating game:', error)
      alert('حدث خطأ أثناء تحديث اللعبة')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (deleting) return

    const confirmed = confirm(
      '⚠️ هل أنت متأكد من حذف هذه اللعبة؟\n\nسيتم أرشفة اللعبة ولن تكون مرئية للجمهور.\nهذا الإجراء لا يمكن التراجع عنه.'
    )

    if (!confirmed) return

    setDeleting(true)

    try {
      const result = await deleteGame(gameId)

      if (result.success) {
        alert('✅ تم أرشفة اللعبة بنجاح')
        router.push('/dashboard/games')
      } else {
        alert(`❌ فشل الحذف: ${result.message}`)
      }
    } catch (error) {
      console.error('Error deleting game:', error)
      alert('حدث خطأ أثناء حذف اللعبة')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-brand-deepest mx-auto mb-4" />
          <p className="text-gray-600">جاري تحميل بيانات اللعبة...</p>
        </div>
      </div>
    )
  }

  // Calculate form completion percentage
  const calculateProgress = () => {
    const fields = [
      formData.name,
      formData.country,
      formData.description,
      formData.gameType,
      formData.ageGroup,
      formData.practitioners,
      formData.players,
      formData.tools,
      formData.environment,
      formData.timing,
      formData.rules.filter(r => r.trim()).length > 0 ? 'yes' : '',
      formData.winLoss,
      formData.startEnd,
      formData.socialContext,
    ]
    const filled = fields.filter(f => f && f.toString().trim().length > 0).length
    return Math.round((filled / fields.length) * 100)
  }

  const progress = calculateProgress()

  // Remove uploaded image
  const removeUploadedImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      uploadedImages: prev.uploadedImages.filter((_, i) => i !== index)
    }))
  }

  return (
    <div className="relative max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-l from-brand/10 via-brand/5 to-white rounded-2xl p-8 border-2 border-brand/20 shadow-lg mb-8">
        <div className="flex items-center justify-between flex-wrap gap-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="w-12 h-12 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center"
            >
              <ArrowRight className="h-6 w-6 text-gray-600" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-4xl font-bold text-brand-deepest">تعديل اللعبة</h2>
                <p className="text-gray-600 mt-1">تحديث معلومات اللعبة وتحسين التوثيق</p>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
              className="gap-2"
            >
              {deleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  جاري الحذف...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  حذف اللعبة
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Stepper */}
      <div className="relative mx-auto mb-12 flex max-w-2xl justify-between">
        <div className="absolute left-0 right-0 top-5 -z-0 h-0.5 bg-gray-200" />
        <div
          className="absolute right-0 top-5 -z-0 h-0.5 bg-brand-deepest transition-all duration-500"
          style={{ width: `${((formStep - 1) / 3) * 100}%` }}
        />
        {[
          { step: 1, icon: FileText, label: 'البيانات الأساسية' },
          { step: 2, icon: Users, label: 'المشاركون والبيئة' },
          { step: 3, icon: Target, label: 'آلية اللعب' },
          { step: 4, icon: ImageIcon, label: 'الوسائط والمجتمع' },
        ].map(({ step, icon: Icon, label }) => (
          <div key={step} className="relative z-10 flex w-24 flex-col items-center gap-2">
            <div
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300',
                step === formStep
                  ? 'scale-110 border-accent bg-accent text-brand-deepest shadow-lg'
                  : step < formStep
                  ? 'border-brand-deepest bg-brand-deepest text-white'
                  : 'border-gray-200 bg-white text-gray-400'
              )}
            >
              {step < formStep ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
            </div>
            <span
              className={cn(
                'text-xs font-bold transition-colors text-center',
                step === formStep ? 'text-brand-deepest' : 'text-gray-400'
              )}
            >
              {label}
            </span>
          </div>
        ))}
      </div>

      <div className="grid items-start gap-8 lg:grid-cols-3">
        {/* Form */}
        <div className="space-y-6 lg:col-span-2">
        {/* Step 1: Basic Info */}
        {formStep === 1 && (
          <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500 border-2 border-gray-200 shadow-lg">
            <CardHeader className="bg-gradient-to-l from-gray-50 to-white border-b-2 border-gray-200">
              <CardTitle className="text-brand-deepest text-xl">البيانات التعريفية</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-brand-deepest">
                      اسم اللعبة الرسمي
                    </label>
                    <CharCounter current={formData.name.length} max={200} min={3} />
                  </div>
                  <Input
                    placeholder="مثال: الركض بالحاجبين المرفوعين"
                    value={formData.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    className={validationErrors.name ? 'border-red-500' : ''}
                  />
                  {validationErrors.name && (
                    <div className="flex items-center gap-1 text-red-600 text-xs">
                      <AlertCircle className="w-3 h-3" />
                      <span>{validationErrors.name}</span>
                    </div>
                  )}
                  <p className="text-xs text-gray-400">
                    الاسم الأكثر شيوعاً وتداولاً في المراجع المعتمدة.
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-brand-deepest">الدولة</label>
                  <select
                    className="form-field"
                    value={formData.country}
                    onChange={(e) => updateField('country', e.target.value)}
                  >
                    <option value="">اختر الدولة...</option>
                    {ARAB_COUNTRIES.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-span-full space-y-2">
                  <label className="text-sm font-bold text-brand-deepest">
                    الإقليم / نطاق الانتشار
                  </label>
                  <Input
                    placeholder="مثال: الفرجان القديمة (الدوحة، الوكرة، الخور)"
                    value={formData.region}
                    onChange={(e) => updateField('region', e.target.value)}
                  />
                </div>
                <div className="col-span-full space-y-2">
                  <label className="text-sm font-bold text-brand-deepest">مجال التراث</label>
                  <Input
                    placeholder="مثال: الألعاب الشعبية - الممارسات الاجتماعية والطقوس"
                    value={formData.heritageField}
                    onChange={(e) => updateField('heritageField', e.target.value)}
                  />
                </div>
                <div className="col-span-full space-y-2">
                  <label className="text-sm font-bold text-brand-deepest">
                    نوع اللعبة <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="مثال: فكاهة / حركية / سباق معوقات جسدية"
                    value={formData.gameType}
                    onChange={(e) => updateField('gameType', e.target.value)}
                  />
                  <p className="text-xs text-gray-400">
                    أدخل التصنيف الأساسي للعبة (يمكنك إدخال أكثر من نوع مفصولة بـ /)
                  </p>
                </div>
                <div className="col-span-full space-y-2">
                  <label className="text-sm font-bold text-brand-deepest">
                    المسميات المحلية / البديلة
                  </label>
                  <Input
                    placeholder="افصل بين المسميات بفاصلة..."
                    value={formData.localNames}
                    onChange={(e) => updateField('localNames', e.target.value)}
                  />
                </div>
                <div className="col-span-full space-y-2">
                  <label className="text-sm font-bold text-brand-deepest">تاجات التصنيف</label>
                  <Input
                    placeholder="افصل بين التاجات بفاصلة..."
                    value={formData.tags}
                    onChange={(e) => updateField('tags', e.target.value)}
                  />
                </div>
                <div className="col-span-full space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-brand-deepest">الوصف الموسع</label>
                    <CharCounter current={formData.description.length} max={5000} min={50} />
                  </div>
                  <Textarea
                    placeholder="شرح مفصل لطبيعة اللعبة وفكرتها..."
                    value={formData.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    className={cn(
                      'min-h-[120px]',
                      validationErrors.description ? 'border-red-500' : ''
                    )}
                  />
                  {validationErrors.description && (
                    <div className="flex items-center gap-1 text-red-600 text-xs">
                      <AlertCircle className="w-3 h-3" />
                      <span>{validationErrors.description}</span>
                    </div>
                  )}
                  <p className="text-xs text-gray-400">
                    يجب أن يحتوي الوصف على الأقل 50 حرفاً ولا يتجاوز 5000 حرف.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Participants & Environment */}
        {formStep === 2 && (
          <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500 border-2 border-gray-200 shadow-lg">
            <CardHeader className="bg-gradient-to-l from-gray-50 to-white border-b-2 border-gray-200">
              <CardTitle className="text-brand-deepest text-xl">تفاصيل المشاركين وبيئة اللعب</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="space-y-6">
                <div className="grid gap-6 rounded-xl border border-gray-100 bg-gray-50 p-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-brand-deepest">
                      الفئة العمرية
                    </label>
                    <Input
                      placeholder="مثال: 9 - 12 سنة (الطفولة المتوسطة)"
                      value={formData.ageGroup}
                      onChange={(e) => updateField('ageGroup', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-brand-deepest">
                      نوع الممارسين
                    </label>
                    <Input
                      placeholder="مثال: مختلط (ذكور وإناث)"
                      value={formData.practitioners}
                      onChange={(e) => updateField('practitioners', e.target.value)}
                    />
                  </div>
                  <div className="col-span-full space-y-2">
                    <label className="text-sm font-bold text-brand-deepest">
                      وصف الفئة العمرية (تفاصيل)
                    </label>
                    <Textarea
                      placeholder="مثال: العمر الذي يمتلك فيه الطفل القدرة على 'فصل الحواس' والتحكم المستقل..."
                      value={formData.ageGroupDetails}
                      onChange={(e) => updateField('ageGroupDetails', e.target.value)}
                      className="min-h-[80px]"
                    />
                    <p className="text-xs text-gray-400">
                      شرح مفصل للفئة العمرية المناسبة وخصائصها
                    </p>
                  </div>
                  <div className="col-span-full space-y-2">
                    <label className="text-sm font-bold text-brand-deepest">
                      وصف الممارسين (تفاصيل)
                    </label>
                    <Textarea
                      placeholder="مثال: لعبة مقبولة اجتماعياً للجنسين؛ تُلعب في 'الحوي' للفتيات..."
                      value={formData.practitionersDetails}
                      onChange={(e) => updateField('practitionersDetails', e.target.value)}
                      className="min-h-[80px]"
                    />
                    <p className="text-xs text-gray-400">
                      تفاصيل إضافية عن الممارسين والسياق الاجتماعي
                    </p>
                  </div>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-brand-deepest">عدد اللاعبين</label>
                    <Input
                      placeholder="مثال: 3 - 10 لاعبين"
                      value={formData.players}
                      onChange={(e) => updateField('players', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-brand-deepest">
                      الأدوات والمستلزمات
                    </label>
                    <Input
                      placeholder="مثال: عصا، حبل، كرات..."
                      value={formData.tools}
                      onChange={(e) => updateField('tools', e.target.value)}
                    />
                  </div>
                  <div className="col-span-full space-y-2">
                    <label className="text-sm font-bold text-brand-deepest">
                      وصف اللاعبين (تفاصيل)
                    </label>
                    <Textarea
                      placeholder="مثال: يبدأ من 3 أطفال، والعدد الكبير يزيد من صعوبة اللعبة..."
                      value={formData.playersDetails}
                      onChange={(e) => updateField('playersDetails', e.target.value)}
                      className="min-h-[80px]"
                    />
                    <p className="text-xs text-gray-400">
                      شرح مفصل لعدد اللاعبين وكيف يؤثر على اللعبة
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-brand-deepest">المكان</label>
                    <Input
                      placeholder="مثال: السكيك (الأزقة) أو الحوي"
                      value={formData.environment}
                      onChange={(e) => updateField('environment', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-brand-deepest">الوقت</label>
                    <Input
                      placeholder="مثال: النهار (العصر)"
                      value={formData.timing}
                      onChange={(e) => updateField('timing', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Gameplay Rules */}
        {formStep === 3 && (
          <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500 border-2 border-gray-200 shadow-lg">
            <CardHeader className="bg-gradient-to-l from-gray-50 to-white border-b-2 border-gray-200">
              <CardTitle className="text-brand-deepest text-xl">القواعد وآلية اللعب</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-brand-deepest">
                    القواعد وطريقة اللعب
                  </label>
                  <button
                    className="text-xs font-bold text-accent hover:underline"
                    onClick={addRule}
                  >
                    + إضافة خطوة
                  </button>
                </div>
                {formData.rules.map((rule, i) => (
                  <div key={i} className="flex gap-3">
                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-brand-deepest/5 text-sm font-bold text-brand-deepest">
                      {i + 1}
                    </span>
                    <Textarea
                      className="h-12 min-h-0 resize-none"
                      value={rule}
                      onChange={(e) => updateRule(i, e.target.value)}
                      placeholder={`القاعدة ${i + 1}...`}
                    />
                  </div>
                ))}
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-brand-deepest">
                    نظام الفوز والخسارة
                  </label>
                  <Textarea
                    placeholder="الفوز: ... الخسارة: ..."
                    value={formData.winLoss}
                    onChange={(e) => updateField('winLoss', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-brand-deepest">
                    آلية البدء والانتهاء
                  </label>
                  <Textarea
                    placeholder="البدء: ... الانتهاء: ..."
                    value={formData.startEnd}
                    onChange={(e) => updateField('startEnd', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Media & Social Context */}
        {formStep === 4 && (
          <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500 border-2 border-gray-200 shadow-lg">
            <CardHeader className="bg-gradient-to-l from-gray-50 to-white border-b-2 border-gray-200">
              <CardTitle className="text-brand-deepest text-xl">الموروث الشفهي والوسائط</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-brand-deepest">السياق الاجتماعي</label>
                <Textarea
                  placeholder="مثال: ضبط النفس، الذكاء العاطفي..."
                  value={formData.socialContext}
                  onChange={(e) => updateField('socialContext', e.target.value)}
                  className="min-h-[100px]"
                />
                <p className="text-xs text-gray-400">
                  اشرح الدلالات الاجتماعية والقيم التربوية المرتبطة باللعبة
                </p>
              </div>

              {/* حقول الأرشفة الإثنو-معرفية */}
              <div className="border-t border-gray-200 pt-6 mt-6">
                <h3 className="text-md font-bold text-brand-deepest mb-4 flex items-center gap-2">
                  <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs">اختياري</span>
                  الأرشفة الإثنو-معرفية
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  حقول متقدمة للتوثيق الأكاديمي والإثنوغرافي للألعاب التراثية
                </p>

                <div className="grid gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-brand-deepest">
                      المعنى الإثنوغرافي للتسمية
                    </label>
                    <Textarea
                      className="min-h-[100px]"
                      placeholder="مثال: تشير تسمية «الخربقة» في اللهجات المغاربية إلى الإرباك وإعادة خلط المسارات..."
                      value={formData.ethnographicMeaning}
                      onChange={(e) => updateField('ethnographicMeaning', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-brand-deepest">
                      الأصل اللغوي للتسمية
                    </label>
                    <Textarea
                      className="min-h-[80px]"
                      placeholder="مثال: الخربقة: جذر دارج مرتبط بالخلط والتشويش. السِّيجَة: من «سوّج» أي أحاط وحدّ..."
                      value={formData.linguisticOrigin}
                      onChange={(e) => updateField('linguisticOrigin', e.target.value)}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-brand-deepest">
                        مستوى التعقيد المعرفي
                      </label>
                      <Textarea
                        className="min-h-[80px]"
                        placeholder="مثال: مرتفع – يعتمد على التخطيط متعدد المراحل، قراءة النوايا..."
                        value={formData.cognitiveComplexity}
                        onChange={(e) => updateField('cognitiveComplexity', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-brand-deepest">
                        الوظيفة المعرفية الشعبية
                      </label>
                      <Textarea
                        className="min-h-[80px]"
                        placeholder="مثال: تدريب التفكير الاستباقي، إدارة القيود، اتخاذ القرار تحت الضغط..."
                        value={formData.folkCognitiveFunction}
                        onChange={(e) => updateField('folkCognitiveFunction', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-brand-deepest">أهازيج ومصطلحات</label>
                <Textarea
                  className="min-h-[100px]"
                  placeholder="اكتب الصيحات أو الأغاني المرافقة..."
                  value={formData.oralTradition}
                  onChange={(e) => updateField('oralTradition', e.target.value)}
                />
                <p className="text-xs text-gray-400">
                  أي أهازيج أو صيحات أو مصطلحات خاصة باللعبة
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-brand-deepest">المصادر والمراجع</label>
                <Textarea
                  className="min-h-[100px]"
                  placeholder="مثال: سلسلة الألعاب الشعبية القطرية - كتارا"
                  value={formData.references}
                  onChange={(e) => updateField('references', e.target.value)}
                />
                <p className="text-xs text-gray-400">
                  أضف مراجع موثوقة لتعزيز مصداقية التوثيق
                </p>
              </div>
              
              {/* Image Upload Section */}
              <div className="space-y-4 pt-4 border-t border-gray-200">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-brand-deepest mb-2 block">
                    صور توضيحية للعبة
                  </label>
                  
                  {/* خيار 1: رفع الصور من الكمبيوتر - ImageKit */}
                  <div className="rounded-lg border border-green-200 bg-green-50 p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <UploadCloud className="h-4 w-4 text-green-700" />
                      <h4 className="text-sm font-bold text-green-900">رفع من الكمبيوتر (ImageKit)</h4>
                    </div>
                    <ImageKitUploadButton
                      onUploadComplete={(url) => {
                        setFormData(prev => ({
                          ...prev,
                          uploadedImages: [...prev.uploadedImages, url]
                        }))
                      }}
                      onUploadError={(error) => {
                        console.error('Upload error:', error)
                        alert('حدث خطأ أثناء رفع الصورة. يرجى المحاولة مرة أخرى.')
                      }}
                      buttonText="رفع صورة من الكمبيوتر"
                      maxFiles={5}
                    />
                    <p className="text-xs text-green-700">
                      ✅ يستخدم ImageKit - تخزين سحابي سريع وآمن
                    </p>
                  </div>
                  
                  {/* خيار 2: إضافة رابط URL */}
                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="h-4 w-4 text-blue-600" />
                      <h4 className="text-sm font-bold text-blue-900">أو أضف رابط صورة</h4>
                    </div>
                    <div className="flex gap-2">
                      <Input
                        id="imageUrlInput"
                        placeholder="https://example.com/image.jpg"
                        className="flex-1"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            const input = e.target as HTMLInputElement
                            const url = input.value.trim()
                            if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
                              setFormData(prev => ({
                                ...prev,
                                uploadedImages: [...prev.uploadedImages, url]
                              }))
                              input.value = ''
                            } else {
                              alert('يرجى إدخال رابط صحيح يبدأ بـ http:// أو https://')
                            }
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          const input = document.getElementById('imageUrlInput') as HTMLInputElement
                          const url = input.value.trim()
                          if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
                            setFormData(prev => ({
                              ...prev,
                              uploadedImages: [...prev.uploadedImages, url]
                            }))
                            input.value = ''
                          } else {
                            alert('يرجى إدخال رابط صحيح يبدأ بـ http:// أو https://')
                          }
                        }}
                      >
                        إضافة
                      </Button>
                    </div>
                    <p className="text-xs text-blue-600">
                      💡 يمكنك استخدام روابط من Imgur أو أي خدمة استضافة صور أخرى
                    </p>
                  </div>
                  
                  {/* عرض الصور المرفوعة */}
                  {formData.uploadedImages.length > 0 && (
                    <div className="mt-4 space-y-3">
                      <h4 className="text-sm font-bold text-brand-deepest">الصور المضافة ({formData.uploadedImages.length}):</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {formData.uploadedImages.map((url, index) => (
                          <div key={index} className="relative rounded-lg border border-gray-200 overflow-hidden">
                            <img 
                              src={url} 
                              alt={`صورة ${index + 1}`}
                              className="w-full h-32 object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3Eخطأ في تحميل الصورة%3C/text%3E%3C/svg%3E'
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setFormData(prev => ({
                                  ...prev,
                                  uploadedImages: prev.uploadedImages.filter((_, i) => i !== index)
                                }))
                              }}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                              title="حذف الصورة"
                            >
                              <X className="h-3 w-3" />
                            </button>
                            <div className="p-2 bg-gray-50">
                              <p className="text-xs text-gray-500 truncate" title={url}>
                                {url.split('/').pop() || url}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-brand-deepest">
                      التسمية التوضيحية للصورة
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        if (formData.name.trim()) {
                          updateField('imageCaption', `صورة توضيحية للعبة ${formData.name.trim()}`)
                        }
                      }}
                      className="text-xs font-bold text-accent hover:underline flex items-center gap-1"
                    >
                      <Wand2 className="h-3 w-3" /> ملء تلقائي
                    </button>
                  </div>
                  <Input
                    placeholder="مثال: صورة توضيحية للعبة الركض بالحاجبين المرفوعين"
                    value={formData.imageCaption || ''}
                    onChange={(e) => updateField('imageCaption', e.target.value)}
                  />
                  <p className="text-xs text-gray-400">
                    اكتب وصفاً مختصراً للصورة يظهر أسفلها في صفحة العرض.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center pt-8 border-t border-gray-100">
          {formStep > 1 ? (
            <Button variant="outline" onClick={() => setFormStep((p) => p - 1)} className="gap-2">
              <ArrowRight className="h-4 w-4" />
              السابق
            </Button>
          ) : (
            <div />
          )}
          {formStep < 4 ? (
            <Button onClick={() => setFormStep((p) => p + 1)} className="gap-2">
              التالي
              <ArrowLeft className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSave}
              disabled={saving}
              className="gap-2 bg-brand hover:bg-brand-deep"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  جاري الحفظ...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  حفظ التعديلات
                </>
              )}
            </Button>
          )}
        </div>
        </div>

        {/* Sidebar */}
        <div className="sticky top-24 hidden space-y-6 lg:block">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-accent" /> نصائح التوثيق
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4 text-sm text-gray-600">
                <li className="flex gap-2">
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-500 mt-0.5" />
                  <div>
                    <strong className="text-brand-deepest">الاسم المحلي:</strong>
                    <p className="text-xs mt-1">اكتب الاسم الشائع في المنطقة، واستخدم الأقواس للمسميات البديلة</p>
                  </div>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-500 mt-0.5" />
                  <div>
                    <strong className="text-brand-deepest">القواعد والوصف:</strong>
                    <p className="text-xs mt-1">رتّب الخطوات بتسلسل منطقي، واذكر الأدوات والمكان والزمان بوضوح</p>
                  </div>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-500 mt-0.5" />
                  <div>
                    <strong className="text-brand-deepest">الصور والوثائق:</strong>
                    <p className="text-xs mt-1">ارفع صوراً واضحة عالية الجودة، واستخدم التسميات التوضيحية المناسبة</p>
                  </div>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-500 mt-0.5" />
                  <div>
                    <strong className="text-brand-deepest">المراجع والمصادر:</strong>
                    <p className="text-xs mt-1">أضف مراجع موثوقة لتعزيز مصداقية التوثيق</p>
                  </div>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-500 mt-0.5" />
                  <div>
                    <strong className="text-brand-deepest">السياق الثقافي:</strong>
                    <p className="text-xs mt-1">اشرح الدلالات الاجتماعية والقيم التربوية المرتبطة باللعبة</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">نسبة الإنجاز</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">تم ملء الحقول</span>
                  <span className={cn(
                    "font-bold",
                    progress < 30 ? "text-red-600" :
                    progress < 70 ? "text-yellow-600" :
                    "text-emerald-600"
                  )}>
                    {progress}%
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                  <div 
                    className={cn(
                      "h-full transition-all duration-500 rounded-full",
                      progress < 30 ? "bg-red-500" :
                      progress < 70 ? "bg-yellow-500" :
                      "bg-emerald-500"
                    )}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              {progress === 100 && (
                <div className="flex items-center gap-2 rounded-lg bg-emerald-50 p-3 text-xs">
                  <Check className="h-4 w-4 text-emerald-600" />
                  <span className="font-medium text-emerald-700">
                    ممتاز! جميع الحقول مكتملة ✓
                  </span>
                </div>
              )}
              {progress < 100 && progress > 0 && (
                <p className="text-xs text-gray-500">
                  {progress < 30 ? "🚀 ابدأ بملء الحقول الأساسية" :
                   progress < 70 ? "💪 أنت في منتصف الطريق، استمر!" :
                   "⭐ أوشكت على الانتهاء!"}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
