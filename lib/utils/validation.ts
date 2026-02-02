// Validation utilities for Traditional Games Glossary
// أدوات التحقق من صحة البيانات لمعجم الألعاب التراثية

import { z } from 'zod'

// ==================== VALIDATION SCHEMAS ====================

// Game validation schema (client-side version)
export const GameValidationSchema = z.object({
  canonicalName: z.string()
    .min(1, 'اسم اللعبة مطلوب')
    .max(200, 'اسم اللعبة يجب ألا يتجاوز 200 حرف')
    .regex(/^[\u0600-\u06FF\s\-\.،؛:]+$/, 'اسم اللعبة يجب أن يحتوي على أحرف عربية فقط'),
  
  localNames: z.string()
    .optional()
    .transform(val => val ? val.split(',').map(s => s.trim()).filter(s => s.length > 0) : [])
    .refine(names => names.every(name => name.length <= 150), {
      message: 'كل اسم محلي يجب ألا يتجاوز 150 حرف'
    }),
  
  country: z.string()
    .min(1, 'الدولة مطلوبة'),
  
  region: z.string()
    .max(800, 'اسم الإقليم يجب ألا يتجاوز 800 حرف')
    .optional(),
  
  heritageField: z.string()
    .min(1, 'مجال التراث مطلوب')
    .max(200, 'مجال التراث يجب ألا يتجاوز 200 حرف'),
  
  gameType: z.string()
    .min(1, 'نوع اللعبة مطلوب')
    .max(100, 'نوع اللعبة يجب ألا يتجاوز 100 حرف'),
  
  ageGroup: z.string()
    .max(100, 'الفئة العمرية يجب ألا تتجاوز 100 حرف')
    .optional(),
  
  ageGroupDetails: z.string()
    .max(1500, 'وصف الفئة العمرية يجب ألا يتجاوز 1500 حرف')
    .optional(),
  
  practitioners: z.string()
    .max(100, 'نوع الممارسين يجب ألا يتجاوز 100 حرف')
    .optional(),
  
  practitionersDetails: z.string()
    .max(1500, 'وصف الممارسين يجب ألا يتجاوز 1500 حرف')
    .optional(),
  
  players: z.string()
    .max(50, 'عدد اللاعبين يجب ألا يتجاوز 50 حرف')
    .optional(),
  
  playersDetails: z.string()
    .max(1000, 'وصف اللاعبين يجب ألا يتجاوز 1000 حرف')
    .optional(),
  
  tools: z.string()
    .optional()
    .transform(val => val ? val.split(',').map(s => s.trim()).filter(s => s.length > 0) : [])
    .refine(tools => tools.every(tool => tool.length <= 200), {
      message: 'كل أداة يجب ألا تتجاوز 200 حرف'
    }),
  
  environment: z.string()
    .max(800, 'وصف المكان يجب ألا يتجاوز 800 حرف')
    .optional(),
  
  timing: z.string()
    .max(200, 'وصف الوقت يجب ألا يتجاوز 200 حرف')
    .optional(),
  
  description: z.string()
    .min(1, 'الوصف مطلوب')
    .min(50, 'الوصف يجب أن يحتوي على الأقل 50 حرف')
    .max(5000, 'الوصف يجب ألا يتجاوز 5000 حرف'),
  
  rules: z.array(z.string())
    .min(1, 'قواعد اللعب مطلوبة')
    .refine(rules => rules.every(rule => rule.length >= 10 && rule.length <= 1000), {
      message: 'كل قاعدة يجب أن تحتوي بين 10 و 1000 حرف'
    }),
  
  winLoss: z.string()
    .max(1500, 'نظام الفوز والخسارة يجب ألا يتجاوز 1500 حرف')
    .optional(),
  
  startEnd: z.string()
    .max(1500, 'آلية البدء والانتهاء يجب ألا تتجاوز 1500 حرف')
    .optional(),
  
  oralTradition: z.string()
    .max(3000, 'الموروث الشفهي يجب ألا يتجاوز 3000 حرف')
    .optional(),
  
  socialContext: z.string()
    .max(4000, 'السياق الاجتماعي يجب ألا يتجاوز 4000 حرف')
    .optional(),
  
  references: z.string()
    .max(2000, 'المراجع يجب ألا تتجاوز 2000 حرف')
    .optional(),
  
  tags: z.string()
    .optional()
    .transform(val => val ? val.split(',').map(s => s.trim()).filter(s => s.length > 0) : [])
    .refine(tags => tags.every(tag => tag.length <= 100), {
      message: 'كل وسم يجب ألا يتجاوز 100 حرف'
    })
})

// User validation schema
export const UserValidationSchema = z.object({
  name: z.string()
    .min(2, 'الاسم يجب أن يحتوي على الأقل 2 أحرف')
    .max(100, 'الاسم يجب ألا يتجاوز 100 حرف')
    .regex(/^[\u0600-\u06FF\s\-\.]+$/, 'الاسم يجب أن يحتوي على أحرف عربية فقط'),
  
  email: z.string()
    .email('البريد الإلكتروني غير صالح')
    .max(150, 'البريد الإلكتروني يجب ألا يتجاوز 150 حرف'),
  
  password: z.string()
    .min(8, 'كلمة المرور يجب أن تحتوي على الأقل 8 أحرف')
    .max(100, 'كلمة المرور يجب ألا تتجاوز 100 حرف')
    .regex(/[A-Z]/, 'كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل')
    .regex(/[a-z]/, 'كلمة المرور يجب أن تحتوي على حرف صغير واحد على الأقل')
    .regex(/[0-9]/, 'كلمة المرور يجب أن تحتوي على رقم واحد على الأقل'),
  
  institution: z.string()
    .max(200, 'اسم المؤسسة يجب ألا يتجاوز 200 حرف')
    .optional(),
  
  role: z.enum(['viewer', 'editor', 'reviewer', 'admin'])
    .default('viewer')
})

// Login validation schema
export const LoginValidationSchema = z.object({
  email: z.string()
    .email('البريد الإلكتروني غير صالح')
    .max(150, 'البريد الإلكتروني يجب ألا يتجاوز 150 حرف'),
  
  password: z.string()
    .min(1, 'كلمة المرور مطلوبة')
    .max(100, 'كلمة المرور يجب ألا تتجاوز 100 حرف')
})

// ==================== VALIDATION FUNCTIONS ====================

export type ValidationResult = {
  isValid: boolean
  errors: Record<string, string>
}

export function validateGameData(data: any): ValidationResult {
  try {
    GameValidationSchema.parse(data)
    return { isValid: true, errors: {} }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {}
      error.errors.forEach(err => {
        const field = err.path[0] as string
        errors[field] = err.message
      })
      return { isValid: false, errors }
    }
    return { isValid: false, errors: { general: 'خطأ في التحقق من صحة البيانات' } }
  }
}

export function validateUserData(data: any): ValidationResult {
  try {
    UserValidationSchema.parse(data)
    return { isValid: true, errors: {} }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {}
      error.errors.forEach(err => {
        const field = err.path[0] as string
        errors[field] = err.message
      })
      return { isValid: false, errors }
    }
    return { isValid: false, errors: { general: 'خطأ في التحقق من صحة البيانات' } }
  }
}

export function validateLoginData(data: any): ValidationResult {
  try {
    LoginValidationSchema.parse(data)
    return { isValid: true, errors: {} }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {}
      error.errors.forEach(err => {
        const field = err.path[0] as string
        errors[field] = err.message
      })
      return { isValid: false, errors }
    }
    return { isValid: false, errors: { general: 'خطأ في التحقق من صحة البيانات' } }
  }
}

// ==================== HELPER FUNCTIONS ====================

export function sanitizeArabicText(text: string): string {
  if (!text) return ''
  
  // Remove extra whitespace
  let sanitized = text.trim()
  
  // Normalize Arabic characters
  sanitized = sanitized
    .replace(/[أإآ]/g, 'ا')
    .replace(/[ؤ]/g, 'و')
    .replace(/[ئ]/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/ـ/g, '')
  
  // Remove diacritics
  sanitized = sanitized.replace(/[\u064B-\u0652\u0670]/g, '')
  
  // Remove multiple spaces
  sanitized = sanitized.replace(/\s+/g, ' ')
  
  return sanitized
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePhoneNumber(phone: string): boolean {
  const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,15}$/
  return phoneRegex.test(phone)
}

export function validateUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export function validateCoordinates(lat: number, lng: number): boolean {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180
}

// ==================== FIELD-SPECIFIC VALIDATION ====================

export function validateGameName(name: string): string | null {
  if (!name || name.trim().length === 0) {
    return 'اسم اللعبة مطلوب'
  }
  
  if (name.length > 200) {
    return 'اسم اللعبة يجب ألا يتجاوز 200 حرف'
  }
  
  // السماح بالأحرف العربية والمسافات والأقواس والعلامات الشائعة
  const arabicRegex = /^[\u0600-\u06FF\s\-\.،؛:()\[\]{}«»+/]+$/
  if (!arabicRegex.test(name)) {
    return 'اسم اللعبة يجب أن يحتوي على أحرف عربية وعلامات الترقيم فقط'
  }
  
  return null
}

export function validateDescription(description: string): string | null {
  if (!description || description.trim().length === 0) {
    return 'الوصف مطلوب'
  }
  
  if (description.length < 50) {
    return 'الوصف يجب أن يحتوي على الأقل 50 حرف'
  }
  
  if (description.length > 5000) {
    return 'الوصف يجب ألا يتجاوز 5000 حرف'
  }
  
  return null
}

export function validateRules(rules: string[]): string | null {
  if (!rules || rules.length === 0) {
    return 'قواعد اللعب مطلوبة'
  }
  
  for (const rule of rules) {
    if (rule.length < 10) {
      return 'كل قاعدة يجب أن تحتوي على الأقل 10 أحرف'
    }
    
    if (rule.length > 1000) {
      return 'كل قاعدة يجب ألا تتجاوز 1000 حرف'
    }
  }
  
  return null
}

// ==================== FORM VALIDATION UTILITIES ====================

export function getFieldError(field: string, errors: Record<string, string>): string | undefined {
  return errors[field]
}

export function hasErrors(errors: Record<string, string>): boolean {
  return Object.keys(errors).length > 0
}

export function clearFieldError(field: string, errors: Record<string, string>): Record<string, string> {
  const newErrors = { ...errors }
  delete newErrors[field]
  return newErrors
}

// ==================== EXPORT TYPES ====================

export type GameFormData = z.infer<typeof GameValidationSchema>
export type UserFormData = z.infer<typeof UserValidationSchema>
export type LoginFormData = z.infer<typeof LoginValidationSchema>