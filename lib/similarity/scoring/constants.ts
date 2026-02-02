// Similarity Scoring Constants
// ثوابت حساب التشابه

import type { ScoringWeights, StructuralWeights, SemanticWeights } from '../types'

// Main scoring weights
// الأوزان الرئيسية للتسجيل - تم تحديثها لتحسين الدقة
export const SCORING_WEIGHTS: ScoringWeights = {
  structural: 0.35, // Reduced - concrete game mechanics
  semantic: 0.40, // Increased - textual similarity (more important for Arabic)
  heritage: 0.25, // Maintained - cultural classification
}

// Structural component weights
// أوزان المكونات البنيوية
export const STRUCTURAL_WEIGHTS: StructuralWeights = {
  playersCount: 0.15,
  tools: 0.25,
  environment: 0.15,
  gameType: 0.15,
  timing: 0.10,
  mechanics: 0.20,
}

// Semantic component weights
// أوزان المكونات الدلالية
export const SEMANTIC_WEIGHTS: SemanticWeights = {
  descriptionKeywords: 0.35,
  rulesKeywords: 0.35,
  oralTradition: 0.15,
  localNames: 0.15,
}

// Similarity threshold for suggestions
// الحد الأدنى للتشابه للاقتراحات - تم رفعه لنتائج أكثر دقة
export const SIMILARITY_THRESHOLD = 0.75

// Confidence thresholds
// حدود الثقة - تم تحديثها لتتناسب مع المعايير الجديدة
export const CONFIDENCE_THRESHOLDS = {
  high: 0.90,
  medium: 0.80,
  low: 0.75,
}

// Algorithm version
// إصدار الخوارزمية
export const ALGORITHM_VERSION = 'rule-based-v1'
