'use server'

// Game suggestion actions for public users
// Allows anyone to suggest games for admin review

import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// ==================== VALIDATION SCHEMAS ====================

const GameSuggestionSchema = z.object({
  gameName: z.string().min(2, 'اسم اللعبة يجب أن يكون حرفين على الأقل'),
  description: z.string().min(10, 'الوصف يجب أن يكون 10 أحرف على الأقل'),
  country: z.string().optional(),
  submitterName: z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل'),
  submitterEmail: z.string().email('البريد الإلكتروني غير صحيح').optional().or(z.literal('')),
  additionalInfo: z.string().optional(),
})

// ==================== PUBLIC: SUBMIT SUGGESTION ====================

export async function submitGameSuggestion(data: z.infer<typeof GameSuggestionSchema>) {
  try {
    // Validate data
    const validatedData = GameSuggestionSchema.parse(data)

    // Create suggestion
    const suggestion = await db.gameSuggestion.create({
      data: {
        gameName: validatedData.gameName,
        description: validatedData.description,
        country: validatedData.country || null,
        submitterName: validatedData.submitterName,
        submitterEmail: validatedData.submitterEmail || null,
        additionalInfo: validatedData.additionalInfo || null,
        status: 'pending',
      },
    })

    revalidatePath('/dashboard/suggestions')

    return {
      success: true,
      message: 'تم إرسال اقتراحك بنجاح! سنقوم بمراجعته قريباً.',
      suggestionId: suggestion.id,
    }
  } catch (error) {
    console.error('Error submitting game suggestion:', error)

    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: 'يوجد أخطاء في البيانات المدخلة',
        errors: error.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      }
    }

    return {
      success: false,
      message: 'حدث خطأ أثناء إرسال الاقتراح. يرجى المحاولة مرة أخرى.',
    }
  }
}

// ==================== ADMIN: GET SUGGESTIONS ====================

export async function getAllSuggestions() {
  try {
    const user = await getCurrentUser()
    if (!user || (user.role !== 'admin' && user.role !== 'reviewer')) {
      return {
        success: false,
        message: 'غير مصرح لك بعرض المقترحات',
        suggestions: [],
      }
    }

    const suggestions = await db.gameSuggestion.findMany({
      include: {
        reviewedBy: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return {
      success: true,
      suggestions,
    }
  } catch (error) {
    console.error('Error fetching suggestions:', error)
    return {
      success: false,
      message: 'حدث خطأ أثناء جلب المقترحات',
      suggestions: [],
    }
  }
}

export async function getPendingSuggestions() {
  try {
    const user = await getCurrentUser()
    if (!user || (user.role !== 'admin' && user.role !== 'reviewer')) {
      return {
        success: false,
        message: 'غير مصرح لك بعرض المقترحات',
        suggestions: [],
      }
    }

    const suggestions = await db.gameSuggestion.findMany({
      where: { status: 'pending' },
      orderBy: { createdAt: 'desc' },
    })

    return {
      success: true,
      suggestions,
      count: suggestions.length,
    }
  } catch (error) {
    console.error('Error fetching pending suggestions:', error)
    return {
      success: false,
      message: 'حدث خطأ أثناء جلب المقترحات',
      suggestions: [],
      count: 0,
    }
  }
}

export async function getSuggestionById(id: string) {
  try {
    const user = await getCurrentUser()
    if (!user || (user.role !== 'admin' && user.role !== 'reviewer')) {
      return {
        success: false,
        message: 'غير مصرح لك بعرض هذا المقترح',
      }
    }

    const suggestion = await db.gameSuggestion.findUnique({
      where: { id },
      include: {
        reviewedBy: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    if (!suggestion) {
      return {
        success: false,
        message: 'المقترح غير موجود',
      }
    }

    return {
      success: true,
      suggestion,
    }
  } catch (error) {
    console.error('Error fetching suggestion:', error)
    return {
      success: false,
      message: 'حدث خطأ أثناء جلب المقترح',
    }
  }
}

// ==================== ADMIN: REVIEW SUGGESTION ====================

export async function reviewSuggestion(
  id: string,
  status: 'approved' | 'rejected' | 'converted',
  reviewNotes?: string
) {
  try {
    const user = await getCurrentUser()
    if (!user || (user.role !== 'admin' && user.role !== 'reviewer')) {
      return {
        success: false,
        message: 'غير مصرح لك بمراجعة المقترحات',
      }
    }

    const suggestion = await db.gameSuggestion.update({
      where: { id },
      data: {
        status,
        reviewNotes: reviewNotes || null,
        reviewedById: user.id,
        reviewedAt: new Date(),
      },
    })

    revalidatePath('/dashboard/suggestions')

    const statusMessages = {
      approved: 'تمت الموافقة على المقترح',
      rejected: 'تم رفض المقترح',
      converted: 'تم تحويل المقترح إلى لعبة',
    }

    return {
      success: true,
      message: statusMessages[status],
      suggestion,
    }
  } catch (error) {
    console.error('Error reviewing suggestion:', error)
    return {
      success: false,
      message: 'حدث خطأ أثناء مراجعة المقترح',
    }
  }
}

// ==================== ADMIN: DELETE SUGGESTION ====================

export async function deleteSuggestion(id: string) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== 'admin') {
      return {
        success: false,
        message: 'غير مصرح لك بحذف المقترحات. يجب أن تكون مديراً.',
      }
    }

    await db.gameSuggestion.delete({
      where: { id },
    })

    revalidatePath('/dashboard/suggestions')

    return {
      success: true,
      message: 'تم حذف المقترح بنجاح',
    }
  } catch (error) {
    console.error('Error deleting suggestion:', error)
    return {
      success: false,
      message: 'حدث خطأ أثناء حذف المقترح',
    }
  }
}

// ==================== STATS ====================

export async function getSuggestionsStats() {
  try {
    const user = await getCurrentUser()
    if (!user || (user.role !== 'admin' && user.role !== 'reviewer')) {
      return {
        success: false,
        message: 'غير مصرح لك بعرض الإحصائيات',
      }
    }

    const [total, pending, approved, rejected, converted] = await Promise.all([
      db.gameSuggestion.count(),
      db.gameSuggestion.count({ where: { status: 'pending' } }),
      db.gameSuggestion.count({ where: { status: 'approved' } }),
      db.gameSuggestion.count({ where: { status: 'rejected' } }),
      db.gameSuggestion.count({ where: { status: 'converted' } }),
    ])

    return {
      success: true,
      stats: {
        total,
        pending,
        approved,
        rejected,
        converted,
      },
    }
  } catch (error) {
    console.error('Error fetching suggestions stats:', error)
    return {
      success: false,
      message: 'حدث خطأ أثناء جلب الإحصائيات',
    }
  }
}
