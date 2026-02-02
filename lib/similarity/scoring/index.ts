// Scoring Module Exports
// تصديرات وحدة حساب النتائج

export {
  SCORING_WEIGHTS,
  STRUCTURAL_WEIGHTS,
  SEMANTIC_WEIGHTS,
  SIMILARITY_THRESHOLD,
  CONFIDENCE_THRESHOLDS,
  ALGORITHM_VERSION,
} from './constants'

export { calculateStructuralScore } from './structural'
export { calculateSemanticScore } from './semantic'
export { calculateHeritageScore } from './heritage'

export type {
  StructuralScore,
  SemanticScore,
  HeritageScore,
  ScoreComponent,
  ToolsScoreComponent,
  KeywordScoreComponent,
} from '../types'
