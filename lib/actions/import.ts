'use server'

import { normalizeCountryName, parseRulesToArray } from '@/lib/utils'
import type { ParsedImportData } from '@/types'
import { validateCSVRow, validateJSONData, validateBulkImport } from '@/lib/utils/import-validation'

// Field mapping configuration for Arabic text parsing
const fieldMappings = [
  { key: 'name', patterns: ['اسم اللعبة', 'الاسم الرسمي', 'اسم اللعبة الرسمي'] },
  { key: 'localNames', patterns: ['المسميات المحلية', 'بديلة', 'أسماء أخرى'] },
  { key: 'country', patterns: ['الدولة'] },
  { key: 'region', patterns: ['الإقليم', 'نطاق الانتشار'] },
  { key: 'heritageField', patterns: ['مجال التراث'] },
  { key: 'tags', patterns: ['تاجات التصنيف', 'الوسوم', 'نوع اللعبة'] },
  { key: 'description', patterns: ['الوصف الموسع', 'شرح اللعبة', 'نبذة'] },
  { key: 'ageGroup', patterns: ['الفئة العمرية'] },
  { key: 'ageGroupDetails', patterns: ['وصف الفئة العمرية', 'الفئة العمرية (تفاصيل)'] },
  { key: 'practitioners', patterns: ['الممارسون', 'نوع الممارسين'] },
  { key: 'practitionersDetails', patterns: ['وصف الممارسين', 'نوع الممارسين (تفاصيل)'] },
  { key: 'playersCount', patterns: ['عدد اللاعبين'] },
  { key: 'playersDetails', patterns: ['وصف اللاعبين', 'عدد اللاعبين (تفاصيل)'] },
  { key: 'tools', patterns: ['الأدوات', 'الأدوات والمستلزمات'] },
  { key: 'environment', patterns: ['بيئة الممارسة', 'المكان'] },
  { key: 'timing', patterns: ['التوقيت', 'الزمان', 'الوقت'] },
  { key: 'rules', patterns: ['قواعد اللعب', 'طريقة اللعب'] },
  { key: 'winLossSystem', patterns: ['نظام الفوز والخسارة', 'الفوز والخسارة'] },
  { key: 'startEndMechanism', patterns: ['آلية البدء والانتهاء', 'البدء والانتهاء'] },
  { key: 'oralTradition', patterns: ['الموروث الشفهي', 'أهازيج', 'أهازيج ومصطلحات'] },
  { key: 'socialContext', patterns: ['السياق الاجتماعي', 'القيم الاجتماعية'] },
  { key: 'references', patterns: ['المراجع', 'المصادر والمراجع', 'المصادر', 'قائمة المراجع'] },
] as const

/**
 * Parse Arabic text and extract structured game data
 * Supports various formats: bullet points, paragraphs, tables
 */
export async function parseArabicText(text: string): Promise<{
  success: boolean
  data?: ParsedImportData
  errors?: string[]
}> {
  try {
    if (!text.trim()) {
      return { success: false, errors: ['النص فارغ'] }
    }

    const lines = text.split(/\r?\n/)
    const mappedData: Record<string, string> = {}
    let currentKey: string | null = null
    let rulesBuffer: string[] = []

    // Helper to match line to field key
    const matchLineToKey = (line: string) => {
      for (const mapping of fieldMappings) {
        for (const pattern of mapping.patterns) {
          // Check if line starts with pattern (with optional colon/tab/space after)
          if (line.startsWith(pattern + '\t') || line.startsWith(pattern + ':') || 
              line.startsWith(pattern + ' :') || line.startsWith(pattern + ' ')) {
            // Extract content after pattern
            const content = line.substring(pattern.length).replace(/^[\s\t:،]+/, '').trim()
            return { key: mapping.key, content }
          }
          
          // Also try regex for more complex patterns
          const escapedPattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
          const regex = new RegExp(
            `^[\\-•*]?\\s*${escapedPattern}(\\s*\\(.*?\\))?\\s*[:\\-–\\/\\t,،]*\\s*`,
            'i'
          )
          if (regex.test(line)) {
            return { key: mapping.key, content: line.replace(regex, '').trim() }
          }
        }
      }
      return null
    }

    // Process each line
    lines.forEach((line) => {
      const trimmed = line.trim()
      if (!trimmed) return

      const match = matchLineToKey(trimmed)

      if (match) {
        // Found a new field
        currentKey = match.key
        if (currentKey === 'rules') {
          rulesBuffer = []
          if (match.content) rulesBuffer.push(match.content)
        } else if (currentKey === 'country') {
          // Normalize country name
          mappedData[currentKey] = normalizeCountryName(match.content)
        } else {
          mappedData[currentKey] = match.content
        }
      } else if (currentKey) {
        // Continue previous field
        if (currentKey === 'rules') {
          rulesBuffer.push(trimmed)
        } else {
          mappedData[currentKey] = (mappedData[currentKey] || '') + '\n' + trimmed
        }
      }
    })

    // Process rules buffer
    if (rulesBuffer.length > 0) {
      // Convert to atomic rules array
      const atomicRules = parseRulesToArray(rulesBuffer.join('\n'))
      mappedData.rules = JSON.stringify(atomicRules)
    }

    // Build parsed data object
    const parsedData: ParsedImportData = {
      name: mappedData.name?.trim(),
      localNames: mappedData.localNames?.trim(),
      country: mappedData.country?.trim(),
      region: mappedData.region?.trim(),
      heritageField: mappedData.heritageField?.trim(),
      tags: mappedData.tags?.trim(),
      description: mappedData.description?.trim(),
      ageGroup: mappedData.ageGroup?.trim(),
      ageGroupDetails: mappedData.ageGroupDetails?.trim(),
      practitioners: mappedData.practitioners?.trim(),
      practitionersDetails: mappedData.practitionersDetails?.trim(),
      playersCount: mappedData.playersCount?.trim(),
      playersDetails: mappedData.playersDetails?.trim(),
      tools: mappedData.tools?.trim(),
      environment: mappedData.environment?.trim(),
      timing: mappedData.timing?.trim(),
      rules: mappedData.rules ? JSON.parse(mappedData.rules) : undefined,
      winLossSystem: mappedData.winLossSystem?.trim(),
      startEndMechanism: mappedData.startEndMechanism?.trim(),
      oralTradition: mappedData.oralTradition?.trim(),
      socialContext: mappedData.socialContext?.trim(),
      references: mappedData.references?.trim(),
    }

    return { success: true, data: parsedData }
  } catch (error) {
    console.error('Error parsing Arabic text:', error)
    return {
      success: false,
      errors: ['حدث خطأ أثناء تحليل النص'],
    }
  }
}

/**
 * Validate imported data before saving
 */
export async function validateImportData(data: ParsedImportData): Promise<{
  valid: boolean
  errors: string[]
  warnings: string[]
}> {
  const errors: string[] = []
  const warnings: string[] = []

  // Required fields
  if (!data.name) {
    errors.push('اسم اللعبة مطلوب')
  }
  if (!data.country) {
    errors.push('الدولة مطلوبة')
  }
  if (!data.description) {
    errors.push('الوصف مطلوب')
  }
  if (!data.rules || data.rules.length === 0) {
    errors.push('قواعد اللعب مطلوبة')
  }

  // Warnings for missing recommended fields
  if (!data.heritageField) {
    warnings.push('يُنصح بإضافة مجال التراث')
  }
  if (!data.localNames) {
    warnings.push('يُنصح بإضافة المسميات المحلية')
  }
  if (!data.references) {
    warnings.push('يُنصح بإضافة المصادر والمراجع')
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  }
}

/**
 * Convert parsed import data to database-ready format
 */
export async function convertParsedToGameData(parsedData: ParsedImportData, db: any): Promise<{
  success: boolean
  gameData?: any
  errors?: string[]
}> {
  try {
    // Find country by name
    let countryId = ''
    if (parsedData.country) {
      const country = await db.country.findFirst({
        where: { 
          name: { 
            contains: parsedData.country,
            mode: 'insensitive'
          } 
        }
      })
      if (country) {
        countryId = country.id
      } else {
        return {
          success: false,
          errors: [`الدولة "${parsedData.country}" غير موجودة في قاعدة البيانات`]
        }
      }
    }

    // Find heritage field by name
    let heritageFieldId = ''
    if (parsedData.heritageField) {
      const heritageField = await db.heritageField.findFirst({
        where: { 
          name: { 
            contains: parsedData.heritageField,
            mode: 'insensitive'
          } 
        }
      })
      if (heritageField) {
        heritageFieldId = heritageField.id
      } else {
        return {
          success: false,
          errors: [`مجال التراث "${parsedData.heritageField}" غير موجود في قاعدة البيانات`]
        }
      }
    }

    // Process local names
    const localNames = parsedData.localNames 
      ? parsedData.localNames.split(/[،,]/).map((name: string) => name.trim()).filter(Boolean)
      : []

    // Process tools
    const tools = parsedData.tools
      ? parsedData.tools.split(/[،,]/).map((tool: string) => tool.trim()).filter(Boolean)
      : []

    // Process tags from text
    const tagIds: string[] = []
    if (parsedData.tags) {
      const tagNames = parsedData.tags.split(/[،,]/).map((tag: string) => tag.trim()).filter(Boolean)
      for (const tagName of tagNames) {
        const tag = await db.tag.findFirst({
          where: { 
            name: { 
              contains: tagName.replace('#', ''),
              mode: 'insensitive'
            } 
          }
        })
        if (tag) {
          tagIds.push(tag.id)
        }
      }
    }

    // Create slug from canonical name
    function createSlug(name: string): string {
      return name
        .replace(/[^\u0600-\u06FF\s]/g, '')
        .replace(/\s+/g, '-')
        .toLowerCase()
    }

    const gameData = {
      canonicalName: parsedData.name || '',
      localNames,
      slug: parsedData.name ? createSlug(parsedData.name) : '',
      countryId,
      region: parsedData.region || '',
      heritageFieldId,
      gameType: parsedData.tags?.includes('قرعة') ? 'ذهنية' : 
                parsedData.tags?.includes('حركية') ? 'حركية' : 'شعبية',
      ageGroup: parsedData.ageGroup || '',
      practitioners: parsedData.practitioners || '',
      playersCount: parsedData.playersCount || '',
      tools,
      environment: parsedData.environment || '',
      timing: parsedData.timing || '',
      description: parsedData.description || '',
      rules: parsedData.rules || [],
      winLossSystem: parsedData.winLossSystem || '',
      startEndMechanism: parsedData.startEndMechanism || '',
      oralTradition: parsedData.oralTradition || '',
      socialContext: parsedData.socialContext || '',
      tagIds
    }

    return {
      success: true,
      gameData
    }
  } catch (error) {
    console.error('Error converting parsed data:', error)
    return {
      success: false,
      errors: ['حدث خطأ أثناء تحويل البيانات']
    }
  }
}

/**
 * Extract tags from text
 */
export async function extractTags(text: string): Promise<string[]> {
  const tags: string[] = []

  // Match hashtags
  const hashtagRegex = /#([\u0600-\u06FF\w_]+)/g
  let match
  while ((match = hashtagRegex.exec(text)) !== null) {
    tags.push(match[1])
  }

  // Common game type keywords
  const keywords = [
    'حركية', 'ذهنية', 'طريفة', 'بحرية', 'شعبية',
    'خليجي', 'عراقي', 'مصري', 'شامي', 'مغاربي',
    'أطفال', 'ذكور', 'إناث', 'مختلطة', 'جماعية'
  ]

  keywords.forEach(keyword => {
    if (text.includes(keyword) && !tags.includes(keyword)) {
      tags.push(keyword)
    }
  })

  return tags
}

/**
 * Validate and process CSV import data
 */
export async function validateCSVImport(csvData: any[]): Promise<{
  success: boolean
  validData: any[]
  errors: Array<{ index: number; errors: any[] }>
  summary: {
    total: number
    valid: number
    invalid: number
    successRate: number
  }
}> {
  const validation = validateBulkImport(csvData, 'csv')
  
  const validData = validation.results
    .filter(result => result.valid)
    .map(result => result.data)
  
  const errors = validation.results
    .filter(result => !result.valid)
    .map(result => ({
      index: result.index,
      errors: result.errors || []
    }))
  
  return {
    success: validation.summary.invalid === 0,
    validData,
    errors,
    summary: validation.summary
  }
}

/**
 * Validate and process JSON import data
 */
export async function validateJSONImport(jsonData: any[]): Promise<{
  success: boolean
  validData: any[]
  errors: Array<{ index: number; errors: any[] }>
  summary: {
    total: number
    valid: number
    invalid: number
    successRate: number
  }
}> {
  const validation = validateBulkImport(jsonData, 'json')
  
  const validData = validation.results
    .filter(result => result.valid)
    .map(result => result.data)
  
  const errors = validation.results
    .filter(result => !result.valid)
    .map(result => ({
      index: result.index,
      errors: result.errors || []
    }))
  
  return {
    success: validation.summary.invalid === 0,
    validData,
    errors,
    summary: validation.summary
  }
}

/**
 * Generate import template for users
 */
export async function generateImportTemplate(format: 'csv' | 'json'): Promise<{
  success: boolean
  template: string
  instructions: string[]
}> {
  const sampleData = {
    canonicalName: 'الركض بالحاجبين المرفوعين',
    localNames: ['سباق المبهّتين', 'لعبة العيون الكبار'],
    slug: 'الركض-بالحاجبين-المرفوعين',
    countryId: 'country_id_here',
    region: 'الفرجان القديمة',
    gameType: 'فكاهة / حركية',
    ageGroup: '9 - 12 سنة',
    practitioners: 'مختلط',
    playersCount: '3 - 10 لاعبين',
    tools: ['لا يوجد (الجسد فقط)'],
    environment: 'السكيك (الأزقة)',
    timing: 'النهار (العصر)',
    description: 'وصف تفصيلي للعبة (100 حرف على الأقل)...',
    rules: ['قاعدة 1', 'قاعدة 2', 'قاعدة 3'],
    winLossSystem: 'نظام الفوز...',
    startEndMechanism: 'آلية البدء...',
    oralTradition: 'صيحات...',
    socialContext: 'سياق اجتماعي...',
    reviewStatus: 'draft'
  }
  
  let template = ''
  const instructions = [
    'يجب أن يحتوي الاسم الأساسي على حروف عربية فقط',
    'الرابط الثابت يجب أن يحتوي على حروف صغيرة وأرقام وشرطات فقط',
    'معرف الدولة يجب أن يكون موجوداً في قاعدة البيانات',
    'الوصف يجب أن يكون 100 حرف على الأقل',
    'يجب أن تحتوي القواعد على قاعدتين على الأقل'
  ]
  
  if (format === 'csv') {
    const headers = Object.keys(sampleData).join(',')
    const values = Object.values(sampleData).map(val => 
      Array.isArray(val) ? `"${val.join(',')}"` : `"${val}"`
    ).join(',')
    template = `${headers}\n${values}`
  } else {
    template = JSON.stringify([sampleData], null, 2)
  }
  
  return {
    success: true,
    template,
    instructions
  }
}
