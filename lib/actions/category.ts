'use server'

// Category management actions for Traditional Games Glossary
// Allows CRUD operations on categories from the dashboard

import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// ==================== VALIDATION SCHEMAS ====================

const CategorySchema = z.object({
  name: z.string().min(2, 'اسم التصنيف يجب أن يكون حرفين على الأقل'),
  slug: z
    .string()
    .min(2, 'الرابط يجب أن يكون حرفين على الأقل')
    .regex(/^[a-z0-9-]+$/, 'الرابط يجب أن يحتوي على حروف إنجليزية صغيرة وأرقام وشرطات فقط'),
  description: z.string().optional(),
  icon: z.string().min(1, 'يرجى اختيار أيقونة'),
  order: z.number().int().min(0),
  isActive: z.boolean(),
  color: z.string().optional(),
})

// ==================== GET CATEGORIES ====================

export async function getCategories() {
  try {
    const categories = await db.category.findMany({
      orderBy: { order: 'asc' },
    })

    return {
      success: true,
      categories,
    }
  } catch (error) {
    console.error('Error fetching categories:', error)
    return {
      success: false,
      message: 'حدث خطأ أثناء جلب التصنيفات',
      categories: [],
    }
  }
}

export async function getActiveCategories() {
  try {
    const categories = await db.category.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    })

    return {
      success: true,
      categories,
    }
  } catch (error) {
    console.error('Error fetching active categories:', error)
    return {
      success: false,
      message: 'حدث خطأ أثناء جلب التصنيفات النشطة',
      categories: [],
    }
  }
}

export async function getCategoryById(id: string) {
  try {
    const category = await db.category.findUnique({
      where: { id },
    })

    if (!category) {
      return {
        success: false,
        message: 'التصنيف غير موجود',
      }
    }

    return {
      success: true,
      category,
    }
  } catch (error) {
    console.error('Error fetching category:', error)
    return {
      success: false,
      message: 'حدث خطأ أثناء جلب التصنيف',
    }
  }
}

// ==================== CREATE CATEGORY ====================

export async function createCategory(data: z.infer<typeof CategorySchema>) {
  try {
    // Check authentication
    const user = await getCurrentUser()
    if (!user || (user.role !== 'admin' && user.role !== 'reviewer')) {
      return {
        success: false,
        message: 'غير مصرح لك بإضافة تصنيفات. يجب أن تكون مديراً أو مراجعاً.',
      }
    }

    // Validate data
    const validatedData = CategorySchema.parse(data)

    // Check if name already exists
    const existingByName = await db.category.findUnique({
      where: { name: validatedData.name },
    })

    if (existingByName) {
      return {
        success: false,
        message: 'يوجد تصنيف بهذا الاسم بالفعل',
      }
    }

    // Check if slug already exists
    const existingBySlug = await db.category.findUnique({
      where: { slug: validatedData.slug },
    })

    if (existingBySlug) {
      return {
        success: false,
        message: 'يوجد تصنيف بهذا الرابط بالفعل',
      }
    }

    // Create category
    const category = await db.category.create({
      data: validatedData,
    })

    // Revalidate relevant pages
    revalidatePath('/')
    revalidatePath('/gallery')
    revalidatePath('/dashboard/categories')

    return {
      success: true,
      message: 'تم إضافة التصنيف بنجاح',
      category,
    }
  } catch (error) {
    console.error('Error creating category:', error)

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
      message: 'حدث خطأ أثناء إضافة التصنيف',
    }
  }
}

// ==================== UPDATE CATEGORY ====================

export async function updateCategory(id: string, data: Partial<z.infer<typeof CategorySchema>>) {
  try {
    // Check authentication
    const user = await getCurrentUser()
    if (!user || (user.role !== 'admin' && user.role !== 'reviewer')) {
      return {
        success: false,
        message: 'غير مصرح لك بتعديل التصنيفات. يجب أن تكون مديراً أو مراجعاً.',
      }
    }

    // Check if category exists
    const existingCategory = await db.category.findUnique({
      where: { id },
    })

    if (!existingCategory) {
      return {
        success: false,
        message: 'التصنيف غير موجود',
      }
    }

    // Validate data (partial)
    const validatedData = CategorySchema.partial().parse(data)

    // Check if new name conflicts with another category
    if (validatedData.name && validatedData.name !== existingCategory.name) {
      const nameConflict = await db.category.findFirst({
        where: {
          name: validatedData.name,
          id: { not: id },
        },
      })

      if (nameConflict) {
        return {
          success: false,
          message: 'يوجد تصنيف آخر بهذا الاسم',
        }
      }
    }

    // Check if new slug conflicts with another category
    if (validatedData.slug && validatedData.slug !== existingCategory.slug) {
      const slugConflict = await db.category.findFirst({
        where: {
          slug: validatedData.slug,
          id: { not: id },
        },
      })

      if (slugConflict) {
        return {
          success: false,
          message: 'يوجد تصنيف آخر بهذا الرابط',
        }
      }
    }

    // Update category
    const category = await db.category.update({
      where: { id },
      data: {
        ...validatedData,
        updatedAt: new Date(),
      },
    })

    // Revalidate relevant pages
    revalidatePath('/')
    revalidatePath('/gallery')
    revalidatePath('/dashboard/categories')

    return {
      success: true,
      message: 'تم تحديث التصنيف بنجاح',
      category,
    }
  } catch (error) {
    console.error('Error updating category:', error)

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
      message: 'حدث خطأ أثناء تحديث التصنيف',
    }
  }
}

// ==================== DELETE CATEGORY ====================

export async function deleteCategory(id: string) {
  try {
    // Check authentication
    const user = await getCurrentUser()
    if (!user || user.role !== 'admin') {
      return {
        success: false,
        message: 'غير مصرح لك بحذف التصنيفات. يجب أن تكون مديراً.',
      }
    }

    // Check if category exists
    const category = await db.category.findUnique({
      where: { id },
    })

    if (!category) {
      return {
        success: false,
        message: 'التصنيف غير موجود',
      }
    }

    // Delete category
    await db.category.delete({
      where: { id },
    })

    // Revalidate relevant pages
    revalidatePath('/')
    revalidatePath('/gallery')
    revalidatePath('/dashboard/categories')

    return {
      success: true,
      message: 'تم حذف التصنيف بنجاح',
    }
  } catch (error) {
    console.error('Error deleting category:', error)
    return {
      success: false,
      message: 'حدث خطأ أثناء حذف التصنيف',
    }
  }
}

// ==================== TOGGLE CATEGORY STATUS ====================

export async function toggleCategoryStatus(id: string) {
  try {
    // Check authentication
    const user = await getCurrentUser()
    if (!user || (user.role !== 'admin' && user.role !== 'reviewer')) {
      return {
        success: false,
        message: 'غير مصرح لك بتعديل حالة التصنيفات',
      }
    }

    // Get current category
    const category = await db.category.findUnique({
      where: { id },
    })

    if (!category) {
      return {
        success: false,
        message: 'التصنيف غير موجود',
      }
    }

    // Toggle status
    const updatedCategory = await db.category.update({
      where: { id },
      data: {
        isActive: !category.isActive,
        updatedAt: new Date(),
      },
    })

    // Revalidate relevant pages
    revalidatePath('/')
    revalidatePath('/gallery')
    revalidatePath('/dashboard/categories')

    return {
      success: true,
      message: updatedCategory.isActive ? 'تم تفعيل التصنيف' : 'تم إخفاء التصنيف',
      category: updatedCategory,
    }
  } catch (error) {
    console.error('Error toggling category status:', error)
    return {
      success: false,
      message: 'حدث خطأ أثناء تغيير حالة التصنيف',
    }
  }
}

// ==================== REORDER CATEGORIES ====================

export async function reorderCategories(categoryIds: string[]) {
  try {
    // Check authentication
    const user = await getCurrentUser()
    if (!user || (user.role !== 'admin' && user.role !== 'reviewer')) {
      return {
        success: false,
        message: 'غير مصرح لك بإعادة ترتيب التصنيفات',
      }
    }

    // Update order for each category
    await Promise.all(
      categoryIds.map((id, index) =>
        db.category.update({
          where: { id },
          data: { order: index },
        })
      )
    )

    // Revalidate relevant pages
    revalidatePath('/')
    revalidatePath('/gallery')
    revalidatePath('/dashboard/categories')

    return {
      success: true,
      message: 'تم إعادة ترتيب التصنيفات بنجاح',
    }
  } catch (error) {
    console.error('Error reordering categories:', error)
    return {
      success: false,
      message: 'حدث خطأ أثناء إعادة ترتيب التصنيفات',
    }
  }
}
