'use server'

// Similarity Server Actions
// إجراءات التشابه

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import {
  getPendingMatches,
  acceptMatch,
  rejectMatch,
  postponeMatch,
  calculateSimilaritiesForNewGame,
} from '@/lib/similarity/engine'

/**
 * Get pending similarity matches for review
 * الحصول على التطابقات المعلقة للمراجعة
 */
export async function getPendingSimilarities() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('غير مصرح بالوصول')
  }

  // Check permissions
  if (!['reviewer', 'admin'].includes(user.role)) {
    throw new Error('لا تملك الصلاحيات الكافية')
  }

  return getPendingMatches()
}

/**
 * Accept a similarity match
 * قبول تطابق
 */
export async function acceptSimilarity(
  similarityId: string,
  conceptId?: string,
  curatorNotes?: string
) {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('غير مصرح بالوصول')
  }

  // Check permissions
  if (!['reviewer', 'admin'].includes(user.role)) {
    throw new Error('لا تملك الصلاحيات الكافية')
  }

  await acceptMatch(similarityId, conceptId, curatorNotes)

  // Log the action
  await db.systemLog.create({
    data: {
      action: 'similarity_accepted',
      entityType: 'GameSimilarity',
      entityId: similarityId,
      userId: user.id,
      details: { conceptId, curatorNotes },
    },
  })

  revalidatePath('/dashboard/matches')
}

/**
 * Reject a similarity match
 * رفض تطابق
 */
export async function rejectSimilarity(
  similarityId: string,
  curatorNotes?: string
) {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('غير مصرح بالوصول')
  }

  // Check permissions
  if (!['reviewer', 'admin'].includes(user.role)) {
    throw new Error('لا تملك الصلاحيات الكافية')
  }

  await rejectMatch(similarityId, curatorNotes)

  // Log the action
  await db.systemLog.create({
    data: {
      action: 'similarity_rejected',
      entityType: 'GameSimilarity',
      entityId: similarityId,
      userId: user.id,
      details: { curatorNotes },
    },
  })

  revalidatePath('/dashboard/matches')
}

/**
 * Postpone a similarity match
 * تأجيل تطابق
 */
export async function postponeSimilarity(
  similarityId: string,
  curatorNotes?: string
) {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('غير مصرح بالوصول')
  }

  // Check permissions
  if (!['reviewer', 'admin'].includes(user.role)) {
    throw new Error('لا تملك الصلاحيات الكافية')
  }

  await postponeMatch(similarityId, curatorNotes)

  // Log the action
  await db.systemLog.create({
    data: {
      action: 'similarity_postponed',
      entityType: 'GameSimilarity',
      entityId: similarityId,
      userId: user.id,
      details: { curatorNotes },
    },
  })

  revalidatePath('/dashboard/matches')
}

/**
 * Trigger similarity calculation for a new game
 * تشغيل حساب التشابه للعبة جديدة
 */
export async function triggerSimilarityCalculation(gameId: string) {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('غير مصرح بالوصول')
  }

  // Check permissions
  if (!['editor', 'reviewer', 'admin'].includes(user.role)) {
    throw new Error('لا تملك الصلاحيات الكافية')
  }

  await calculateSimilaritiesForNewGame(gameId)

  // Log the action
  await db.systemLog.create({
    data: {
      action: 'similarity_calculation_triggered',
      entityType: 'Game',
      entityId: gameId,
      userId: user.id,
    },
  })

  revalidatePath('/dashboard/matches')
}

/**
 * Get game concepts
 * الحصول على المفاهيم
 */
export async function getGameConcepts() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('غير مصرح بالوصول')
  }

  return db.gameConcept.findMany({
    include: {
      games: {
        include: {
          country: true,
          heritageField: true,
        },
      },
      createdBy: true,
    },
    orderBy: { createdAt: 'desc' },
  })
}

/**
 * Create a new game concept
 * إنشاء مفهوم جديد
 */
export async function createGameConcept(
  name: string,
  description?: string,
  canonicalGameId?: string
) {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('غير مصرح بالوصول')
  }

  // Check permissions
  if (!['reviewer', 'admin'].includes(user.role)) {
    throw new Error('لا تملك الصلاحيات الكافية')
  }

  const concept = await db.gameConcept.create({
    data: {
      name,
      description,
      canonicalGameId,
      createdById: user.id,
    },
  })

  // Log the action
  await db.systemLog.create({
    data: {
      action: 'concept_created',
      entityType: 'GameConcept',
      entityId: concept.id,
      userId: user.id,
      details: { name, description },
    },
  })

  revalidatePath('/dashboard/matches')
  return concept
}

/**
 * Remove a game from a concept
 * إزالة لعبة من مفهوم
 */
export async function removeGameFromConcept(
  gameId: string,
  conceptId: string
) {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('غير مصرح بالوصول')
  }

  // Check permissions
  if (!['reviewer', 'admin'].includes(user.role)) {
    throw new Error('لا تملك الصلاحيات الكافية')
  }

  await db.game.update({
    where: { id: gameId },
    data: { conceptId: null },
  })

  // Log the action
  await db.systemLog.create({
    data: {
      action: 'game_removed_from_concept',
      entityType: 'Game',
      entityId: gameId,
      userId: user.id,
      details: { conceptId },
    },
  })

  revalidatePath('/dashboard/matches')
}

/**
 * Get concept with games
 * الحصول على مفهوم مع ألعابه
 */
export async function getConceptWithGames(conceptId: string) {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('غير مصرح بالوصول')
  }

  return db.gameConcept.findUnique({
    where: { id: conceptId },
    include: {
      games: {
        include: {
          country: true,
          heritageField: true,
          tags: { include: { tag: true } },
        },
      },
      createdBy: true,
    },
  })
}