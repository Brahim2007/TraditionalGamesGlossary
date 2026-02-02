// API route to get game by ID
// للحصول على بيانات لعبة محددة

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

export async function GET(
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

    // Fetch game with all relations
    const game = await db.game.findUnique({
      where: { id },
      include: {
        country: true,
        heritageField: true,
        tags: {
          include: {
            tag: true
          }
        },
        media: true,
        references: true,
        contributor: {
          select: {
            name: true,
            institution: true
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

    // Check permissions
    const canEdit = 
      user.role === 'admin' ||
      (user.role === 'reviewer' && ['published', 'under_review'].includes(game.reviewStatus)) ||
      (user.role === 'editor' && game.contributorId === user.id)

    if (!canEdit) {
      return NextResponse.json(
        { success: false, message: 'ليس لديك صلاحية لتعديل هذه اللعبة' },
        { status: 403 }
      )
    }

    return NextResponse.json({
      success: true,
      game
    })
  } catch (error) {
    console.error('Error fetching game:', error)
    return NextResponse.json(
      { success: false, message: 'حدث خطأ أثناء جلب بيانات اللعبة' },
      { status: 500 }
    )
  }
}
