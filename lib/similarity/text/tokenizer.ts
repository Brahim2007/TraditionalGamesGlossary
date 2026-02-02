// Arabic Text Tokenization
// تجزئة النص العربي

import { normalizeArabic, stemArabic } from './arabic'
import { filterStopwords } from './stopwords'

/**
 * Tokenize Arabic text into words
 * تجزئة النص العربي إلى كلمات
 */
export function tokenize(text: string): string[] {
  if (!text) return []

  // Split by whitespace and punctuation
  const tokens = text.split(/[\s،؛.!؟:\-\(\)\[\]«»"'،؟!]+/)

  // Filter empty tokens and very short words
  return tokens.filter((token) => token.length > 1)
}

/**
 * Extract keywords from text
 * استخراج الكلمات المفتاحية من النص
 */
export function extractKeywords(text: string): string[] {
  if (!text) return []

  // Normalize the text
  const normalized = normalizeArabic(text)

  // Tokenize
  const tokens = tokenize(normalized)

  // Filter stopwords
  const filtered = filterStopwords(tokens)

  // Stem and deduplicate
  const stemmed = filtered.map(stemArabic)
  const unique = [...new Set(stemmed)]

  // Filter very short stems
  return unique.filter((word) => word.length > 2)
}

/**
 * Extract keywords from an array of texts
 * استخراج الكلمات المفتاحية من مصفوفة نصوص
 */
export function extractKeywordsFromArray(texts: string[]): string[] {
  const allKeywords = texts.flatMap(extractKeywords)
  return [...new Set(allKeywords)]
}

/**
 * Calculate keyword overlap between two texts
 * حساب التداخل في الكلمات المفتاحية بين نصين
 */
export function keywordOverlap(
  text1: string,
  text2: string
): { matched: string[]; score: number } {
  const keywords1 = extractKeywords(text1)
  const keywords2 = extractKeywords(text2)

  if (keywords1.length === 0 && keywords2.length === 0) {
    return { matched: [], score: 1 }
  }

  if (keywords1.length === 0 || keywords2.length === 0) {
    return { matched: [], score: 0 }
  }

  const set1 = new Set(keywords1)
  const set2 = new Set(keywords2)

  const matched = keywords1.filter((k) => set2.has(k))
  const union = new Set([...set1, ...set2])

  return {
    matched,
    score: matched.length / union.size,
  }
}

/**
 * Calculate keyword overlap between two arrays
 * حساب التداخل في الكلمات المفتاحية بين مصفوفتين
 */
export function arrayKeywordOverlap(
  arr1: string[],
  arr2: string[]
): { matched: string[]; score: number } {
  const keywords1 = extractKeywordsFromArray(arr1)
  const keywords2 = extractKeywordsFromArray(arr2)

  if (keywords1.length === 0 && keywords2.length === 0) {
    return { matched: [], score: 1 }
  }

  if (keywords1.length === 0 || keywords2.length === 0) {
    return { matched: [], score: 0 }
  }

  const set1 = new Set(keywords1)
  const set2 = new Set(keywords2)

  const matched = keywords1.filter((k) => set2.has(k))
  const union = new Set([...set1, ...set2])

  return {
    matched,
    score: matched.length / union.size,
  }
}
