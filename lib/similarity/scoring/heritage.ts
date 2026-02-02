// Heritage Similarity Scoring
// حساب التشابه التراثي

import type { GameWithRelations, HeritageScore } from '../types'

/**
 * Calculate heritage similarity between two games
 * حساب التشابه التراثي بين لعبتين
 */
export function calculateHeritageScore(
  gameA: GameWithRelations,
  gameB: GameWithRelations
): HeritageScore {
  const sameHeritageField = gameA.heritageFieldId === gameB.heritageFieldId
  const sameCountry = gameA.countryId === gameB.countryId
  const sameRegion =
    gameA.country.region === gameB.country.region && gameA.country.region !== null

  // Find shared tags
  const tagsA = new Set(gameA.tags.map((t) => t.tag.id))
  const tagsB = new Set(gameB.tags.map((t) => t.tag.id))
  const sharedTagIds = [...tagsA].filter((id) => tagsB.has(id))
  const sharedTags = gameA.tags
    .filter((t) => sharedTagIds.includes(t.tag.id))
    .map((t) => t.tag.name)

  // Calculate score
  let score = 0
  const reasons: string[] = []

  // Heritage field match (highest weight)
  if (sameHeritageField) {
    score += 0.4
    reasons.push(`نفس التصنيف التراثي: ${gameA.heritageField.name}`)
  }

  // Country match
  if (sameCountry) {
    score += 0.2
    reasons.push(`نفس البلد: ${gameA.country.name}`)
  } else if (sameRegion) {
    // Same region bonus
    score += 0.15
    reasons.push(`نفس المنطقة: ${gameA.country.region}`)
  }

  // Shared tags
  if (sharedTags.length > 0) {
    const tagScore = Math.min(0.3, sharedTags.length * 0.1)
    score += tagScore
    reasons.push(`وسوم مشتركة: ${sharedTags.join('، ')}`)
  }

  // Bonus for different countries but same heritage field
  // (indicates cultural diffusion)
  if (sameHeritageField && !sameCountry) {
    score += 0.1
    reasons.push('انتشار ثقافي محتمل (نفس التصنيف في بلدان مختلفة)')
  }

  // Bonus for games from neighboring regions
  if (!sameCountry && !sameRegion) {
    const neighboringScore = calculateNeighboringRegionBonus(
      gameA.country.region,
      gameB.country.region
    )
    if (neighboringScore > 0) {
      score += neighboringScore
      reasons.push('مناطق متجاورة')
    }
  }

  const reason = reasons.length > 0 ? reasons.join(' | ') : 'لا يوجد تشابه تراثي واضح'

  return {
    score: Math.min(1, score),
    sameHeritageField,
    sameCountry,
    sameRegion,
    sharedTags,
    reason,
  }
}

/**
 * Calculate bonus for neighboring Arab regions
 * حساب مكافأة المناطق العربية المتجاورة
 */
function calculateNeighboringRegionBonus(
  regionA: string | null,
  regionB: string | null
): number {
  if (!regionA || !regionB) return 0

  // Define neighboring regions in the Arab world
  const neighboringRegions: Record<string, string[]> = {
    'الخليج': ['بلاد الشام', 'شبه الجزيرة العربية'],
    'بلاد الشام': ['الخليج', 'وادي النيل', 'شبه الجزيرة العربية'],
    'وادي النيل': ['بلاد الشام', 'المغرب العربي'],
    'المغرب العربي': ['وادي النيل'],
    'شبه الجزيرة العربية': ['الخليج', 'بلاد الشام', 'وادي النيل'],
  }

  const neighborsA = neighboringRegions[regionA] || []
  if (neighborsA.includes(regionB)) {
    return 0.05
  }

  return 0
}
