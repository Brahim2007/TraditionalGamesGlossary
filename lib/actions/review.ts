'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { ReviewStatus, ReviewAction } from '@prisma/client'

/**
 * Get all games pending review
 */
export async function getPendingReviews() {
  try {
    const games = await db.game.findMany({
      where: {
        reviewStatus: ReviewStatus.under_review,
      },
      include: {
        country: true,
        heritageField: true,
        contributor: {
          select: {
            name: true,
            institution: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'asc', // Oldest first
      },
    })

    return {
      success: true,
      games,
    }
  } catch (error) {
    console.error('Error getting pending reviews:', error)
    return {
      success: false,
      message: 'حدث خطأ أثناء جلب الألعاب المعلقة',
      games: [],
    }
  }
}

/**
 * Approve a game and publish it
 */
export async function approveGame(
  gameId: string,
  reviewerId: string,
  notes?: string
) {
  try {
    // Update game status
    const game = await db.game.update({
      where: { id: gameId },
      data: {
        reviewStatus: ReviewStatus.published,
        publishedAt: new Date(),
        reviewerId,
        reviewNotes: notes,
      },
    })

    // Create review log
    await db.reviewLog.create({
      data: {
        gameId,
        reviewerId,
        action: ReviewAction.approved,
        notes: notes || 'تمت الموافقة على اللعبة',
      },
    })

    // Also create a published log
    await db.reviewLog.create({
      data: {
        gameId,
        reviewerId,
        action: ReviewAction.published,
        notes: 'تم نشر اللعبة للجمهور',
      },
    })

    revalidatePath('/dashboard/review')
    revalidatePath('/dashboard/games')
    revalidatePath(`/game/${game.slug}`)
    revalidatePath('/gallery')

    return {
      success: true,
      message: 'تم الموافقة ونشر اللعبة بنجاح',
      game,
    }
  } catch (error) {
    console.error('Error approving game:', error)
    return {
      success: false,
      message: 'حدث خطأ أثناء الموافقة على اللعبة',
    }
  }
}

/**
 * Reject a game with feedback
 */
export async function rejectGame(
  gameId: string,
  reviewerId: string,
  feedback: string
) {
  try {
    if (!feedback.trim()) {
      return {
        success: false,
        message: 'يجب إدخال ملاحظات للرفض',
      }
    }

    const game = await db.game.update({
      where: { id: gameId },
      data: {
        reviewStatus: ReviewStatus.rejected,
        reviewerId,
        reviewNotes: feedback,
      },
    })

    // Create review log
    await db.reviewLog.create({
      data: {
        gameId,
        reviewerId,
        action: ReviewAction.rejected,
        notes: feedback,
      },
    })

    revalidatePath('/dashboard/review')
    revalidatePath('/dashboard/games')

    return {
      success: true,
      message: 'تم رفض اللعبة مع إرسال الملاحظات',
      game,
    }
  } catch (error) {
    console.error('Error rejecting game:', error)
    return {
      success: false,
      message: 'حدث خطأ أثناء رفض اللعبة',
    }
  }
}

/**
 * Request revisions and send back to draft
 */
export async function requestRevision(
  gameId: string,
  reviewerId: string,
  feedback: string
) {
  try {
    if (!feedback.trim()) {
      return {
        success: false,
        message: 'يجب إدخال ملاحظات للمراجعة',
      }
    }

    const game = await db.game.update({
      where: { id: gameId },
      data: {
        reviewStatus: ReviewStatus.draft,
        reviewerId,
        reviewNotes: feedback,
      },
    })

    // Create review log
    await db.reviewLog.create({
      data: {
        gameId,
        reviewerId,
        action: ReviewAction.updated,
        notes: `طلب تعديلات: ${feedback}`,
      },
    })

    revalidatePath('/dashboard/review')
    revalidatePath('/dashboard/games')

    return {
      success: true,
      message: 'تم إرجاع اللعبة للتعديل مع الملاحظات',
      game,
    }
  } catch (error) {
    console.error('Error requesting revision:', error)
    return {
      success: false,
      message: 'حدث خطأ أثناء طلب التعديلات',
    }
  }
}

/**
 * Get review history for a game
 */
export async function getReviewHistory(gameId: string) {
  try {
    const logs = await db.reviewLog.findMany({
      where: { gameId },
      include: {
        reviewer: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return {
      success: true,
      logs,
    }
  } catch (error) {
    console.error('Error getting review history:', error)
    return {
      success: false,
      message: 'حدث خطأ أثناء جلب سجل المراجعات',
      logs: [],
    }
  }
}

/**
 * Get review statistics
 */
export async function getReviewStats() {
  try {
    const [pending, approved, rejected, total] = await Promise.all([
      db.game.count({ where: { reviewStatus: ReviewStatus.under_review } }),
      db.game.count({ where: { reviewStatus: ReviewStatus.published } }),
      db.game.count({ where: { reviewStatus: ReviewStatus.rejected } }),
      db.game.count(),
    ])

    // Get this week's activity
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)

    const thisWeekLogs = await db.reviewLog.count({
      where: {
        createdAt: { gte: weekAgo },
      },
    })

    return {
      success: true,
      stats: {
        pending,
        approved,
        rejected,
        total,
        thisWeekActivity: thisWeekLogs,
      },
    }
  } catch (error) {
    console.error('Error getting review stats:', error)
    return {
      success: false,
      message: 'حدث خطأ أثناء جلب الإحصائيات',
      stats: null,
    }
  }
}
