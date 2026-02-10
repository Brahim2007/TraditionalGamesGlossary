// Utility functions for Traditional Games Glossary
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge Tailwind CSS classes with clsx
 * Handles RTL-aware class merging
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Create URL-safe slug from Arabic text
 */
export function createSlug(text: string): string {
  return text
    .replace(/[^\u0600-\u06FF\s]/g, '') // Keep Arabic letters and spaces
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .trim()
}

/**
 * Normalize country names to official Arabic format
 */
export function normalizeCountryName(name: string): string {
  const countryMap: Record<string, string> = {
    'قطر': 'دولة قطر',
    'السعودية': 'المملكة العربية السعودية',
    'الإمارات': 'الإمارات العربية المتحدة',
    'الامارات': 'الإمارات العربية المتحدة',
    'الكويت': 'دولة الكويت',
    'عمان': 'سلطنة عمان',
    'عُمان': 'سلطنة عمان',
    'البحرين': 'مملكة البحرين',
    'الأردن': 'المملكة الأردنية الهاشمية',
    'الاردن': 'المملكة الأردنية الهاشمية',
    'مصر': 'جمهورية مصر العربية',
    'اليمن': 'الجمهورية اليمنية',
    'العراق': 'جمهورية العراق',
    'تونس': 'الجمهورية التونسية',
    'الجزائر': 'الجمهورية الجزائرية',
    'المغرب': 'المملكة المغربية',
    'السودان': 'جمهورية السودان',
    'ليبيا': 'دولة ليبيا',
    'فلسطين': 'دولة فلسطين',
    'لبنان': 'الجمهورية اللبنانية',
    'سوريا': 'الجمهورية العربية السورية',
    'موريتانيا': 'الجمهورية الإسلامية الموريتانية',
    'جيبوتي': 'جمهورية جيبوتي',
    'الصومال': 'جمهورية الصومال',
    'جزر القمر': 'جزر القمر',
    'القمر': 'جزر القمر',
  }

  const matchedKey = Object.keys(countryMap).find((k) => name.includes(k))
  return matchedKey ? countryMap[matchedKey] : name
}

/**
 * Parse rules from text to atomic array
 * Supports multiple formats:
 * - Lines separated by newlines
 * - Sentences separated by period followed by Arabic letter (no space)
 * - Numbered lists (1. 2. etc)
 */
export function parseRulesToArray(text: string): string[] {
  // First, split by newlines
  let lines = text.split(/[\n\r]+/)

  // If we only got one line, try alternative splitting strategies
  if (lines.length === 1 && lines[0].length > 0) {
    // Strategy 1: Split by numbered patterns (e.g., ".2. ", ".3) ")
    // This handles: "1. قاعدة أولى.2. قاعدة ثانية.3. قاعدة ثالثة"
    const splitByNumber = lines[0].split(/\.(?=\s*\d+[\.\)\-]\s)/)
    if (splitByNumber.length > 1) {
      lines = splitByNumber
    } else {
      // Strategy 2: Split on period followed directly by Arabic letter (no space between)
      // This handles cases like: "قاعدة أولى.قاعدة ثانية.قاعدة ثالثة"
      const splitByPeriod = lines[0].split(/\.(?=[\u0600-\u06FF])/)
      if (splitByPeriod.length > 1) {
        lines = splitByPeriod
      }
    }
  }

  return lines
    .filter((line) => line.trim().length > 0)
    .map((line) => line.replace(/^(\d+[\.\-\)\s]+|[•\-\*])\s*/, '').trim())
    .filter((line) => line.length > 0) // Remove empty lines after cleanup
}

/**
 * Format date in Arabic
 */
export function formatArabicDate(date: Date): string {
  return new Intl.DateTimeFormat('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

/**
 * Format relative time in Arabic
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return 'منذ لحظات'
  }

  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `منذ ${minutes} ${minutes === 1 ? 'دقيقة' : 'دقائق'}`
  }

  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `منذ ${hours} ${hours === 1 ? 'ساعة' : 'ساعات'}`
  }

  const days = Math.floor(diffInSeconds / 86400)
  if (days === 1) {
    return 'أمس'
  }
  if (days < 7) {
    return `منذ ${days} أيام`
  }

  return formatArabicDate(date)
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

/**
 * Generate a random ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15)
}

/**
 * Parse win/loss system text to formatted lines
 * Splits "الفوز: ...الخسارة: ..." into separate lines
 */
export function parseWinLossSystem(text: string): string {
  if (!text) return ''

  // Split by الفوز/الخسارة patterns
  let result = text
    .replace(/\.(?=الفوز|الخسارة)/g, '.\n')
    .replace(/(?<=[^.\n])(?=الفوز:|الخسارة:)/g, '\n')

  return result.trim()
}

/**
 * Parse start/end mechanism text to formatted lines
 * Splits "البدء: ...الانتهاء: ..." into separate lines
 */
export function parseStartEndMechanism(text: string): string {
  if (!text) return ''

  // Split by البدء/الانتهاء patterns
  let result = text
    .replace(/\.(?=البدء|الانتهاء)/g, '.\n')
    .replace(/(?<=[^.\n])(?=البدء:|الانتهاء:)/g, '\n')

  return result.trim()
}

/**
 * Parse social context to numbered lines
 * Handles "1. ...2. ...3. ..." format
 */
export function parseSocialContext(text: string): string {
  if (!text) return ''

  // Remove quotes if present
  let cleaned = text.replace(/^[""]|[""]$/g, '').trim()

  // Split by number followed by period and Arabic text
  let result = cleaned
    .replace(/\.(?=\d+\.)/g, '.\n')
    .replace(/(?<=[^.\n])(?=\d+\.\s)/g, '\n')

  return result.trim()
}

/**
 * Parse references to separate lines
 * Handles numbered references like "1. ...2. ..."
 */
export function parseReferences(text: string): string {
  if (!text) return ''

  // Remove quotes if present
  let cleaned = text.replace(/^[""]|[""]$/g, '').trim()

  // Split by number followed by period
  let result = cleaned
    .replace(/\.(?=\d+\.)/g, '.\n')
    .replace(/(?<=[^.\n])(?=\d+\.\s)/g, '\n')

  return result.trim()
}
