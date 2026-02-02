// Semantic Similarity Scoring
// حساب التشابه الدلالي

import type { GameWithRelations, SemanticScore, KeywordScoreComponent } from '../types'
import { normalizeArabic, fuzzyMatch } from '../text/arabic'
import { keywordOverlap, arrayKeywordOverlap } from '../text/tokenizer'
import { SEMANTIC_WEIGHTS } from './constants'

/**
 * Calculate semantic similarity between two games
 * حساب التشابه الدلالي بين لعبتين
 */
export function calculateSemanticScore(
  gameA: GameWithRelations,
  gameB: GameWithRelations
): SemanticScore {
  const components = {
    descriptionKeywords: compareDescriptions(gameA.description, gameB.description),
    rulesKeywords: compareRules(gameA.rules, gameB.rules),
    oralTradition: compareOralTradition(gameA.oralTradition, gameB.oralTradition),
    localNames: compareLocalNames(gameA.localNames, gameB.localNames),
  }

  // Calculate weighted score
  const score =
    components.descriptionKeywords.score * SEMANTIC_WEIGHTS.descriptionKeywords +
    components.rulesKeywords.score * SEMANTIC_WEIGHTS.rulesKeywords +
    components.oralTradition.score * SEMANTIC_WEIGHTS.oralTradition +
    components.localNames.score * SEMANTIC_WEIGHTS.localNames

  return { score, components }
}

/**
 * Compare descriptions
 * مقارنة الأوصاف
 */
function compareDescriptions(
  descA: string,
  descB: string
): KeywordScoreComponent {
  const { matched, score } = keywordOverlap(descA, descB)
  return { score, matchedKeywords: matched }
}

/**
 * Compare rules arrays
 * مقارنة قواعد اللعب
 */
function compareRules(rulesA: string[], rulesB: string[]): KeywordScoreComponent {
  if (rulesA.length === 0 && rulesB.length === 0) {
    return { score: 1, matchedKeywords: [] }
  }

  if (rulesA.length === 0 || rulesB.length === 0) {
    return { score: 0, matchedKeywords: [] }
  }

  const { matched, score } = arrayKeywordOverlap(rulesA, rulesB)
  return { score, matchedKeywords: matched }
}

/**
 * Compare oral traditions
 * مقارنة التقاليد الشفهية
 */
function compareOralTradition(
  traditionA: string | null,
  traditionB: string | null
): KeywordScoreComponent {
  if (!traditionA && !traditionB) {
    return { score: 1, matchedKeywords: [] }
  }

  if (!traditionA || !traditionB) {
    return { score: 0, matchedKeywords: [] }
  }

  const { matched, score } = keywordOverlap(traditionA, traditionB)

  // Bonus for exact phrase matches (common in oral traditions)
  const normalizedA = normalizeArabic(traditionA)
  const normalizedB = normalizeArabic(traditionB)

  // Find common phrases (3+ words)
  const phrasesA = extractPhrases(normalizedA, 3)
  const phrasesB = extractPhrases(normalizedB, 3)

  const matchedPhrases = phrasesA.filter((phraseA) =>
    phrasesB.some((phraseB) => fuzzyMatch(phraseA, phraseB, 0.85))
  )

  // Boost score if phrases match
  const adjustedScore = matchedPhrases.length > 0 ? Math.min(1, score + 0.2) : score

  return {
    score: adjustedScore,
    matchedKeywords: [...matched, ...matchedPhrases],
  }
}

/**
 * Compare local names
 * مقارنة الأسماء المحلية
 */
function compareLocalNames(
  namesA: string[],
  namesB: string[]
): KeywordScoreComponent {
  if (namesA.length === 0 && namesB.length === 0) {
    return { score: 0, matchedKeywords: [] }
  }

  if (namesA.length === 0 || namesB.length === 0) {
    return { score: 0, matchedKeywords: [] }
  }

  const normalizedA = namesA.map(normalizeArabic)
  const normalizedB = namesB.map(normalizeArabic)

  // Find exact or fuzzy matches
  const matchedNames: string[] = []
  let matchScore = 0

  for (const nameA of normalizedA) {
    for (const nameB of normalizedB) {
      // Exact match
      if (nameA === nameB) {
        matchedNames.push(nameA)
        matchScore += 1
        break
      }
      // Fuzzy match
      if (fuzzyMatch(nameA, nameB, 0.8)) {
        matchedNames.push(nameA)
        matchScore += 0.8
        break
      }
      // Partial match (one contains the other)
      if (nameA.includes(nameB) || nameB.includes(nameA)) {
        matchedNames.push(nameA)
        matchScore += 0.6
        break
      }
    }
  }

  const totalPossible = Math.max(normalizedA.length, normalizedB.length)
  const score = matchScore / totalPossible

  return { score: Math.min(1, score), matchedKeywords: matchedNames }
}

/**
 * Extract phrases of minimum word count
 * استخراج العبارات بحد أدنى من الكلمات
 */
function extractPhrases(text: string, minWords: number): string[] {
  const words = text.split(/\s+/).filter((w) => w.length > 1)
  if (words.length < minWords) return []

  const phrases: string[] = []

  // Extract consecutive word groups
  for (let i = 0; i <= words.length - minWords; i++) {
    for (let len = minWords; len <= Math.min(minWords + 2, words.length - i); len++) {
      phrases.push(words.slice(i, i + len).join(' '))
    }
  }

  return phrases
}
