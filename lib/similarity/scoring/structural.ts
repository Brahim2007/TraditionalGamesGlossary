// Structural Similarity Scoring
// حساب التشابه البنيوي

import type { GameWithRelations, StructuralScore, ScoreComponent, ToolsScoreComponent } from '../types'
import { normalizeArabic, fuzzyMatch, arrayJaccardSimilarity } from '../text/arabic'
import { STRUCTURAL_WEIGHTS } from './constants'

/**
 * Calculate structural similarity between two games
 * حساب التشابه البنيوي بين لعبتين
 */
export function calculateStructuralScore(
  gameA: GameWithRelations,
  gameB: GameWithRelations
): StructuralScore {
  const components = {
    playersCount: comparePlayersCount(gameA.playersCount, gameB.playersCount),
    tools: compareTools(gameA.tools, gameB.tools),
    environment: compareEnvironment(gameA.environment, gameB.environment),
    gameType: compareGameType(gameA.gameType, gameB.gameType),
    timing: compareTiming(gameA.timing, gameB.timing),
    mechanics: compareMechanics(
      { winLoss: gameA.winLossSystem, startEnd: gameA.startEndMechanism },
      { winLoss: gameB.winLossSystem, startEnd: gameB.startEndMechanism }
    ),
  }

  // Calculate weighted score
  const score =
    components.playersCount.score * STRUCTURAL_WEIGHTS.playersCount +
    components.tools.score * STRUCTURAL_WEIGHTS.tools +
    components.environment.score * STRUCTURAL_WEIGHTS.environment +
    components.gameType.score * STRUCTURAL_WEIGHTS.gameType +
    components.timing.score * STRUCTURAL_WEIGHTS.timing +
    components.mechanics.score * STRUCTURAL_WEIGHTS.mechanics

  return { score, components }
}

/**
 * Compare players count
 * مقارنة عدد اللاعبين
 */
function comparePlayersCount(
  countA: string | null,
  countB: string | null
): ScoreComponent {
  if (!countA && !countB) {
    return { score: 1, reason: 'كلاهما غير محدد' }
  }

  if (!countA || !countB) {
    return { score: 0.3, reason: 'أحدهما غير محدد' }
  }

  const normalizedA = normalizeArabic(countA)
  const normalizedB = normalizeArabic(countB)

  if (normalizedA === normalizedB) {
    return { score: 1, reason: `نفس العدد: ${countA}` }
  }

  // Extract numbers for comparison
  const numA = extractNumber(countA)
  const numB = extractNumber(countB)

  if (numA && numB) {
    const diff = Math.abs(numA - numB)
    if (diff === 0) return { score: 1, reason: `نفس العدد: ${numA}` }
    if (diff <= 2) return { score: 0.8, reason: `عدد قريب: ${countA} vs ${countB}` }
    if (diff <= 5) return { score: 0.5, reason: `عدد مختلف قليلاً: ${countA} vs ${countB}` }
    return { score: 0.2, reason: `عدد مختلف: ${countA} vs ${countB}` }
  }

  // Check for similar descriptions
  if (fuzzyMatch(normalizedA, normalizedB, 0.7)) {
    return { score: 0.7, reason: 'وصف متشابه للعدد' }
  }

  return { score: 0.3, reason: `مختلف: ${countA} vs ${countB}` }
}

/**
 * Extract number from player count string
 */
function extractNumber(str: string): number | null {
  const match = str.match(/\d+/)
  return match ? parseInt(match[0], 10) : null
}

/**
 * Compare tools/equipment
 * مقارنة الأدوات
 */
function compareTools(toolsA: string[], toolsB: string[]): ToolsScoreComponent {
  if (toolsA.length === 0 && toolsB.length === 0) {
    return { score: 1, matchedTools: [], reason: 'كلاهما بدون أدوات' }
  }

  if (toolsA.length === 0 || toolsB.length === 0) {
    return { score: 0.3, matchedTools: [], reason: 'أحدهما بدون أدوات' }
  }

  const normalizedA = toolsA.map(normalizeArabic)
  const normalizedB = toolsB.map(normalizeArabic)

  // Find matched tools with fuzzy matching
  const matchedTools: string[] = []
  for (const toolA of normalizedA) {
    for (const toolB of normalizedB) {
      if (fuzzyMatch(toolA, toolB, 0.75)) {
        matchedTools.push(toolA)
        break
      }
    }
  }

  // Calculate Jaccard similarity
  const score = arrayJaccardSimilarity(toolsA, toolsB)

  const reason =
    matchedTools.length > 0
      ? `أدوات متشابهة: ${matchedTools.join('، ')}`
      : 'لا توجد أدوات متشابهة'

  return { score, matchedTools, reason }
}

/**
 * Compare environment
 * مقارنة البيئة
 */
function compareEnvironment(
  envA: string | null,
  envB: string | null
): ScoreComponent {
  if (!envA && !envB) {
    return { score: 1, reason: 'كلاهما غير محدد' }
  }

  if (!envA || !envB) {
    return { score: 0.3, reason: 'أحدهما غير محدد' }
  }

  const normalizedA = normalizeArabic(envA)
  const normalizedB = normalizeArabic(envB)

  if (normalizedA === normalizedB) {
    return { score: 1, reason: `نفس البيئة: ${envA}` }
  }

  // Check for common environment keywords
  const outdoorKeywords = ['خارج', 'ساحة', 'فناء', 'شارع', 'حديقة', 'ملعب', 'بر', 'صحراء']
  const indoorKeywords = ['داخل', 'غرفة', 'بيت', 'منزل', 'صالة', 'مجلس']

  const isAOutdoor = outdoorKeywords.some((k) => normalizedA.includes(k))
  const isBOutdoor = outdoorKeywords.some((k) => normalizedB.includes(k))
  const isAIndoor = indoorKeywords.some((k) => normalizedA.includes(k))
  const isBIndoor = indoorKeywords.some((k) => normalizedB.includes(k))

  if ((isAOutdoor && isBOutdoor) || (isAIndoor && isBIndoor)) {
    return { score: 0.8, reason: 'نفس نوع البيئة' }
  }

  if (fuzzyMatch(normalizedA, normalizedB, 0.6)) {
    return { score: 0.6, reason: 'بيئة متشابهة' }
  }

  return { score: 0.2, reason: `بيئة مختلفة: ${envA} vs ${envB}` }
}

/**
 * Compare game type
 * مقارنة نوع اللعبة
 */
function compareGameType(typeA: string, typeB: string): ScoreComponent {
  const normalizedA = normalizeArabic(typeA)
  const normalizedB = normalizeArabic(typeB)

  if (normalizedA === normalizedB) {
    return { score: 1, reason: `نفس النوع: ${typeA}` }
  }

  // Define related types
  const typeGroups = [
    ['حركيه', 'حركية', 'رياضيه', 'رياضية', 'بدنيه', 'بدنية'],
    ['ذهنيه', 'ذهنية', 'فكريه', 'فكرية', 'عقليه', 'عقلية'],
    ['شعبيه', 'شعبية', 'تراثيه', 'تراثية', 'تقليديه', 'تقليدية'],
    ['طريفه', 'طريفة', 'فكاهيه', 'فكاهية', 'مضحكه', 'مضحكة'],
    ['بحريه', 'بحرية', 'مائيه', 'مائية'],
  ]

  for (const group of typeGroups) {
    const aInGroup = group.some((t) => normalizedA.includes(t))
    const bInGroup = group.some((t) => normalizedB.includes(t))
    if (aInGroup && bInGroup) {
      return { score: 0.8, reason: 'نوع متشابه' }
    }
  }

  return { score: 0.2, reason: `نوع مختلف: ${typeA} vs ${typeB}` }
}

/**
 * Compare timing
 * مقارنة التوقيت
 */
function compareTiming(
  timingA: string | null,
  timingB: string | null
): ScoreComponent {
  if (!timingA && !timingB) {
    return { score: 1, reason: 'كلاهما غير محدد' }
  }

  if (!timingA || !timingB) {
    return { score: 0.5, reason: 'أحدهما غير محدد' }
  }

  const normalizedA = normalizeArabic(timingA)
  const normalizedB = normalizeArabic(timingB)

  if (normalizedA === normalizedB) {
    return { score: 1, reason: `نفس التوقيت: ${timingA}` }
  }

  // Check for similar timing keywords
  const dayKeywords = ['نهار', 'صباح', 'ظهر', 'عصر']
  const nightKeywords = ['ليل', 'مساء', 'ليله', 'ليلة']
  const seasonKeywords = {
    summer: ['صيف', 'صيفيه', 'صيفية', 'حر'],
    winter: ['شتاء', 'شتويه', 'شتوية', 'برد'],
  }

  const isADay = dayKeywords.some((k) => normalizedA.includes(k))
  const isBDay = dayKeywords.some((k) => normalizedB.includes(k))
  const isANight = nightKeywords.some((k) => normalizedA.includes(k))
  const isBNight = nightKeywords.some((k) => normalizedB.includes(k))

  if ((isADay && isBDay) || (isANight && isBNight)) {
    return { score: 0.8, reason: 'نفس وقت اليوم' }
  }

  // Check seasons
  for (const [, keywords] of Object.entries(seasonKeywords)) {
    const aInSeason = keywords.some((k) => normalizedA.includes(k))
    const bInSeason = keywords.some((k) => normalizedB.includes(k))
    if (aInSeason && bInSeason) {
      return { score: 0.7, reason: 'نفس الموسم' }
    }
  }

  return { score: 0.3, reason: `توقيت مختلف: ${timingA} vs ${timingB}` }
}

/**
 * Compare game mechanics (win/loss and start/end)
 * مقارنة آليات اللعبة
 */
function compareMechanics(
  mechanicsA: { winLoss: string | null; startEnd: string | null },
  mechanicsB: { winLoss: string | null; startEnd: string | null }
): ScoreComponent {
  let totalScore = 0
  let count = 0
  const reasons: string[] = []

  // Compare win/loss system
  if (mechanicsA.winLoss && mechanicsB.winLoss) {
    const winLossScore = compareMechanicText(mechanicsA.winLoss, mechanicsB.winLoss)
    totalScore += winLossScore
    count++
    if (winLossScore > 0.6) reasons.push('نظام فوز/خسارة متشابه')
  } else if (!mechanicsA.winLoss && !mechanicsB.winLoss) {
    totalScore += 1
    count++
  } else {
    totalScore += 0.3
    count++
  }

  // Compare start/end mechanism
  if (mechanicsA.startEnd && mechanicsB.startEnd) {
    const startEndScore = compareMechanicText(mechanicsA.startEnd, mechanicsB.startEnd)
    totalScore += startEndScore
    count++
    if (startEndScore > 0.6) reasons.push('آلية بداية/نهاية متشابهة')
  } else if (!mechanicsA.startEnd && !mechanicsB.startEnd) {
    totalScore += 1
    count++
  } else {
    totalScore += 0.3
    count++
  }

  const score = count > 0 ? totalScore / count : 0
  const reason = reasons.length > 0 ? reasons.join('، ') : 'آليات مختلفة'

  return { score, reason }
}

/**
 * Compare mechanic text descriptions
 */
function compareMechanicText(textA: string, textB: string): number {
  const normalizedA = normalizeArabic(textA)
  const normalizedB = normalizeArabic(textB)

  if (normalizedA === normalizedB) return 1

  // Check keyword overlap
  const keywordsA = normalizedA.split(/\s+/).filter((w) => w.length > 2)
  const keywordsB = normalizedB.split(/\s+/).filter((w) => w.length > 2)

  if (keywordsA.length === 0 || keywordsB.length === 0) return 0.3

  const matched = keywordsA.filter((k) =>
    keywordsB.some((kb) => fuzzyMatch(k, kb, 0.8))
  )

  return matched.length / Math.max(keywordsA.length, keywordsB.length)
}
