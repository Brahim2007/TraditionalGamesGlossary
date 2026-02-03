'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowRight,
  ArrowLeft,
  FileText,
  Users,
  Target,
  Image as ImageIcon,
  Check,
  Save,
  Wand2,
  Table as TableIcon,
  X,
  Brain,
  CheckCircle2,
  UploadCloud,
  AlertCircle,
  Loader2,
  CheckCircle,
  FileCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { UploadButton } from '@/components/ui/upload-button'
import { CloudinaryUploadButton } from '@/components/ui/cloudinary-upload-button'
import { cn, parseRulesToArray } from '@/lib/utils'
import { ARAB_COUNTRIES } from '@/lib/constants/countries'
import { validateGameData, getFieldError, clearFieldError, validateGameName, validateDescription, validateRules } from '@/lib/utils/validation'
import { createGame } from '@/lib/actions/game'
import { getCountryIdByName, getOrCreateHeritageFieldId, getOrCreateTagIds } from '@/lib/actions/helpers'

// Template data for reference - الجدول النموذجي الكامل كما في المثال
const templateData = [
  { field: "اسم اللعبة", value: "الركض بالحاجبين المرفوعين" },
  { field: "المسميات المحلية", value: "سباق المبهّتين، لعبة العيون الكبار" },
  { field: "الدولة", value: "دولة قطر" },
  { field: "الإقليم", value: "الفرجان القديمة (الدوحة، الوكرة، الخور) - الأحياء الحضرية والسكيك" },
  { field: "مجال التراث", value: "الألعاب الشعبية - الممارسات الاجتماعية والطقوس (ألعاب التحكم النفسي-الحركي)" },
  { field: "نوع اللعبة", value: "فكاهة / حركية / سباق معوقات جسدية" },
  { field: "تاجات التصنيف", value: "#تراث_خليجي، #ألعاب_طريفة، #ألعاب_حركية، #دولة_قطر" },
  { field: "الفئة العمرية", value: "9 - 12 سنة (الطفولة المتوسطة)" },
  { field: "وصف الفئة العمرية", value: "العمر الذي يمتلك فيه الطفل القدرة على 'فصل الحواس' والتحكم المستقل في عضلات الوجه مع تقبل الفكاهة." },
  { field: "الممارسون", value: "مختلط (ذكور وإناث)" },
  { field: "وصف الممارسين", value: "لعبة مقبولة اجتماعياً للجنسين؛ تُلعب في 'الحوي' للفتيات وفي 'السكيك' للأولاد." },
  { field: "عدد اللاعبين", value: "3 - 10 لاعبين (سباق جماعي)" },
  { field: "وصف اللاعبين", value: "يبدأ من 3 أطفال، والعدد الكبير يزيد من صعوبة اللعبة بسبب 'عدوى الضحك'." },
  { field: "الأدوات", value: "لا يوجد (الجسد فقط - التركيز على عضلات الوجه والجبهة)" },
  { field: "المكان", value: "السكيك (الأزقة) أو الحوي (فناء المنزل)؛ بشرط أن تكون الأرضية مستوية." },
  { field: "الوقت", value: "النهار (العصر)؛ لضمان وضوح الرؤية للحكم والمراقبين." },
  { field: "الوصف الموسع", value: "تمرين في 'فصل الحواس' يكسر الفطرة البشرية التي تميل لتقطيب الجبين عند الركض. يركض الطفل بأقصى سرعة مع الحفاظ على وضعية 'الدهشة القصوى'، مما يخلق مشهداً كوميدياً يجمع بين جدية الجسد وذهول الوجه." },
  { field: "قواعد اللعب", value: "يصطف المتسابقون عند خط البداية.\nوضع الاستعداد: رفع الحواجب لأقصى حد وتثبيتها قبل الانطلاق.\nالركض بسرعة قصوى دون إنزال الحاجبين.\nالمراقبة: من يخفض حاجبيه يُستبعد فوراً أو يتوقف لإعادة رفعهما.\nالفوز لمن يصل خط النهاية أولاً وحواجبه مرفوعة." },
  { field: "نظام الفوز والخسارة", value: "الفوز: يعتمد على السرعة والتحكم العضلي (لقب صاحب العيون القوية).\nالخسارة: غالباً ما تحدث بسبب الضحك الذي يؤدي لارتخاء العضلات." },
  { field: "آلية البدء والانتهاء", value: "البدء: بالقرعة وتفتيش 'جاهزية الوجوه'.\nالانتهاء: بوصول أول متسابق أو استسلام الجميع من الضحك." },
  { field: "الموروث الشفهي", value: "صيحات تشويش مثل: 'نزلت! نزلت!'، 'ارفع عينك!'، 'شوف وراك!' (لإرغام اللاعب على فقدان التركيز)." },
  { field: "السياق الاجتماعي", value: "1. ضبط النفس (Self-Control) والرزانة.\n2. الذكاء العاطفي وفصل الجهد البدني عن التعبير الوجهي.\n3. الترفيه الجماعي وكسر الجليد." },
  { field: "المراجع", value: "1. سلسلة الألعاب الشعبية القطرية - كتارا.\n2. التراث الشعبي في قطر - مركز التراث الشعبي لدول الخليج العربية.\n3. توثيق ميداني - سوق واقف." }
]

// Step indicator component
function StepIndicator({
  step,
  currentStep,
  icon: Icon,
  label,
  hasError,
}: {
  step: number
  currentStep: number
  icon: React.ElementType
  label: string
  hasError?: boolean
}) {
  const isActive = step === currentStep
  const isCompleted = step < currentStep

  return (
    <div className="relative z-10 flex w-24 flex-col items-center gap-2">
      <div
        className={cn(
          'flex h-12 w-12 items-center justify-center rounded-xl border-2 transition-all duration-300 relative',
          isActive
            ? 'scale-110 border-brand bg-gradient-to-br from-brand to-brand-deep text-white shadow-lg'
            : isCompleted
            ? 'border-green-500 bg-gradient-to-br from-green-400 to-green-600 text-white shadow-md'
            : hasError
            ? 'border-red-500 bg-red-50 text-red-600 animate-pulse'
            : 'border-gray-300 bg-white text-gray-400'
        )}
      >
        {isCompleted ? (
          <Check className="h-6 w-6" />
        ) : hasError ? (
          <AlertCircle className="h-6 w-6" />
        ) : (
          <Icon className="h-6 w-6" />
        )}
        {hasError && !isActive && (
          <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-white animate-pulse" />
        )}
      </div>
      <span
        className={cn(
          'text-xs font-bold transition-colors text-center',
          isActive ? 'text-brand-deepest' : 
          isCompleted ? 'text-green-600' :
          hasError ? 'text-red-600' : 
          'text-gray-500'
        )}
      >
        {label}
      </span>
    </div>
  )
}

// Form section wrapper
function FormSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500 border-2 border-gray-200 shadow-lg">
      <CardHeader className="bg-gradient-to-l from-gray-50 to-white border-b-2 border-gray-200">
        <CardTitle className="text-brand-deepest text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">{children}</CardContent>
    </Card>
  )
}

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

export default function AddGamePage() {
  const router = useRouter()
  const [formStep, setFormStep] = useState(1)
  const [showImportModal, setShowImportModal] = useState(false)
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [importText, setImportText] = useState('')
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state - مطابقة الجدول النموذجي الكامل
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    region: '',
    heritageField: '',
    gameType: '', // نوع اللعبة - حقل مطلوب
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
    references: '',
    imageCaption: '', // حقل جديد: التسمية التوضيحية للصورة
    uploadedImages: [] as string[], // روابط الصور المرفوعة
  })

  const updateField = (field: string, value: any) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value }
      
      // إذا كان الحقل الذي تم تحديثه هو اسم اللعبة، قم بملء التسمية التوضيحية تلقائياً
      if (field === 'name' && value.trim() && !prev.imageCaption) {
        updated.imageCaption = `صورة توضيحية للعبة ${value.trim()}`
      }
      
      return updated
    })
    
    // Clear validation error for this field when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(clearFieldError(field, validationErrors))
    }
    
    // Perform real-time validation for critical fields
    if (field === 'name') {
      const error = validateGameName(value)
      if (error) {
        setValidationErrors(prev => ({ ...prev, name: error }))
      }
    }
    
    if (field === 'description') {
      const error = validateDescription(value)
      if (error) {
        setValidationErrors(prev => ({ ...prev, description: error }))
      }
    }
    
    // Auto-save indication
    setSaveStatus('idle')
  }

  // Save as draft function
  const handleSaveDraft = () => {
    setSaveStatus('saving')
    setIsSaving(true)
    
    // Simulate saving to localStorage or backend
    setTimeout(() => {
      try {
        localStorage.setItem('game_draft', JSON.stringify(formData))
        setSaveStatus('saved')
        setShowSuccessMessage(true)
        setTimeout(() => {
          setShowSuccessMessage(false)
          setSaveStatus('idle')
        }, 3000)
      } catch (error) {
        setSaveStatus('error')
        alert('حدث خطأ أثناء حفظ المسودة')
      } finally {
        setIsSaving(false)
      }
    }, 800)
  }

  // Load draft on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('game_draft')
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft)
        // Ask user if they want to restore
        if (confirm('تم العثور على مسودة محفوظة. هل تريد استعادتها؟')) {
          setFormData(draft)
        }
      } catch (error) {
        console.error('Error loading draft:', error)
      }
    }
  }, [])

  // Calculate form completion percentage
  const calculateProgress = () => {
    const fields = [
      formData.name,
      formData.country,
      formData.description,
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
      formData.references,
    ]
    const filled = fields.filter(f => f && f.toString().trim().length > 0).length
    return Math.round((filled / fields.length) * 100)
  }

  const progress = calculateProgress()

  // Check which steps have errors
  const getStepErrors = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(validationErrors.name || validationErrors.country || validationErrors.description)
      case 2:
        return !!(validationErrors.ageGroup || validationErrors.practitioners || validationErrors.players)
      case 3:
        return !!(validationErrors.rules)
      case 4:
        return !!(validationErrors.references || validationErrors.socialContext)
      default:
        return false
    }
  }

  // Handle image upload completion
  const handleImageUploadComplete = (files: { url: string; name: string }[]) => {
    const imageUrls = files.map(file => file.url)
    setFormData(prev => ({
      ...prev,
      uploadedImages: [...prev.uploadedImages, ...imageUrls]
    }))
    alert(`تم رفع ${files.length} صورة بنجاح!`)
  }

  // Handle image upload error
  const handleImageUploadError = (error: Error) => {
    console.error('Upload error:', error)
    alert('حدث خطأ أثناء رفع الصورة. يرجى المحاولة مرة أخرى.')
  }

  // Remove uploaded image
  const removeUploadedImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      uploadedImages: prev.uploadedImages.filter((_, i) => i !== index)
    }))
  }

  const updateRule = (index: number, value: string) => {
    const newRules = [...formData.rules]
    newRules[index] = value
    setFormData((prev) => ({ ...prev, rules: newRules }))
    
    // Clear validation error for rules when user starts typing
    if (validationErrors.rules) {
      setValidationErrors(clearFieldError('rules', validationErrors))
    }
  }

  const addRule = () => {
    setFormData((prev) => ({ ...prev, rules: [...prev.rules, ''] }))
  }

  // Smart import handler
  const handleSmartImport = () => {
    if (!importText.trim()) return

    // Field mappings for Arabic text parsing - مطابقة الجدول النموذجي الكامل
    const fieldMappings = [
      { key: 'name', patterns: ['اسم اللعبة', 'الاسم الرسمي', 'اسم الممارسة'] },
      { key: 'localNames', patterns: ['المسميات المحلية', 'أسماء أخرى'] },
      { key: 'country', patterns: ['الدولة'] },
      { key: 'region', patterns: ['الإقليم', 'نطاق الانتشار'] },
      { key: 'heritageField', patterns: ['مجال التراث'] },
      { key: 'gameType', patterns: ['نوع اللعبة', 'تصنيف اللعبة', 'نوع الممارسة'] },
      { key: 'tags', patterns: ['تاجات التصنيف', 'الوسوم', 'التاجات'] },
      { key: 'description', patterns: ['الوصف الموسع', 'شرح اللعبة'] },
      { key: 'ageGroup', patterns: ['الفئة العمرية'] },
      { key: 'ageGroupDetails', patterns: ['وصف الفئة العمرية', 'الفئة العمرية (تفاصيل)'] },
      { key: 'practitioners', patterns: ['الممارسون', 'نوع الممارسين'] },
      { key: 'practitionersDetails', patterns: ['وصف الممارسين', 'نوع الممارسين (تفاصيل)'] },
      { key: 'players', patterns: ['عدد اللاعبين'] },
      { key: 'playersDetails', patterns: ['وصف اللاعبين', 'عدد اللاعبين (تفاصيل)'] },
      { key: 'tools', patterns: ['الأدوات', 'الأدوات والمستلزمات'] },
      { key: 'environment', patterns: ['بيئة الممارسة', 'المكان'] },
      { key: 'timing', patterns: ['التوقيت', 'الزمان', 'الوقت'] },
      { key: 'rules', patterns: ['قواعد اللعب', 'طريقة اللعب'] },
      { key: 'winLoss', patterns: ['نظام الفوز والخسارة'] },
      { key: 'startEnd', patterns: ['آلية البدء والانتهاء'] },
      { key: 'oralTradition', patterns: ['الموروث الشفهي', 'أهازيج'] },
      { key: 'socialContext', patterns: ['السياق الاجتماعي'] },
      { key: 'references', patterns: ['المراجع', 'المصادر'] },
      { key: 'imageCaption', patterns: ['تسمية الصورة', 'وصف الصورة', 'صورة توضيحية'] },
    ]

    // قائمة الدول العربية للتعرف التلقائي
    const arabCountries = ARAB_COUNTRIES.map(c => c.name)

    const lines = importText.split(/\r?\n/)
    const mappedData: Record<string, string> = {}
    let currentKey: string | null = null
    let rulesBuffer: string[] = []
    let isCollectingRules = false

    lines.forEach((line) => {
      let trimmed = line.trim()
      if (!trimmed) return
      
      // إزالة الفاصلة من بداية السطر إذا وجدت
      if (trimmed.startsWith(',')) {
        trimmed = trimmed.substring(1).trim()
      }
      
      // تجاهل الأسطر الفارغة أو الفواصل أو الخطوط
      if (!trimmed || trimmed === '---' || /^-+$/.test(trimmed)) return

      // Check if this line starts a new field
      let matched = false
      for (const mapping of fieldMappings) {
        for (const pattern of mapping.patterns) {
          // دعم تنسيقات متعددة: "الحقل: القيمة" أو "الحقل,القيمة"
          const regex = new RegExp(`^[\\-•*]?\\s*${pattern}[:\\-–,]*\\s*`, 'i')
          if (regex.test(trimmed)) {
            currentKey = mapping.key
            let content = trimmed.replace(regex, '').trim()
            
            // إزالة الفاصلة من بداية المحتوى إذا وجدت
            if (content.startsWith(',')) {
              content = content.substring(1).trim()
            }
            
            // معالجة خاصة لحقل الدولة - التعرف التلقائي
            if (currentKey === 'country') {
              // البحث عن اسم دولة في المحتوى
              const foundCountry = arabCountries.find(country => 
                content.includes(country) || country.includes(content)
              )
              if (foundCountry) {
                content = foundCountry
              }
            }
            
            // إذا كان هذا حقل القواعد، ابدأ جمع القواعد
            if (currentKey === 'rules') {
              isCollectingRules = true
              if (content) {
                // استخدام parseRulesToArray لتفكيك القواعد المفصولة بنقاط
                const parsedRules = parseRulesToArray(content)
                rulesBuffer.push(...parsedRules)
              }
            } else {
              isCollectingRules = false
              mappedData[currentKey] = content
            }
            matched = true
            break
          }
        }
        if (matched) break
      }

      // إذا لم يكن هناك تطابق وكاننا نجمع القواعد
      if (!matched && isCollectingRules && currentKey === 'rules') {
        // تحقق إذا كان السطر يبدأ برقم أو نقطة أو شرطة (مثل "1. " أو "- " أو "• ")
        const rulePattern = /^(\d+[\.\-\)\s]+|[•\-\*])\s*(.+)$/
        const match = trimmed.match(rulePattern)
        if (match) {
          // استخدام parseRulesToArray لتفكيك القواعد المتعددة
          const parsedRules = parseRulesToArray(match[2])
          rulesBuffer.push(...parsedRules)
        } else if (trimmed.length > 5) { // تجاهل الأسطر القصيرة جداً
          // استخدام parseRulesToArray لتفكيك القواعد المتعددة
          const parsedRules = parseRulesToArray(trimmed)
          rulesBuffer.push(...parsedRules)
        }
      }
      // إذا لم يكن هناك تطابق ولسنا نجمع القواعد
      else if (!matched && currentKey && !isCollectingRules) {
        // تجاهل الأسطر التي تبدو كعناوين أقسام
        if (!trimmed.startsWith('---') && trimmed.length > 2) {
        mappedData[currentKey] = (mappedData[currentKey] || '') + '\n' + trimmed
      }
      }
    })

    // تنظيف البيانات المستوردة
    Object.keys(mappedData).forEach(key => {
      mappedData[key] = mappedData[key]
        .trim()
        .replace(/^,+/, '') // إزالة الفواصل من البداية
        .replace(/,+$/, '') // إزالة الفواصل من النهاية
        .trim()
    })

    // إذا كان لدينا قواعد في المخزن المؤقت، حولها إلى مصفوفة
    if (rulesBuffer.length > 0) {
      // تحديث formData مع القواعد كمصفوفة
      setFormData((prev) => ({
        ...prev,
        ...Object.fromEntries(
          Object.entries(mappedData).map(([k, v]) => [k, v.trim()])
        ),
        rules: rulesBuffer.filter(rule => rule.trim().length > 0)
      }))
    } else {
      // Update form data بدون القواعد
      setFormData((prev) => ({
        ...prev,
        ...Object.fromEntries(
          Object.entries(mappedData).map(([k, v]) => [k, v.trim()])
        ),
      }))
    }

    setShowImportModal(false)
    setImportText('')
    alert('تم تحليل النص وتعبئة الحقول بنجاح!')
  }

  const handleSubmit = async () => {
    if (isSubmitting) return
    
    setIsSubmitting(true)
    
    try {
      // Debug: Log current form data
      console.log('Submitting form data:', {
        name: formData.name,
        country: formData.country,
        gameType: formData.gameType,
        description: formData.description,
        rules: formData.rules.filter(rule => rule.trim().length > 0),
        uploadedImages: formData.uploadedImages
      })
      
      // Validate all form data - تحويل أسماء الحقول للتطابق مع schema
      const validationResult = validateGameData({
        canonicalName: formData.name,
        localNames: formData.localNames,
        country: formData.country,
        region: formData.region,
        heritageField: formData.heritageField,
        gameType: formData.gameType,
        ageGroup: formData.ageGroup,
        ageGroupDetails: formData.ageGroupDetails,
        practitioners: formData.practitioners,
        practitionersDetails: formData.practitionersDetails,
        players: formData.players,
        playersDetails: formData.playersDetails,
        tools: formData.tools,
        environment: formData.environment,
        timing: formData.timing,
        description: formData.description,
        rules: formData.rules.filter(rule => rule.trim().length > 0),
        winLoss: formData.winLoss,
        startEnd: formData.startEnd,
        oralTradition: formData.oralTradition,
        socialContext: formData.socialContext,
        references: formData.references,
        tags: formData.tags
      })
      
      if (!validationResult.isValid) {
        setValidationErrors(validationResult.errors)
        
        // طباعة الأخطاء في console للتشخيص
        console.log('Validation Errors:', validationResult.errors)
        
        // إنشاء رسالة مفصلة بالأخطاء مع تحديد الخطوة
        const errorMessages: string[] = []
        const errorSteps: number[] = []
        
        // الخطوة 1: البيانات الأساسية
        if (validationResult.errors.canonicalName || validationResult.errors.name) {
          errorMessages.push(`❌ اسم اللعبة: ${validationResult.errors.canonicalName || validationResult.errors.name}`)
          errorSteps.push(1)
        }
        if (validationResult.errors.country) {
          errorMessages.push(`❌ الدولة: ${validationResult.errors.country}`)
          errorSteps.push(1)
        }
        if (validationResult.errors.heritageField) {
          errorMessages.push(`❌ مجال التراث: ${validationResult.errors.heritageField}`)
          errorSteps.push(1)
        }
        if (validationResult.errors.gameType) {
          errorMessages.push(`❌ نوع اللعبة: ${validationResult.errors.gameType}`)
          errorSteps.push(1)
        }
        if (validationResult.errors.localNames) {
          errorMessages.push(`❌ المسميات المحلية: ${validationResult.errors.localNames}`)
          errorSteps.push(1)
        }
        if (validationResult.errors.tags) {
          errorMessages.push(`❌ التاجات: ${validationResult.errors.tags}`)
          errorSteps.push(1)
        }
        if (validationResult.errors.description) {
          errorMessages.push(`❌ الوصف الموسع: ${validationResult.errors.description}`)
          errorSteps.push(1)
        }
        
        // الخطوة 2: تفاصيل المشاركين
        if (validationResult.errors.ageGroup) {
          errorMessages.push(`❌ الفئة العمرية: ${validationResult.errors.ageGroup}`)
          errorSteps.push(2)
        }
        if (validationResult.errors.ageGroupDetails) {
          errorMessages.push(`❌ وصف الفئة العمرية: ${validationResult.errors.ageGroupDetails}`)
          errorSteps.push(2)
        }
        if (validationResult.errors.practitioners) {
          errorMessages.push(`❌ نوع الممارسين: ${validationResult.errors.practitioners}`)
          errorSteps.push(2)
        }
        if (validationResult.errors.practitionersDetails) {
          errorMessages.push(`❌ وصف الممارسين: ${validationResult.errors.practitionersDetails}`)
          errorSteps.push(2)
        }
        if (validationResult.errors.players) {
          errorMessages.push(`❌ عدد اللاعبين: ${validationResult.errors.players}`)
          errorSteps.push(2)
        }
        if (validationResult.errors.playersDetails) {
          errorMessages.push(`❌ وصف اللاعبين: ${validationResult.errors.playersDetails}`)
          errorSteps.push(2)
        }
        if (validationResult.errors.tools) {
          errorMessages.push(`❌ الأدوات: ${validationResult.errors.tools}`)
          errorSteps.push(2)
        }
        if (validationResult.errors.environment) {
          errorMessages.push(`❌ بيئة الممارسة: ${validationResult.errors.environment}`)
          errorSteps.push(2)
        }
        if (validationResult.errors.timing) {
          errorMessages.push(`❌ التوقيت: ${validationResult.errors.timing}`)
          errorSteps.push(2)
        }
        
        // الخطوة 3: القواعد
        if (validationResult.errors.rules) {
          errorMessages.push(`❌ قواعد اللعب: ${validationResult.errors.rules}`)
          errorSteps.push(3)
        }
        if (validationResult.errors.winLoss) {
          errorMessages.push(`❌ نظام الفوز والخسارة: ${validationResult.errors.winLoss}`)
          errorSteps.push(3)
        }
        if (validationResult.errors.startEnd) {
          errorMessages.push(`❌ آلية البدء والانتهاء: ${validationResult.errors.startEnd}`)
          errorSteps.push(3)
        }
        if (validationResult.errors.socialContext) {
          errorMessages.push(`❌ السياق الاجتماعي: ${validationResult.errors.socialContext}`)
          errorSteps.push(3)
        }
        if (validationResult.errors.oralTradition) {
          errorMessages.push(`❌ الموروث الشفهي: ${validationResult.errors.oralTradition}`)
          errorSteps.push(3)
        }
        
        // الخطوة 4: الوسائط
        if (validationResult.errors.references) {
          errorMessages.push(`❌ المراجع: ${validationResult.errors.references}`)
          errorSteps.push(4)
        }
        
        // إضافة أي أخطاء أخرى غير معروفة
        Object.keys(validationResult.errors).forEach(key => {
          if (!['canonicalName', 'name', 'country', 'heritageField', 'gameType', 'localNames', 'tags', 'description',
                'ageGroup', 'ageGroupDetails', 'practitioners', 'practitionersDetails', 'players', 'playersDetails',
                'tools', 'environment', 'timing', 'rules', 'winLoss', 'startEnd', 'socialContext', 'oralTradition', 'references'].includes(key)) {
            errorMessages.push(`❌ ${key}: ${validationResult.errors[key]}`)
            errorSteps.push(1)
          }
        })
        
        // تحديد الخطوة الأولى التي تحتوي على أخطاء
        const firstErrorStep = errorSteps.length > 0 ? Math.min(...errorSteps) : 1
        
        // الانتقال إلى الخطوة التي تحتوي على الخطأ
        setFormStep(firstErrorStep)
        
        // عرض رسالة مفصلة
        const errorMessage = errorMessages.length > 0 
          ? `⚠️ يوجد ${errorMessages.length} خطأ في البيانات:\n\n${errorMessages.join('\n')}\n\n📍 تم الانتقال إلى الخطوة ${firstErrorStep} لتصحيح الأخطاء.`
          : `⚠️ يوجد خطأ في البيانات. يرجى التحقق من جميع الحقول المطلوبة.\n\nالأخطاء: ${JSON.stringify(validationResult.errors, null, 2)}`
        
        alert(errorMessage)
        setIsSubmitting(false)
        return
      }
      
      // Validate rules specifically
      const rulesError = validateRules(formData.rules.filter(rule => rule.trim().length > 0))
      if (rulesError) {
        setValidationErrors(prev => ({ ...prev, rules: rulesError }))
        setFormStep(3) // الانتقال إلى خطوة القواعد
        alert(`⚠️ يوجد خطأ في قواعد اللعب:\n\n❌ ${rulesError}\n\n📍 تم الانتقال إلى الخطوة 3 لتصحيح الخطأ.`)
        setIsSubmitting(false)
        return
      }
      
      // Get country ID from database
      const countryId = await getCountryIdByName(formData.country)
      if (!countryId) {
        alert('يرجى اختيار دولة صحيحة من القائمة.')
        setIsSubmitting(false)
        return
      }
      
      // Get or create heritage field ID
      const heritageFieldId = await getOrCreateHeritageFieldId(formData.heritageField)
      
      // Get or create tag IDs
      // تحسين معالجة التاجات: دعم الفواصل العربية والإنجليزية والمسافات
      let tagsArray: string[] = []
      if (formData.tags) {
        // استبدال الفواصل العربية بفواصل إنجليزية
        const normalizedTags = formData.tags.replace(/،/g, ',')
        
        // تقسيم النص بناءً على الفواصل أو المسافات
        if (normalizedTags.includes(',')) {
          // إذا كان هناك فواصل، استخدمها للتقسيم
          tagsArray = normalizedTags.split(',')
        } else {
          // إذا لم يكن هناك فواصل، قسم بناءً على المسافات
          tagsArray = normalizedTags.split(/\s+/)
        }
        
        // تنظيف التاجات: إزالة المسافات الزائدة وعلامة # من البداية
        tagsArray = tagsArray
          .map(t => t.trim())
          .map(t => t.startsWith('#') ? t.substring(1) : t) // إزالة # من البداية
          .filter(t => t.length > 0) // إزالة العناصر الفارغة
      }
      const tagIds = await getOrCreateTagIds(tagsArray)
      
      // Prepare FormData for server action
      const formDataToSend = new FormData()
      formDataToSend.set('canonicalName', formData.name)
      formDataToSend.set('countryId', countryId)
      formDataToSend.set('region', formData.region || '')
      formDataToSend.set('heritageFieldId', heritageFieldId)
      formDataToSend.set('gameType', formData.gameType)
      formDataToSend.set('ageGroup', formData.ageGroup || '')
      formDataToSend.set('ageGroupDetails', formData.ageGroupDetails || '')
      formDataToSend.set('practitioners', formData.practitioners || '')
      formDataToSend.set('practitionersDetails', formData.practitionersDetails || '')
      formDataToSend.set('playersCount', formData.players || '')
      formDataToSend.set('playersDetails', formData.playersDetails || '')
      formDataToSend.set('environment', formData.environment || '')
      formDataToSend.set('timing', formData.timing || '')
      formDataToSend.set('description', formData.description)
      formDataToSend.set('winLossSystem', formData.winLoss || '')
      formDataToSend.set('startEndMechanism', formData.startEnd || '')
      formDataToSend.set('oralTradition', formData.oralTradition || '')
      formDataToSend.set('socialContext', formData.socialContext || '')
      
      // Convert arrays to JSON strings
      const localNamesArray = formData.localNames ? formData.localNames.split(',').map(n => n.trim()).filter(n => n) : []
      formDataToSend.set('localNames', JSON.stringify(localNamesArray))
      
      const toolsArray = formData.tools ? formData.tools.split(',').map(t => t.trim()).filter(t => t) : []
      formDataToSend.set('tools', JSON.stringify(toolsArray))
      
      const rulesArray = formData.rules.filter(rule => rule.trim().length > 0)
      formDataToSend.set('rules', JSON.stringify(rulesArray))
      
      formDataToSend.set('tagIds', JSON.stringify(tagIds))
      
      formDataToSend.set('uploadedImages', JSON.stringify(formData.uploadedImages))
      
      // Debug: Log the FormData being sent
      console.log('=== CLIENT FORM DATA DEBUG ===')
      console.log('FormData entries being sent:')
      for (const [key, value] of formDataToSend.entries()) {
        console.log(`${key}: ${value}`)
      }
      
      // Call the server action
      const result = await createGame(formDataToSend)
      
      // Defensive check for result
      if (!result) {
        console.error('Server action returned null or undefined')
        alert('❌ حدث خطأ في الخادم. لم يتم استلام رد من الخادم.')
        setIsSubmitting(false)
        return
      }
      
      if (result.success) {
        // Clear draft from localStorage
        localStorage.removeItem('game_draft')
        
        alert('✅ تم إنشاء اللعبة بنجاح كمسودة!\n\nيمكنك الآن مراجعتها ونشرها من قسم "الألعاب".')
        router.push('/dashboard/games')
      } else {
        // Show detailed error message
        let errorMsg = '❌ حدث خطأ أثناء حفظ اللعبة:\n\n'
        
        if (result.errors && Array.isArray(result.errors)) {
          errorMsg += result.errors.map(e => `• ${e.field}: ${e.message}`).join('\n')
        } else if (result.message) {
          errorMsg += result.message
        } else {
          errorMsg += 'خطأ غير معروف'
        }
        
        // Add detailed error information if available
        if (result.errorDetails) {
          // Special handling for duplicate game error
          if (result.errorType === 'DuplicateGame') {
            errorMsg += '\n\n💡 اقتراح:'
            errorMsg += `\n${result.errorDetails.suggestion || 'يرجى استخدام اسم مختلف'}`
          } else {
            errorMsg += '\n\nتفاصيل الخطأ:'
            errorMsg += `\n• ${result.errorDetails.message || 'لا توجد رسالة'}`
            if (result.errorDetails.suggestion) {
              errorMsg += `\n\n💡 ${result.errorDetails.suggestion}`
            }
          }
        }
        
        // Debug: Log the full error - with defensive checks and proper serialization
        console.error('Game creation error:', JSON.stringify(result, null, 2))
        if (result && typeof result === 'object') {
          console.error('Error details:', JSON.stringify({
            message: result.message || 'No message provided',
            errors: result.errors || [],
            errorType: result.errorType || 'Unknown',
            errorDetails: result.errorDetails || 'No details available'
          }, null, 2))
        } else {
          console.error('Error result is invalid or undefined:', result)
        }
        
        alert(errorMsg)
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      
      // Enhanced error message for different error types
      let errorMessage = '❌ حدث خطأ أثناء إرسال البيانات. يرجى المحاولة مرة أخرى.\n\n'
      
      if (error instanceof Error) {
        errorMessage += `التفاصيل: ${error.message}`
        
        // Add specific guidance for common errors
        if (error.message.includes('Network')) {
          errorMessage += '\n\n💡 تأكد من اتصالك بالإنترنت.'
        } else if (error.message.includes('timeout')) {
          errorMessage += '\n\n⏰ انتهت مهلة الاتصال. حاول مرة أخرى.'
        } else if (error.message.includes('validation')) {
          errorMessage += '\n\n✅ تحقق من صحة البيانات المدخلة.'
        }
      } else {
        errorMessage += 'خطأ غير معروف'
      }
      
      console.error('Form submission error details:', {
        error: error,
        errorType: error?.constructor?.name,
        timestamp: new Date().toISOString()
      })
      
      alert(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative max-w-5xl mx-auto">
      {/* Template Modal */}
      {showTemplateModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => setShowTemplateModal(false)}
        >
          <div
            className="flex max-h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 bg-surface-muted p-6">
              <div>
                <h3 className="flex items-center gap-2 text-xl font-bold text-brand-deepest">
                  <TableIcon className="h-5 w-5 text-accent" /> الجدول النموذجي
                  للبيانات
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  استخدم هذه الحقول والصيغ لضمان استيراد دقيق للمعلومات.
                </p>
              </div>
              <button onClick={() => setShowTemplateModal(false)}>
                <X className="h-6 w-6 text-gray-400 hover:text-brand-deepest" />
              </button>
            </div>
            <div className="overflow-y-auto p-0">
              {/* طريقة الاستيراد المثلى */}
              <div className="border-b border-gray-200 bg-blue-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                    📝
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-deepest">النص المنظم - الطريقة المثلى</h4>
                    <p className="text-sm text-gray-600">هذه الطريقة هي الأفضل للبيانات العربية حيث تحافظ على التنسيق والترقيم.</p>
                  </div>
                </div>
              </div>
              
              <table className="w-full border-collapse text-right">
                <thead className="sticky top-0 z-10 bg-brand-deepest text-sm font-bold text-white">
                  <tr>
                    <th className="w-1/4 border-l border-brand-deep px-6 py-4">
                      اسم الحقل (للاستيراد)
                    </th>
                    <th className="w-3/4 px-6 py-4">مثال (لعبة الركض بالحاجبين)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {templateData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-surface-muted">
                      <td className="select-all border-l border-gray-100 bg-gray-50 px-6 py-4 align-top font-bold text-brand-deepest">
                        {row.field}
                      </td>
                      <td className="whitespace-pre-wrap px-6 py-4 align-top leading-relaxed text-gray-600">
                        {row.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {/* أمثلة الاستيراد الكاملة */}
              <div className="border-t border-gray-200 p-6 bg-gray-50">
                <h4 className="font-bold text-brand-deepest mb-3">📝 مثال كامل للاستيراد (النص المنظم)</h4>
                <div className="bg-white border border-gray-300 rounded-lg p-4 font-mono text-sm">
                  <pre className="whitespace-pre-wrap">
{`اسم اللعبة: الركض بالحاجبين المرفوعين
المسميات المحلية: سباق المبهّتين، لعبة العيون الكبار
الدولة: دولة قطر
الإقليم: الفرجان القديمة (الدوحة، الوكرة، الخور)
مجال التراث: الألعاب الشعبية - الممارسات الاجتماعية والطقوس
نوع اللعبة: فكاهة / حركية / سباق معوقات جسدية
تاجات التصنيف: #تراث_خليجي، #ألعاب_طريفة، #ألعاب_حركية
الفئة العمرية: 9 - 12 سنة (الطفولة المتوسطة)
وصف الفئة العمرية: العمر الذي يمتلك فيه الطفل القدرة على 'فصل الحواس'
الممارسون: مختلط (ذكور وإناث)
وصف الممارسين: لعبة مقبولة اجتماعياً للجنسين
عدد اللاعبين: 3 - 10 لاعبين (سباق جماعي)
وصف اللاعبين: يبدأ من 3 أطفال، والعدد الكبير يزيد من صعوبة اللعبة
الأدوات: لا يوجد (الجسد فقط)
المكان: السكيك (الأزقة) أو الحوي
الوقت: النهار (العصر)
الوصف الموسع: تمرين في 'فصل الحواس' يكسر الفطرة البشرية
قواعد اللعب:
1. يصطف المتسابقون عند خط البداية
2. وضع الاستعداد: رفع الحواجب لأقصى حد
3. الركض بسرعة قصوى دون إنزال الحاجبين
4. المراقبة: من يخفض حاجبيه يُستبعد
5. الفوز لمن يصل خط النهاية أولاً وحواجبه مرفوعة
نظام الفوز والخسارة:
الفوز: يعتمد على السرعة والتحكم العضلي
الخسارة: غالباً ما تحدث بسبب الضحك
آلية البدء والانتهاء:
البدء: بالقرعة وتفتيش 'جاهزية الوجوه'
الانتهاء: بوصول أول متسابق
الموروث الشفهي: صيحات تشويش مثل: 'نزلت! نزلت!'
السياق الاجتماعي:
1. ضبط النفس (Self-Control) والرزانة
2. الذكاء العاطفي وفصل الجهد البدني
3. الترفيه الجماعي وكسر الجليد
المراجع:
1. سلسلة الألعاب الشعبية القطرية - كتارا
2. التراث الشعبي في قطر - مركز التراث الشعبي`}</pre>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  يمكنك نسخ هذا النص بالكامل ولصقه في حقل الاستيراد.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => setShowImportModal(false)}
        >
          <div
            className="w-full max-w-3xl rounded-2xl border border-gray-200 bg-white p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-xl font-bold text-brand-deepest">
                <Wand2 className="h-5 w-5 text-accent" /> استيراد بيانات اللعبة
              </h3>
              <button onClick={() => setShowImportModal(false)}>
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>
            
            <div className="mb-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                    📝
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-deepest">النص المنظم - الطريقة المثلى</h4>
                    <p className="text-sm text-gray-600">هذه الطريقة هي الأفضل للبيانات العربية حيث تحافظ على التنسيق والترقيم.</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* مثال النص المنظم */}
            <div className="mb-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-bold text-brand-deepest text-sm mb-2">📝 مثال النص المنظم</h4>
                <p className="text-xs text-gray-500 mb-2">يمكنك نسخ هذا المثال وتعديله:</p>
                <code className="text-xs bg-gray-50 p-3 block rounded mt-1 font-mono whitespace-pre-wrap">
اسم اللعبة: الركض بالحاجبين المرفوعين
الدولة: دولة قطر
قواعد اللعب:
1. يصطف المتسابقون عند خط البداية
2. وضع الاستعداد: رفع الحواجب لأقصى حد
3. الركض بسرعة قصوى دون إنزال الحاجبين
                </code>
              </div>
            </div>
            
            <p className="mb-4 text-sm text-gray-500">
              قم بنسخ ولصق تفاصيل اللعبة هنا (تنسيق النص المنظم). سيقوم النظام بالتعرف على الحقول
              وتعبئتها تلقائياً.
            </p>
            <Textarea
              className="mb-6 h-64 font-mono"
              placeholder={`مثال النص المنظم:\nاسم اللعبة: الركض بالحاجبين المرفوعين\nالدولة: دولة قطر\nقواعد اللعب:\n1. يصطف المتسابقون عند خط البداية.\n2. وضع الاستعداد: رفع الحواجب لأقصى حد.\n3. الركض بسرعة قصوى دون إنزال الحاجبين.`}
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
            />
            <div className="flex justify-end gap-4">
              <Button variant="ghost" onClick={() => setShowImportModal(false)}>
                إلغاء
              </Button>
              <Button onClick={handleSmartImport}>
                تحليل واستيراد البيانات
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-4 duration-300">
          <div className="bg-emerald-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">تم حفظ المسودة بنجاح ✓</span>
          </div>
        </div>
      )}

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
              <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-4xl font-bold text-brand-deepest">
                  إضافة لعبة جديدة
                </h2>
                <p className="text-gray-600 mt-1">
                  يرجى تعبئة الحقول بدقة لضمان جودة الأرشفة
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Button
              variant="outline"
              onClick={handleSaveDraft}
              disabled={isSaving}
              className="gap-2 border-green-300 text-green-700 hover:bg-green-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  جاري الحفظ...
                </>
              ) : saveStatus === 'saved' ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  تم الحفظ
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  حفظ كمسودة
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowTemplateModal(true)}
              className="border-indigo-300 text-indigo-700 hover:bg-indigo-50"
            >
              <TableIcon className="h-4 w-4 ml-1" /> الجدول النموذجي
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowImportModal(true)}
              className="border-purple-300 text-purple-700 hover:bg-purple-50"
            >
              <Wand2 className="h-4 w-4 ml-1" /> استيراد من نص
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
        <StepIndicator
          step={1}
          currentStep={formStep}
          icon={FileText}
          label="البيانات الأساسية"
          hasError={getStepErrors(1)}
        />
        <StepIndicator
          step={2}
          currentStep={formStep}
          icon={Users}
          label="المشاركون والبيئة"
          hasError={getStepErrors(2)}
        />
        <StepIndicator
          step={3}
          currentStep={formStep}
          icon={Target}
          label="آلية اللعب"
          hasError={getStepErrors(3)}
        />
        <StepIndicator
          step={4}
          currentStep={formStep}
          icon={ImageIcon}
          label="الوسائط والمجتمع"
          hasError={getStepErrors(4)}
        />
      </div>

      <div className="grid items-start gap-8 lg:grid-cols-3">
        {/* Form */}
        <div className="space-y-6 lg:col-span-2">
          {/* Error Banner */}
          {Object.keys(validationErrors).length > 0 && getStepErrors(formStep) && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg animate-in slide-in-from-top-2">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-red-800 mb-2">
                    ⚠️ يوجد أخطاء في هذه الخطوة
                  </h4>
                  <ul className="text-xs text-red-700 space-y-1">
                    {formStep === 1 && (
                      <>
                        {validationErrors.name && <li>• اسم اللعبة: {validationErrors.name}</li>}
                        {validationErrors.country && <li>• الدولة: {validationErrors.country}</li>}
                        {validationErrors.description && <li>• الوصف: {validationErrors.description}</li>}
                      </>
                    )}
                    {formStep === 2 && (
                      <>
                        {validationErrors.ageGroup && <li>• الفئة العمرية: {validationErrors.ageGroup}</li>}
                        {validationErrors.practitioners && <li>• الممارسون: {validationErrors.practitioners}</li>}
                        {validationErrors.players && <li>• عدد اللاعبين: {validationErrors.players}</li>}
                      </>
                    )}
                    {formStep === 3 && (
                      <>
                        {validationErrors.rules && <li>• قواعد اللعب: {validationErrors.rules}</li>}
                      </>
                    )}
                    {formStep === 4 && (
                      <>
                        {validationErrors.references && <li>• المراجع: {validationErrors.references}</li>}
                        {validationErrors.socialContext && <li>• السياق الاجتماعي: {validationErrors.socialContext}</li>}
                      </>
                    )}
                  </ul>
                  <p className="text-xs text-red-600 mt-2 font-medium">
                    👇 قم بتصحيح الأخطاء أدناه قبل المتابعة
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Step 1: Basic Info */}
          {formStep === 1 && (
            <FormSection title="البيانات التعريفية">
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
                  <label className="text-sm font-bold text-brand-deepest">
                    الدولة
                  </label>
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
                  <label className="text-sm font-bold text-brand-deepest">
                    مجال التراث
                  </label>
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
                  <label className="text-sm font-bold text-brand-deepest">
                    تاجات التصنيف
                  </label>
                  <Input
                    placeholder="افصل بين التاجات بفاصلة..."
                    value={formData.tags}
                    onChange={(e) => updateField('tags', e.target.value)}
                  />
                </div>
                 <div className="col-span-full space-y-2">
                   <div className="flex items-center justify-between">
                     <label className="text-sm font-bold text-brand-deepest">
                       الوصف الموسع
                     </label>
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
            </FormSection>
          )}

          {/* Step 2: Participants & Environment */}
          {formStep === 2 && (
            <FormSection title="تفاصيل المشاركين وبيئة اللعب">
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
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-brand-deepest">
                      عدد اللاعبين
                    </label>
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
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-brand-deepest">
                      المكان
                    </label>
                    <Input
                      placeholder="مثال: السكيك (الأزقة) أو الحوي"
                      value={formData.environment}
                      onChange={(e) => updateField('environment', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-brand-deepest">
                      الوقت
                    </label>
                    <Input
                      placeholder="مثال: النهار (العصر)"
                      value={formData.timing}
                      onChange={(e) => updateField('timing', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </FormSection>
          )}

          {/* Step 3: Gameplay Rules */}
          {formStep === 3 && (
            <FormSection title="القواعد وآلية اللعب">
              <div className="space-y-6">
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
                         className={`h-12 min-h-0 resize-none ${validationErrors.rules ? 'border-red-500' : ''}`}
                         value={rule}
                         onChange={(e) => updateRule(i, e.target.value)}
                         placeholder={`القاعدة ${i + 1}...`}
                       />
                     </div>
                   ))}
                   {validationErrors.rules && (
                     <div className="flex items-center gap-1 text-red-600 text-xs">
                       <AlertCircle className="w-3 h-3" />
                       <span>{validationErrors.rules}</span>
                     </div>
                   )}
                   <p className="text-xs text-gray-400">
                     يجب أن تحتوي كل قاعدة على الأقل 10 أحرف ولا تتجاوز 1000 حرف.
                   </p>
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
              </div>
            </FormSection>
          )}

          {/* Step 4: Media & Social Context */}
          {formStep === 4 && (
            <FormSection title="الموروث الشفهي والوسائط">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-brand-deepest">
                    السياق الاجتماعي
                  </label>
                  <Textarea
                    placeholder="مثال: ضبط النفس، الذكاء العاطفي..."
                    value={formData.socialContext}
                    onChange={(e) => updateField('socialContext', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-brand-deepest">
                    أهازيج ومصطلحات
                  </label>
                  <Textarea
                    className="h-20"
                    placeholder="اكتب الصيحات أو الأغاني المرافقة..."
                    value={formData.oralTradition}
                    onChange={(e) => updateField('oralTradition', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-brand-deepest">
                    المصادر والمراجع
                  </label>
                  <Textarea
                    className="h-20"
                    placeholder="مثال: سلسلة الألعاب الشعبية القطرية - كتارا"
                    value={formData.references}
                    onChange={(e) => updateField('references', e.target.value)}
                  />
                </div>
                 <div className="space-y-4">
                   <div className="space-y-2">
                     <label className="text-sm font-bold text-brand-deepest mb-2 block">
                       صور توضيحية للعبة
                     </label>
                     
                     {/* خيار 1: رفع الصور من الكمبيوتر - Cloudinary */}
                     <div className="rounded-lg border border-green-200 bg-green-50 p-4 space-y-3">
                       <div className="flex items-center gap-2">
                         <UploadCloud className="h-4 w-4 text-green-700" />
                         <h4 className="text-sm font-bold text-green-900">رفع من الكمبيوتر (Cloudinary)</h4>
                       </div>
                       <CloudinaryUploadButton
                         onUploadComplete={(url) => {
                           setFormData(prev => ({
                             ...prev,
                             uploadedImages: [...prev.uploadedImages, url]
                           }))
                         }}
                       onUploadError={handleImageUploadError}
                       buttonText="رفع صورة من الكمبيوتر"
                       maxFiles={5}
                       />
                       <p className="text-xs text-green-700">
                         ✅ يستخدم Cloudinary (مجاني حتى 25GB) - جاهز للاستخدام!
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
                                 onClick={() => removeUploadedImage(index)}
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
                       {formData.name.trim() && (
                         <span className="block mt-1 text-accent">
                           💡 يمكنك استخدام زر "ملء تلقائي" لإنشاء تسمية بناءً على اسم اللعبة.
                         </span>
                       )}
                     </p>
                   </div>
                 </div>
              </div>
            </FormSection>
          )}

           {/* Navigation */}
           <div className="flex justify-between items-center pt-8 border-t border-gray-100">
             {formStep > 1 ? (
               <Button 
                 variant="outline" 
                 onClick={() => setFormStep((p) => p - 1)}
                 className="gap-2"
               >
                 <ArrowRight className="h-4 w-4" />
                 السابق
               </Button>
             ) : (
               <div />
             )}
             {formStep < 4 ? (
               <Button 
                 onClick={() => {
                 // Validate current step before proceeding
                 if (formStep === 1) {
                   const nameError = validateGameName(formData.name)
                   const descriptionError = validateDescription(formData.description)
                   
                   if (nameError || descriptionError) {
                     const errors: Record<string, string> = {}
                     if (nameError) errors.name = nameError
                     if (descriptionError) errors.description = descriptionError
                     setValidationErrors(errors)
                     
                     // Improved error message
                     const errorList = Object.values(errors).join('\n• ')
                     alert(`⚠️ يرجى تصحيح الأخطاء التالية:\n\n• ${errorList}`)
                     return
                   }
                 }
                 
                 if (formStep === 3) {
                   const rulesError = validateRules(formData.rules.filter(rule => rule.trim().length > 0))
                   if (rulesError) {
                     setValidationErrors(prev => ({ ...prev, rules: rulesError }))
                     alert('⚠️ يوجد أخطاء في قواعد اللعب:\n\n• ' + rulesError)
                     return
                   }
                 }
                 
                 setFormStep((p) => p + 1)
               }}
               className="gap-2"
               >
                 التالي
                 <ArrowLeft className="h-4 w-4" />
               </Button>
             ) : (
               <Button 
                 onClick={handleSubmit} 
                 disabled={isSubmitting}
                 className="gap-2 bg-brand hover:bg-brand-deep"
               >
                 {isSubmitting ? (
                   <>
                     <Loader2 className="h-4 w-4 animate-spin" />
                     جاري الإرسال...
                   </>
                 ) : (
                   <>
                     <FileCheck className="h-4 w-4" />
                     حفظ وإرسال للمراجعة
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
                    <p className="text-xs mt-1">اكتب الاسم الشائع في المنطقة، واستخدم الأقواس للمسميات البديلة مثل: الطاب (أو التاب)</p>
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
                    <strong className="text-brand-deepest">الاستيراد الذكي:</strong>
                    <p className="text-xs mt-1">استخدم خاصية "استيراد من نص" لنسخ بيانات منسقة بسرعة من مصادر خارجية</p>
                  </div>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-500 mt-0.5" />
                  <div>
                    <strong className="text-brand-deepest">المراجع والمصادر:</strong>
                    <p className="text-xs mt-1">أضف مراجع موثوقة لتعزيز مصداقية التوثيق (كتب، دراسات، شهادات شفهية)</p>
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
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
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
