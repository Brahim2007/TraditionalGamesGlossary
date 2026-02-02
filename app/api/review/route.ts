// API route for review operations
// للحصول على الألعاب المطلوب مراجعتها

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'غير مصرح بالوصول' },
        { status: 401 }
      )
    }

    // Only reviewers and admins can access review queue
    if (user.role !== 'reviewer' && user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'ليس لديك صلاحية للمراجعة' },
        { status: 403 }
      )
    }

    // Fetch pending reviews
    const pendingGames = await db.game.findMany({
      where: {
        reviewStatus: 'under_review'
      },
      include: {
        country: true,
        heritageField: true,
        contributor: {
          select: {
            name: true,
            email: true,
            institution: true
          }
        },
        media: {
          take: 1,
          orderBy: {
            createdAt: 'asc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Get statistics
    const stats = await db.game.groupBy({
      by: ['reviewStatus'],
      _count: true,
      where: {
        createdAt: {
          gte: new Date(new Date().setDate(new Date().getDate() - 7)) // Last 7 days
        }
      }
    })

    const approvedCount = stats.find(s => s.reviewStatus === 'published')?._count || 0
    const rejectedCount = stats.find(s => s.reviewStatus === 'rejected')?._count || 0

    return NextResponse.json({
      success: true,
      pendingGames,
      stats: {
        pending: pendingGames.length,
        approved: approvedCount,
        rejected: rejectedCount
      }
    })
  } catch (error) {
    console.error('Error fetching review data:', error)
    return NextResponse.json(
      { success: false, message: 'حدث خطأ أثناء جلب بيانات المراجعة' },
      { status: 500 }
    )
  }
}
