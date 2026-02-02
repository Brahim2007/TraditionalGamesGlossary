// API route for review actions (approve, reject, request revision)
// لإجراءات المراجعة (موافقة، رفض، طلب تعديل)

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'غير مصرح بالوصول' },
        { status: 401 }
      )
    }

    // Only reviewers and admins can perform review actions
    if (user.role !== 'reviewer' && user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'ليس لديك صلاحية للمراجعة' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { action, notes } = body

    // Validate action
    if (!['approve', 'reject', 'revision'].includes(action)) {
      return NextResponse.json(
        { success: false, message: 'إجراء غير صالح' },
        { status: 400 }
      )
    }

    // Check if game exists and is under review
    const game = await db.game.findUnique({
      where: { id },
      include: {
        contributor: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    if (!game) {
      return NextResponse.json(
        { success: false, message: 'اللعبة غير موجودة' },
        { status: 404 }
      )
    }

    if (game.reviewStatus !== 'under_review') {
      return NextResponse.json(
        { success: false, message: 'هذه اللعبة ليست قيد المراجعة' },
        { status: 400 }
      )
    }

    // Perform the action
    let newStatus: 'published' | 'rejected' | 'draft'
    let reviewAction: 'approved' | 'rejected' | 'updated'

    switch (action) {
      case 'approve':
        newStatus = 'published'
        reviewAction = 'approved'
        break
      case 'reject':
        newStatus = 'rejected'
        reviewAction = 'rejected'
        break
      case 'revision':
        newStatus = 'draft'
        reviewAction = 'updated'
        break
      default:
        throw new Error('Invalid action')
    }

    // Update game status
    const updatedGame = await db.game.update({
      where: { id },
      data: {
        reviewStatus: newStatus,
        reviewerId: user.id,
        reviewNotes: notes || null,
        publishedAt: action === 'approve' ? new Date() : null
      }
    })

    // Create review log
    await db.reviewLog.create({
      data: {
        gameId: id,
        reviewerId: user.id,
        action: reviewAction,
        notes: notes || null
      }
    })

    // Create system log
    await db.systemLog.create({
      data: {
        action: `review_${action}`,
        entityType: 'Game',
        entityId: id,
        userId: user.id,
        details: {
          gameName: game.canonicalName,
          contributorName: game.contributor?.name,
          notes: notes
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: action === 'approve' 
        ? 'تم الموافقة على اللعبة ونشرها بنجاح'
        : action === 'reject'
        ? 'تم رفض اللعبة'
        : 'تم إرجاع اللعبة للتعديل',
      game: updatedGame
    })
  } catch (error) {
    console.error('Error performing review action:', error)
    return NextResponse.json(
      { success: false, message: 'حدث خطأ أثناء تنفيذ الإجراء' },
      { status: 500 }
    )
  }
}
