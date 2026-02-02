// Similarity Engine Main Exports
// التصديرات الرئيسية لمحرك التشابه

export * from './types'
export * from './engine'
export * from './scoring'

// Text processing utilities
export {
  normalizeArabic,
  stemArabic,
  levenshteinDistance,
  stringSimilarity,
  fuzzyMatch,
  jaccardSimilarity,
  arrayJaccardSimilarity,
} from './text/arabic'

export {
  ARABIC_STOPWORDS,
  isStopword,
  filterStopwords,
} from './text/stopwords'

export {
  tokenize,
  extractKeywords,
  extractKeywordsFromArray,
  keywordOverlap,
  arrayKeywordOverlap,
} from './text/tokenizer'

// Constants
export {
  SCORING_WEIGHTS,
  STRUCTURAL_WEIGHTS,
  SEMANTIC_WEIGHTS,
  SIMILARITY_THRESHOLD,
  CONFIDENCE_THRESHOLDS,
  ALGORITHM_VERSION,
} from './scoring/constants'