// Similarity Engine
// محرك التشابه

import { db } from '@/lib/db'
import type { GameWithRelations, SimilarityResult, SimilarityExplanation } from './types'
import {
  calculateStructuralScore,
  calculateSemanticScore,
  calculateHeritageScore,
} from './scoring'
import { SCORING_WEIGHTS, SIMILARITY_THRESHOLD, ALGORITHM_VERSION } from './scoring/constants'

/**
 * Calculate similarity between two games
 * حساب التشابه بين لعبتين
 */
export async function calculateSimilarity(
  gameA: GameWithRelations,
  gameB: GameWithRelations
): Promise<SimilarityResult> {
  // Calculate partial scores
  const structuralScore = calculateStructuralScore(gameA, gameB)
  const semanticScore = calculateSemanticScore(gameA, gameB)
  const heritageScore = calculateHeritageScore(gameA, gameB)

  // Calculate overall weighted score
  const overallScore =
    structuralScore.score * SCORING_WEIGHTS.structural +
    semanticScore.score * SCORING_WEIGHTS.semantic +
    heritageScore.score * SCORING_WEIGHTS.heritage

  // Generate explanation
  const explanation = generateExplanation(
    overallScore,
    structuralScore,
    semanticScore,
    heritageScore
  )

  return {
    gameAId: gameA.id,
    gameBId: gameB.id,
    overallScore,
    partialScores: {
      structural: structuralScore,
      semantic: semanticScore,
      heritage: heritageScore,
    },
    explanation,
    algorithm: ALGORITHM_VERSION,
    isAiAssisted: false,
  }
}

/**
 * Generate human-readable explanation in Arabic
 * إنشاء شرح مقروء باللغة العربية
 */
function generateExplanation(
  overallScore: number,
  structuralScore: any,
  semanticScore: any,
  heritageScore: any
): SimilarityExplanation {
  const strengths: string[] = []
  const differences: string[] = []

  // Structural analysis
  if (structuralScore.score > 0.7) {
    strengths.push('تشابه بنيوي قوي في الآليات والأدوات')
  } else if (structuralScore.score < 0.3) {
    differences.push('اختلاف كبير في البنية والآليات')
  }

  // Semantic analysis
  if (semanticScore.score > 0.6) {
    strengths.push('تشابه دلالي في الوصف والقواعد')
  }

  // Heritage analysis
  if (heritageScore.sameHeritageField) {
    strengths.push('نفس التصنيف التراثي')
  }
  if (heritageScore.sameCountry) {
    strengths.push('نفس البلد')
  } else if (!heritageScore.sameCountry && !heritageScore.sameRegion) {
    differences.push('مناطق جغرافية مختلفة')
  }

  // Determine confidence
  let confidence: 'high' | 'medium' | 'low'
  if (overallScore >= 0.85) {
    confidence = 'high'
  } else if (overallScore >= 0.70) {
    confidence = 'medium'
  } else {
    confidence = 'low'
  }

  // Determine suggested action
  let suggestedAction: 'link' | 'review' | 'ignore'
  if (overallScore >= SIMILARITY_THRESHOLD) {
    suggestedAction = 'link'
  } else if (overallScore >= 0.5) {
    suggestedAction = 'review'
  } else {
    suggestedAction = 'ignore'
  }

  // Generate summary
  const summary = generateSummary(overallScore, strengths, differences)

  return {
    summary,
    strengths,
    differences,
    confidence,
    suggestedAction,
  }
}

/**
 * Generate summary text
 * إنشاء نص ملخص
 */
function generateSummary(
  score: number,
  strengths: string[],
  differences: string[]
): string {
  const percentage = Math.round(score * 100)

  if (score >= 0.8) {
    return `تشابه عالي (${percentage}%) - ${strengths.join('، ')}`
  } else if (score >= 0.6) {
    return `تشابه متوسط (${percentage}%) - ${strengths.length > 0 ? strengths.join('، ') : 'بعض أوجه التشابه'}`
  } else if (score >= 0.4) {
    return `تشابه محدود (${percentage}%) - ${differences.length > 0 ? differences.join('، ') : 'اختلافات واضحة'}`
  } else {
    return `تشابه ضعيف (${percentage}%) - ${differences.length > 0 ? differences.join('، ') : 'لا يوجد تشابه واضح'}`
  }
}

/**
 * Find similar games for a given game
 * البحث عن ألعاب مشابهة للعبة معينة
 */
export async function findSimilarGames(
  gameId: string,
  threshold: number = SIMILARITY_THRESHOLD
): Promise<SimilarityResult[]> {
  // Get the target game with relations
  const targetGame = await db.game.findUnique({
    where: { id: gameId },
    include: {
      heritageField: true,
      country: true,
      tags: { include: { tag: true } },
    },
  })

  if (!targetGame) {
    throw new Error(`Game not found: ${gameId}`)
  }

  // Get all published games except the target
  const otherGames = await db.game.findMany({
    where: {
      id: { not: gameId },
      reviewStatus: 'published',
    },
    include: {
      heritageField: true,
      country: true,
      tags: { include: { tag: true } },
    },
  })

  // Calculate similarity with each game
  const results: SimilarityResult[] = []

  for (const otherGame of otherGames) {
    const result = await calculateSimilarity(targetGame as GameWithRelations, otherGame as GameWithRelations)
    if (result.overallScore >= threshold) {
      results.push(result)
    }
  }

  // Sort by score descending
  results.sort((a, b) => b.overallScore - a.overallScore)

  return results
}

/**
 * Batch calculate similarities for new games
 * حساب التشابهات المجمعة للألعاب الجديدة
 */
export async function calculateSimilaritiesForNewGame(
  gameId: string
): Promise<void> {
  const similarGames = await findSimilarGames(gameId)

  // Store results in database
  for (const result of similarGames) {
    await db.gameSimilarity.create({
      data: {
        gameAId: result.gameAId,
        gameBId: result.gameBId,
        overallScore: result.overallScore,
        structuralScore: result.partialScores.structural.score,
        semanticScore: result.partialScores.semantic.score,
        heritageScore: result.partialScores.heritage.score,
        explanation: result.explanation as any,
        algorithm: result.algorithm,
        isAiAssisted: result.isAiAssisted,
        status: 'pending',
      },
    })
  }
}

/**
 * Get pending similarity matches for review
 * الحصول على التطابقات المعلقة للمراجعة
 */
export async function getPendingMatches(
  limit: number = 50
): Promise<any[]> {
  return db.gameSimilarity.findMany({
    where: {
      status: 'pending',
    },
    include: {
      gameA: {
        include: {
          country: true,
          heritageField: true,
        },
      },
      gameB: {
        include: {
          country: true,
          heritageField: true,
        },
      },
    },
    orderBy: {
      overallScore: 'desc',
    },
    take: limit,
  })
}

/**
 * Accept a similarity match and create/update concept
 * قبول تطابق وإنشاء/تحديث مفهوم
 */
export async function acceptMatch(
  similarityId: string,
  conceptId?: string,
  curatorNotes?: string
): Promise<void> {
  const similarity = await db.gameSimilarity.findUnique({
    where: { id: similarityId },
    include: { gameA: true, gameB: true },
  })

  if (!similarity) {
    throw new Error(`Similarity not found: ${similarityId}`)
  }

  let concept = conceptId
    ? await db.gameConcept.findUnique({ where: { id: conceptId } })
    : null

  // Create new concept if not provided
  if (!concept) {
    concept = await db.gameConcept.create({
      data: {
        name: `${similarity.gameA.canonicalName} / ${similarity.gameB.canonicalName}`,
        description: `مفهوم ثقافي يجمع بين ${similarity.gameA.canonicalName} و ${similarity.gameB.canonicalName}`,
        canonicalGameId: similarity.gameAId,
      },
    })
  }

  // Update similarity status
  await db.gameSimilarity.update({
    where: { id: similarityId },
    data: {
      status: 'accepted',
      conceptId: concept.id,
      curatorNotes,
    },
  })

  // Link games to concept
  await db.game.update({
    where: { id: similarity.gameAId },
    data: { conceptId: concept.id },
  })

  await db.game.update({
    where: { id: similarity.gameBId },
    data: { conceptId: concept.id },
  })
}

/**
 * Reject a similarity match
 * رفض تطابق
 */
export async function rejectMatch(
  similarityId: string,
  curatorNotes?: string
): Promise<void> {
  await db.gameSimilarity.update({
    where: { id: similarityId },
    data: {
      status: 'rejected',
      curatorNotes,
    },
  })
}

/**
 * Postpone a similarity match
 * تأجيل تطابق
 */
export async function postponeMatch(
  similarityId: string,
  curatorNotes?: string
): Promise<void> {
  await db.gameSimilarity.update({
    where: { id: similarityId },
    data: {
      status: 'postponed',
      curatorNotes,
    },
  })
}