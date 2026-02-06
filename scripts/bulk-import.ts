/**
 * Bulk Import Script for Traditional Games Glossary
 * سكريبت الاستيراد الجماعي للألعاب التراثية
 *
 * Usage: npx tsx scripts/bulk-import.ts <file-path>
 * Example: npx tsx scripts/bulk-import.ts data/games.txt
 *
 * File format: Arabic text with fields separated by tab, games separated by ---
 */

import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

// ==================== UTILITIES ====================

function normalizeCountryName(name: string): string {
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

function createSlug(text: string): string {
  return text
    .replace(/[^\u0600-\u06FF\s]/g, '')
    .replace(/\s+/g, '-')
    .trim()
}

function parseRulesToArray(text: string): string[] {
  let lines = text.split(/[\n\r]+/)
  if (lines.length === 1 && lines[0].length > 0) {
    const splitByPeriod = lines[0].split(/\.(?=[\u0600-\u06FF])/)
    if (splitByPeriod.length > 1) {
      lines = splitByPeriod
    }
  }
  return lines
    .filter((line) => line.trim().length > 0)
    .map((line) => line.replace(/^(\d+[\.\-\)\s]+|[•\-\*])\s*/, '').trim())
    .filter((line) => line.length > 0)
}

// ==================== FIELD MAPPINGS ====================

const fieldMappings = [
  { key: 'name', patterns: ['اسم اللعبة', 'الاسم الرسمي'] },
  { key: 'localNames', patterns: ['المسميات المحلية', 'أسماء أخرى'] },
  { key: 'country', patterns: ['الدولة'] },
  { key: 'region', patterns: ['الإقليم', 'نطاق الانتشار'] },
  { key: 'heritageField', patterns: ['مجال التراث'] },
  { key: 'gameType', patterns: ['نوع اللعبة'] },
  { key: 'tags', patterns: ['تاجات التصنيف', 'الوسوم'] },
  { key: 'description', patterns: ['الوصف الموسع', 'شرح اللعبة', 'نبذة'] },
  { key: 'ageGroup', patterns: ['الفئة العمرية'] },
  { key: 'ageGroupDetails', patterns: ['وصف الفئة العمرية'] },
  { key: 'practitioners', patterns: ['الممارسون', 'نوع الممارسين'] },
  { key: 'practitionersDetails', patterns: ['وصف الممارسين'] },
  { key: 'playersCount', patterns: ['عدد اللاعبين'] },
  { key: 'playersDetails', patterns: ['وصف اللاعبين'] },
  { key: 'tools', patterns: ['الأدوات', 'الأدوات والمستلزمات'] },
  { key: 'environment', patterns: ['بيئة الممارسة', 'المكان'] },
  { key: 'timing', patterns: ['التوقيت', 'الزمان', 'الوقت'] },
  { key: 'rules', patterns: ['قواعد اللعب', 'طريقة اللعب'] },
  { key: 'winLossSystem', patterns: ['نظام الفوز والخسارة', 'الفوز والخسارة'] },
  { key: 'startEndMechanism', patterns: ['آلية البدء والانتهاء', 'البدء والانتهاء'] },
  { key: 'oralTradition', patterns: ['الموروث الشفهي', 'أهازيج'] },
  { key: 'socialContext', patterns: ['السياق الاجتماعي', 'القيم الاجتماعية'] },
  { key: 'ethnographicMeaning', patterns: ['المعنى الإثنوغرافي للتسمية', 'المعنى الإثنوغرافي'] },
  { key: 'linguisticOrigin', patterns: ['الأصل اللغوي للتسمية', 'الأصل اللغوي'] },
  { key: 'cognitiveComplexity', patterns: ['مستوى التعقيد المعرفي', 'التعقيد المعرفي'] },
  { key: 'folkCognitiveFunction', patterns: ['الوظيفة المعرفية الشعبية', 'الوظيفة المعرفية'] },
  { key: 'references', patterns: ['المراجع', 'المصادر والمراجع', 'المصادر'] },
  { key: 'imageUrl', patterns: ['رابط الصورة', 'صورة اللعبة', 'الصورة'] },
  { key: 'imageCaption', patterns: ['تسمية الصورة', 'وصف الصورة'] },
]

// ==================== TEXT PARSER ====================

function parseGameText(text: string): Record<string, string> {
  const lines = text.split(/\r?\n/)
  const mappedData: Record<string, string> = {}
  let currentKey: string | null = null

  const matchLineToKey = (line: string) => {
    for (const mapping of fieldMappings) {
      for (const pattern of mapping.patterns) {
        // Tab-separated
        const tabIndex = line.indexOf('\t')
        if (tabIndex > -1) {
          const fieldPart = line.substring(0, tabIndex).trim()
          if (fieldPart.includes(pattern) || pattern.includes(fieldPart)) {
            return { key: mapping.key, content: line.substring(tabIndex + 1).trim() }
          }
        }
        // Colon/comma separated
        if (line.startsWith(pattern + '\t') || line.startsWith(pattern + ':') ||
            line.startsWith(pattern + ' :') || line.startsWith(pattern + ',') ||
            line.startsWith(pattern + '،')) {
          const content = line.substring(pattern.length).replace(/^[\s\t:،,]+/, '').trim()
          return { key: mapping.key, content }
        }
        // Regex fallback
        const escapedPattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        const regex = new RegExp(
          `^[\\-•*]?\\s*${escapedPattern}(\\s*\\(.*?\\))?\\s*[:\\-–\\/\\t,،]*\\s*`, 'i'
        )
        if (regex.test(line)) {
          return { key: mapping.key, content: line.replace(regex, '').trim() }
        }
      }
    }
    return null
  }

  lines.forEach((line) => {
    const trimmed = line.trim()
    if (!trimmed) return

    const match = matchLineToKey(trimmed)
    if (match) {
      currentKey = match.key
      if (currentKey === 'country') {
        mappedData[currentKey] = normalizeCountryName(match.content)
      } else {
        mappedData[currentKey] = match.content
      }
    } else if (currentKey) {
      mappedData[currentKey] = (mappedData[currentKey] || '') + '\n' + trimmed
    }
  })

  return mappedData
}

// ==================== IMPORT SINGLE GAME ====================

async function importGame(data: Record<string, string>, contributorId: string, index: number) {
  const gameName = data.name?.trim()
  if (!gameName) {
    throw new Error('اسم اللعبة مطلوب')
  }

  // Resolve country
  const countryName = data.country?.trim()
  if (!countryName) {
    throw new Error('الدولة مطلوبة')
  }

  const country = await prisma.country.findFirst({
    where: { name: { contains: countryName, mode: 'insensitive' } }
  })
  if (!country) {
    throw new Error(`الدولة "${countryName}" غير موجودة في قاعدة البيانات`)
  }

  // Resolve heritage field
  let heritageFieldId: string
  if (data.heritageField?.trim()) {
    let hf = await prisma.heritageField.findFirst({
      where: { name: { contains: data.heritageField.trim(), mode: 'insensitive' } }
    })
    if (!hf) {
      hf = await prisma.heritageField.create({
        data: {
          name: data.heritageField.trim(),
          description: data.heritageField.trim(),
          category: 'الممارسات الاجتماعية والطقوس'
        }
      })
      console.log(`   ✨ تم إنشاء مجال تراث جديد: ${data.heritageField.trim()}`)
    }
    heritageFieldId = hf.id
  } else {
    const defaultHf = await prisma.heritageField.findFirst({
      where: { name: { contains: 'الألعاب الشعبية' } }
    })
    if (!defaultHf) throw new Error('مجال التراث الافتراضي غير موجود')
    heritageFieldId = defaultHf.id
  }

  // Create slug
  let slug = createSlug(gameName)
  const existingSlug = await prisma.game.findFirst({ where: { slug } })
  if (existingSlug) {
    slug = slug + '-' + Date.now()
  }

  // Parse arrays
  const localNames = data.localNames
    ? data.localNames.split(/[،,]/).map(n => n.trim()).filter(Boolean)
    : []

  const tools = data.tools ? [data.tools.trim()] : []

  const rules = data.rules
    ? parseRulesToArray(data.rules)
    : []

  const gameType = data.gameType?.trim() || 'شعبية'

  // Create the game
  const game = await prisma.game.create({
    data: {
      canonicalName: gameName,
      localNames,
      slug,
      countryId: country.id,
      region: data.region?.trim() || '',
      heritageFieldId,
      gameType,
      ageGroup: data.ageGroup?.trim() || '',
      ageGroupDetails: data.ageGroupDetails?.trim() || '',
      practitioners: data.practitioners?.trim() || '',
      practitionersDetails: data.practitionersDetails?.trim() || '',
      playersCount: data.playersCount?.trim() || '',
      playersDetails: data.playersDetails?.trim() || '',
      tools,
      environment: data.environment?.trim() || '',
      timing: data.timing?.trim() || '',
      description: data.description?.trim() || '',
      rules: rules.length > 0 ? rules : ['لا توجد قواعد محددة'],
      winLossSystem: data.winLossSystem?.trim() || '',
      startEndMechanism: data.startEndMechanism?.trim() || '',
      oralTradition: data.oralTradition?.trim() || '',
      socialContext: data.socialContext?.trim() || '',
      ethnographicMeaning: data.ethnographicMeaning?.trim() || '',
      linguisticOrigin: data.linguisticOrigin?.trim() || '',
      cognitiveComplexity: data.cognitiveComplexity?.trim() || '',
      folkCognitiveFunction: data.folkCognitiveFunction?.trim() || '',
      reviewStatus: 'published',
      publishedAt: new Date(),
      contributorId,
    }
  })

  // Create media
  if (data.imageUrl?.trim()) {
    await prisma.media.create({
      data: {
        gameId: game.id,
        type: 'image',
        url: data.imageUrl.trim(),
        caption: data.imageCaption?.trim() || `صورة توضيحية للعبة ${gameName}`,
        source: 'استيراد جماعي'
      }
    })
  }

  // Create references
  if (data.references?.trim()) {
    const refLines = data.references.split(/\n/).filter(l => l.trim().length > 0)
    for (const refLine of refLines) {
      const cleaned = refLine.replace(/^\d+[\.\-\)]\s*/, '').trim()
      if (cleaned.length > 0) {
        const yearMatch = cleaned.match(/\((\d{4})\)/)
        await prisma.reference.create({
          data: {
            gameId: game.id,
            citation: cleaned,
            sourceType: cleaned.includes('Revue') || cleaned.includes('Journal') ? 'دراسة أكاديمية' : 'كتاب',
            year: yearMatch ? parseInt(yearMatch[1]) : null
          }
        })
      }
    }
  }

  // Create tags
  if (data.tags?.trim()) {
    const tagNames = data.tags
      .split(/[،,]/)
      .map(t => t.replace(/#/g, '').trim())
      .filter(Boolean)

    for (const tagName of tagNames) {
      let tag = await prisma.tag.findFirst({
        where: { name: { contains: tagName, mode: 'insensitive' } }
      })
      if (!tag) {
        tag = await prisma.tag.create({
          data: { name: tagName, description: tagName, category: 'عام' }
        })
      }
      await prisma.gameTag.create({
        data: { gameId: game.id, tagId: tag.id }
      }).catch(() => {}) // Skip duplicates
    }
  }

  return game
}

// ==================== MAIN ====================

async function main() {
  const filePath = process.argv[2]

  if (!filePath) {
    console.log(`
╔══════════════════════════════════════════════════════════════╗
║         سكريبت الاستيراد الجماعي للألعاب التراثية          ║
╚══════════════════════════════════════════════════════════════╝

الاستخدام:
  npx tsx scripts/bulk-import.ts <file-path>

مثال:
  npx tsx scripts/bulk-import.ts data/games.txt

صيغة الملف:
  اسم اللعبة\tلعبة الخومس
  الدولة\tالجزائر
  نوع اللعبة\tمهارة يدوية
  الوصف الموسع\tلعبة تراثية عريقة...
  قواعد اللعب\t1. قاعدة أولى 2. قاعدة ثانية
  رابط الصورة\thttps://example.com/image.jpg
  المراجع\tمرجع 1
  ---
  اسم اللعبة\tالوشرة
  ...
`)
    process.exit(0)
  }

  const absolutePath = path.resolve(filePath)

  if (!fs.existsSync(absolutePath)) {
    console.error(`❌ الملف غير موجود: ${absolutePath}`)
    process.exit(1)
  }

  const text = fs.readFileSync(absolutePath, 'utf-8')
  const sections = text.split(/\n\s*---\s*\n/).filter(s => s.trim().length > 0)

  console.log(`\n🎮 بدء استيراد ${sections.length} لعبة...\n`)

  // Get or create default contributor
  let contributor = await prisma.contributor.findFirst({
    where: { role: 'admin' }
  })

  if (!contributor) {
    contributor = await prisma.contributor.findFirst({
      where: { role: 'editor' }
    })
  }

  if (!contributor) {
    console.error('❌ لا يوجد مساهم (admin أو editor) في قاعدة البيانات')
    process.exit(1)
  }

  let successful = 0
  let failed = 0

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i]
    const data = parseGameText(section)
    const gameName = data.name?.trim() || `لعبة ${i + 1}`

    console.log(`📝 [${i + 1}/${sections.length}] استيراد: ${gameName}`)

    try {
      const game = await importGame(data, contributor.id, i)
      console.log(`   ✅ تم بنجاح (ID: ${game.id})`)
      successful++
    } catch (error: any) {
      console.log(`   ❌ فشل: ${error.message}`)
      failed++
    }
  }

  console.log(`
╔══════════════════════════════════════════════════════════════╗
║                        ملخص الاستيراد                       ║
╠══════════════════════════════════════════════════════════════╣
║   الإجمالي: ${String(sections.length).padEnd(46)}║
║   ✅ ناجح: ${String(successful).padEnd(47)}║
║   ❌ فاشل: ${String(failed).padEnd(47)}║
╚══════════════════════════════════════════════════════════════╝
`)
}

main()
  .catch((e) => {
    console.error('❌ خطأ:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
