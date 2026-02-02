// Data import validation utilities
// Traditional Games Glossary - Ensuring accurate data import

import { z } from 'zod'

// Validation schemas for different import formats
export const CSVGameSchema = z.object({
  canonicalName: z.string().min(1, 'اسم اللعبة مطلوب'),
  localNames: z.string().optional().transform(val => 
    val ? val.split(',').map(s => s.trim()).filter(s => s.length > 0) : []
  ),
  slug: z.string().min(1, 'الرابط الثابت مطلوب').regex(/^[a-z0-9-]+$/, 'الرابط الثابت يجب أن يحتوي على حروف صغيرة وأرقام وشرطات فقط'),
  countryId: z.string().min(1, 'معرف الدولة مطلوب'),
  region: z.string().optional(),
  gameType: z.string().min(1, 'نوع اللعبة مطلوب'),
  ageGroup: z.string().optional(),
  ageGroupDetails: z.string().optional(), // وصف الفئة العمرية
  practitioners: z.string().optional(),
  practitionersDetails: z.string().optional(), // وصف الممارسين
  playersCount: z.string().optional(),
  playersDetails: z.string().optional(), // وصف اللاعبين
  tools: z.string().optional().transform(val => 
    val ? val.split(',').map(s => s.trim()).filter(s => s.length > 0) : []
  ),
  environment: z.string().optional(),
  timing: z.string().optional(),
  description: z.string().min(100, 'الوصف يجب أن يكون 100 حرف على الأقل'),
  rules: z.string().min(1, 'القواعد مطلوبة').transform(val => 
    val.split('|').map(s => s.trim()).filter(s => s.length > 0)
  ),
  winLossSystem: z.string().optional(),
  startEndMechanism: z.string().optional(),
  oralTradition: z.string().optional(),
  socialContext: z.string().optional(),
  reviewStatus: z.enum(['draft', 'under_review', 'published', 'rejected', 'archived']).optional().default('draft')
})

export const JSONGameSchema = z.object({
  canonicalName: z.string().min(1, 'اسم اللعبة مطلوب'),
  localNames: z.array(z.string()).optional().default([]),
  slug: z.string().min(1, 'الرابط الثابت مطلوب').regex(/^[a-z0-9-]+$/, 'الرابط الثابت يجب أن يحتوي على حروف صغيرة وأرقام وشرطات فقط'),
  countryId: z.string().min(1, 'معرف الدولة مطلوب'),
  region: z.string().optional(),
  gameType: z.string().min(1, 'نوع اللعبة مطلوب'),
  ageGroup: z.string().optional(),
  ageGroupDetails: z.string().optional(), // وصف الفئة العمرية
  practitioners: z.string().optional(),
  practitionersDetails: z.string().optional(), // وصف الممارسين
  playersCount: z.string().optional(),
  playersDetails: z.string().optional(), // وصف اللاعبين
  tools: z.array(z.string()).optional().default([]),
  environment: z.string().optional(),
  timing: z.string().optional(),
  description: z.string().min(100, 'الوصف يجب أن يكون 100 حرف على الأقل'),
  rules: z.array(z.string()).min(2, 'يجب أن تحتوي على قاعدتين على الأقل'),
  winLossSystem: z.string().optional(),
  startEndMechanism: z.string().optional(),
  oralTradition: z.string().optional(),
  socialContext: z.string().optional(),
  reviewStatus: z.enum(['draft', 'under_review', 'published', 'rejected', 'archived']).optional().default('draft')
})

// Validation functions
export function validateCSVRow(row: any) {
  try {
    const validated = CSVGameSchema.parse(row)
    return { success: true, data: validated }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message
        }))
      }
    }
    return { success: false, errors: [{ field: 'unknown', message: 'خطأ غير معروف' }] }
  }
}

export function validateJSONData(data: any) {
  try {
    const validated = JSONGameSchema.parse(data)
    return { success: true, data: validated }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message
        }))
      }
    }
    return { success: false, errors: [{ field: 'unknown', message: 'خطأ غير معروف' }] }
  }
}

// Field-specific validation functions
export function validateCanonicalName(name: string): { valid: boolean; message?: string } {
  if (!name || name.trim().length === 0) {
    return { valid: false, message: '❌ اسم اللعبة مطلوب. يرجى إدخال اسم اللعبة الرسمي.' }
  }
  
  if (name.trim().length < 3) {
    return { valid: false, message: '❌ اسم اللعبة يجب أن يحتوي على 3 أحرف على الأقل.' }
  }
  
  if (name.trim().length > 200) {
    return { valid: false, message: '❌ اسم اللعبة يجب ألا يتجاوز 200 حرف.' }
  }
  
  // Check for Arabic characters
  const arabicRegex = /[\u0600-\u06FF]/
  if (!arabicRegex.test(name)) {
    return { valid: false, message: '❌ اسم اللعبة يجب أن يحتوي على حروف عربية.' }
  }
  
  // Check for invalid characters
  const validPattern = /^[\u0600-\u06FF\s\-\.،؛:()\[\]{}«»+\/]+$/
  if (!validPattern.test(name)) {
    return { valid: false, message: '❌ اسم اللعبة يحتوي على رموز غير مسموحة. استخدم الأحرف العربية والمسافات فقط.' }
  }
  
  return { valid: true }
}

export function validateSlug(slug: string): { valid: boolean; message?: string } {
  if (!slug || slug.trim().length === 0) {
    return { valid: false, message: 'الرابط الثابت مطلوب' }
  }
  
  const slugRegex = /^[a-z0-9-]+$/
  if (!slugRegex.test(slug)) {
    return { valid: false, message: 'الرابط الثابت يجب أن يحتوي على حروف صغيرة وأرقام وشرطات فقط' }
  }
  
  return { valid: true }
}

export function validateDescription(description: string): { valid: boolean; message?: string } {
  if (!description || description.trim().length === 0) {
    return { valid: false, message: '❌ الوصف مطلوب. يرجى كتابة وصف مفصل للعبة.' }
  }
  
  if (description.trim().length < 100) {
    return { valid: false, message: '❌ الوصف يجب أن يكون 100 حرف على الأقل. حالياً لديك ' + description.trim().length + ' حرف فقط.' }
  }
  
  if (description.trim().length > 5000) {
    return { valid: false, message: '❌ الوصف يجب ألا يتجاوز 5000 حرف.' }
  }
  
  // Check for meaningful content (not just repeated characters)
  const uniqueWords = new Set(description.trim().split(/\s+/))
  if (uniqueWords.size < 10) {
    return { valid: false, message: '❌ الوصف يجب أن يحتوي على تنوع في الكلمات. حاول استخدام مفردات أكثر تنوعاً.' }
  }
  
  return { valid: true }
}

export function validateRules(rules: string[]): { valid: boolean; message?: string } {
  if (!rules || rules.length === 0) {
    return { valid: false, message: '❌ القواعد مطلوبة. يرجى إضافة قواعد اللعب.' }
  }
  
  if (rules.length < 2) {
    return { valid: false, message: '❌ يجب أن تحتوي على قاعدتين على الأقل. حالياً لديك ' + rules.length + ' قاعدة فقط.' }
  }
  
  // Check each rule is not empty and has minimum length
  for (let i = 0; i < rules.length; i++) {
    const rule = rules[i]
    if (!rule || rule.trim().length === 0) {
      return { valid: false, message: `❌ القاعدة رقم ${i + 1} لا يمكن أن تكون فارغة.` }
    }
    
    if (rule.trim().length < 10) {
      return { valid: false, message: `❌ القاعدة رقم ${i + 1} يجب أن تحتوي على 10 أحرف على الأقل. حالياً لديها ${rule.trim().length} حرف فقط.` }
    }
    
    if (rule.trim().length > 1000) {
      return { valid: false, message: `❌ القاعدة رقم ${i + 1} يجب ألا تتجاوز 1000 حرف.` }
    }
  }
  
  // Check for duplicate rules
  const uniqueRules = new Set(rules.map(rule => rule.trim()))
  if (uniqueRules.size < rules.length) {
    return { valid: false, message: '❌ يوجد قواعد مكررة. يرجى حذف القواعد المكررة.' }
  }
  
  return { valid: true }
}

// Bulk validation for import
export function validateBulkImport(data: any[], format: 'csv' | 'json') {
  const results = []
  let validCount = 0
  let invalidCount = 0
  
  for (let i = 0; i < data.length; i++) {
    const item = data[i]
    const validation = format === 'csv' ? validateCSVRow(item) : validateJSONData(item)
    
    results.push({
      index: i,
      data: item,
      valid: validation.success,
      errors: validation.success ? [] : validation.errors
    })
    
    if (validation.success) {
      validCount++
    } else {
      invalidCount++
    }
  }
  
  return {
    results,
    summary: {
      total: data.length,
      valid: validCount,
      invalid: invalidCount,
      successRate: data.length > 0 ? (validCount / data.length) * 100 : 0
    }
  }
}

// Generate sample data for testing
export function generateSampleData() {
  return {
    canonicalName: 'الركض بالحاجبين المرفوعين',
    localNames: ['سباق المبهّتين', 'لعبة العيون الكبار'],
    slug: 'الركض-بالحاجبين-المرفوعين',
    countryId: 'sample-country-id',
    region: 'الفرجان القديمة',
    gameType: 'فكاهة / حركية',
    ageGroup: '9 - 12 سنة',
    practitioners: 'مختلط',
    playersCount: '3 - 10 لاعبين',
    tools: ['لا يوجد (الجسد فقط)'],
    environment: 'السكيك (الأزقة)',
    timing: 'النهار (العصر)',
    description: 'لعبة الركض بالحاجبين المرفوعين هي تمرين في فصل الحواس. الطبيعة البشرية تميل إلى تقطيب الجبين عند الركض السريع، وهذه اللعبة تكسر هذه الفطرة بطلب الركض مع رفع الحاجبين. يخلق هذا التناقض مشهداً كوميدياً: أجساد تركض بجدية وتنافس، ووجوه جامدة تبدو وكأنها مصدومة.',
    rules: [
      'خط البداية: يصطف المتسابقون عند خط الانطلاق.',
      'وضع الاستعداد: رفع الحواجب لأقصى حد.',
      'الانطلاق: الركض بسرعة دون إنزال الحاجبين.',
      'الشرط الجزائي: من يخفض حاجبيه يُستبعد.',
      'الفوز: من يقطع خط النهاية أولاً بحواجب مرفوعة.'
    ],
    winLossSystem: 'الفوز: يعتمد على السرعة والتحكم العضلي. الخسارة: بسبب الضحك.',
    startEndMechanism: 'البدء: بالقرعة. الانتهاء: بوصول أول متسابق.',
    oralTradition: 'صيحات: "نزلت! نزلت!"، "ارفع عينك!"',
    socialContext: 'ضبط النفس، الذكاء العاطفي، الترفيه الجماعي',
    reviewStatus: 'draft'
  }
}

// Export validation rules as documentation
export const validationRules = [
  { field: 'canonicalName', required: true, minLength: 1, description: 'الاسم الأساسي للعبة بالعربية' },
  { field: 'slug', required: true, pattern: '/^[a-z0-9-]+$/', description: 'رابط URL فريد للعبة' },
  { field: 'countryId', required: true, description: 'معرف الدولة (يجب أن يكون موجوداً في قاعدة البيانات)' },
  { field: 'gameType', required: true, description: 'نوع اللعبة (حركية، ذهنية، طريفة، إلخ)' },
  { field: 'description', required: true, minLength: 100, description: 'وصف تفصيلي للعبة' },
  { field: 'rules', required: true, minItems: 2, description: 'قواعد اللعب (قاعدتين على الأقل)' },
  { field: 'localNames', required: false, description: 'أسماء بديلة للعبة' },
  { field: 'tools', required: false, description: 'الأدوات المستخدمة في اللعبة' },
  { field: 'reviewStatus', required: false, enum: ['draft', 'under_review', 'published', 'rejected', 'archived'], default: 'draft' }
]