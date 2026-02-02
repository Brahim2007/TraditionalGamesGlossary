// Similarity Engine Types
// أنواع محرك التشابه

import type { Game, HeritageField, Country, Tag } from '@prisma/client'

// Game with relations for similarity calculation
export interface GameWithRelations extends Game {
  heritageField: HeritageField
  country: Country
  tags: { tag: Tag }[]
}

// Overall similarity result
export interface SimilarityResult {
  gameAId: string
  gameBId: string
  overallScore: number
  partialScores: {
    structural: StructuralScore
    semantic: SemanticScore
    heritage: HeritageScore
    ai?: AIScore
  }
  explanation: SimilarityExplanation
  algorithm: string
  isAiAssisted: boolean
}

// Structural similarity score
export interface StructuralScore {
  score: number // 0-1
  components: {
    playersCount: ScoreComponent
    tools: ToolsScoreComponent
    environment: ScoreComponent
    gameType: ScoreComponent
    timing: ScoreComponent
    mechanics: ScoreComponent
  }
}

// Semantic similarity score
export interface SemanticScore {
  score: number
  components: {
    descriptionKeywords: KeywordScoreComponent
    rulesKeywords: KeywordScoreComponent
    oralTradition: KeywordScoreComponent
    localNames: KeywordScoreComponent
  }
}

// Heritage similarity score
export interface HeritageScore {
  score: number
  sameHeritageField: boolean
  sameCountry: boolean
  sameRegion: boolean
  sharedTags: string[]
  reason: string
}

// AI-assisted score
export interface AIScore {
  score: number
  confidence: number
  reasoning: string
  model: string
  calculatedAt: Date
  metadata?: Record<string, unknown>
}

// Base score component
export interface ScoreComponent {
  score: number
  reason: string
}

// Tools-specific score component
export interface ToolsScoreComponent extends ScoreComponent {
  matchedTools: string[]
}

// Keyword-specific score component
export interface KeywordScoreComponent {
  score: number
  matchedKeywords: string[]
}

// Explanation for curator
export interface SimilarityExplanation {
  summary: string // Arabic human-readable summary
  strengths: string[] // What makes them similar
  differences: string[] // What makes them different
  confidence: 'high' | 'medium' | 'low'
  suggestedAction: 'link' | 'review' | 'ignore'
}

// Scoring weights configuration
export interface ScoringWeights {
  structural: number
  semantic: number
  heritage: number
}

// Scoring component weights
export interface StructuralWeights {
  playersCount: number
  tools: number
  environment: number
  gameType: number
  timing: number
  mechanics: number
}

export interface SemanticWeights {
  descriptionKeywords: number
  rulesKeywords: number
  oralTradition: number
  localNames: number
}

// Plugin interface for AI scoring
export interface SimilarityPlugin {
  name: string
  version: string
  isEnabled: () => boolean
  calculate(gameA: GameWithRelations, gameB: GameWithRelations): Promise<AIScore | null>
  calculateBatch?(games: GameWithRelations[]): Promise<Map<string, AIScore>>
}

// Plugin configuration
export interface PluginConfig {
  enabled: boolean
  apiKey?: string
  endpoint?: string
  model?: string
  maxConcurrency?: number
}
