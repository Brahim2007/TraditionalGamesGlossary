// Server Actions for Game CRUD operations
// Traditional Games Glossary - Archival System

'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { ReviewStatus } from '@prisma/client'
import { z } from 'zod'
import { getCurrentUser } from '@/lib/auth'
import { triggerSimilarityCalculation } from './similarity'

// ==================== VALIDATION SCHEMAS ====================

const GameCreateSchema = z.object({
  canonicalName: z.string()
    .min(1, 'اسم اللعبة مطلوب')
    .max(200, 'اسم اللعبة يجب ألا يتجاوز 200 حرف')
    .regex(/^[\u0600-\u06FF\s\-\.،؛:]+$/, 'اسم اللعبة يجب أن يحتوي على أحرف عربية فقط'),
  
  localNames: z.array(z.string())
    .optional()
    .default([])
    .refine(names => names.every(name => name.length <= 150), {
      message: 'كل اسم محلي يجب ألا يتجاوز 150 حرف'
    }),
  
  countryId: z.string()
    .min(1, 'الدولة مطلوبة')
    .cuid('معرف الدولة غير صالح'),
  
  region: z.string()
    .max(800, 'اسم الإقليم يجب ألا يتجاوز 800 حرف')
    .optional(),
  
  geoCoordinates: z.record(z.any())
    .optional()
    .refine(coords => {
      if (!coords) return true
      const { lat, lng } = coords
      return typeof lat === 'number' && typeof lng === 'number' &&
             lat >= -90 && lat <= 90 &&
             lng >= -180 && lng <= 180
    }, 'الإحداثيات الجغرافية غير صالحة'),
  
  heritageFieldId: z.string()
    .min(1, 'مجال التراث مطلوب')
    .cuid('معرف مجال التراث غير صالح'),
  
  gameType: z.string()
    .min(1, 'نوع اللعبة مطلوب')
    .max(100, 'نوع اللعبة يجب ألا يتجاوز 100 حرف'),
  
  ageGroup: z.string()
    .max(100, 'الفئة العمرية يجب ألا تتجاوز 100 حرف')
    .optional(),
  
  ageGroupDetails: z.string()
    .max(1500, 'وصف الفئة العمرية يجب ألا يتجاوز 1500 حرف')
    .optional(),
  
  practitioners: z.string()
    .max(100, 'نوع الممارسين يجب ألا يتجاوز 100 حرف')
    .optional(),
  
  practitionersDetails: z.string()
    .max(1500, 'وصف الممارسين يجب ألا يتجاوز 1500 حرف')
    .optional(),
  
  playersCount: z.string()
    .max(50, 'عدد اللاعبين يجب ألا يتجاوز 50 حرف')
    .optional(),
  
  playersDetails: z.string()
    .max(1000, 'وصف اللاعبين يجب ألا يتجاوز 1000 حرف')
    .optional(),
  
  tools: z.array(z.string())
    .optional()
    .default([])
    .refine(tools => tools.every(tool => tool.length <= 200), {
      message: 'كل أداة يجب ألا تتجاوز 200 حرف'
    }),
  
  environment: z.string()
    .max(800, 'وصف المكان يجب ألا يتجاوز 800 حرف')
    .optional(),
  
  timing: z.string()
    .max(200, 'وصف الوقت يجب ألا يتجاوز 200 حرف')
    .optional(),
  
  description: z.string()
    .min(1, 'الوصف مطلوب')
    .min(50, 'الوصف يجب أن يحتوي على الأقل 50 حرف')
    .max(5000, 'الوصف يجب ألا يتجاوز 5000 حرف'),
  
  rules: z.array(z.string())
    .min(1, 'قواعد اللعب مطلوبة')
    .refine(rules => rules.every(rule => rule.length >= 10 && rule.length <= 1000), {
      message: 'كل قاعدة يجب أن تحتوي بين 10 و 1000 حرف'
    }),
  
  winLossSystem: z.string()
    .max(1500, 'نظام الفوز والخسارة يجب ألا يتجاوز 1500 حرف')
    .optional(),
  
  startEndMechanism: z.string()
    .max(1500, 'آلية البدء والانتهاء يجب ألا تتجاوز 1500 حرف')
    .optional(),
  
  oralTradition: z.string()
    .max(3000, 'الموروث الشفهي يجب ألا يتجاوز 3000 حرف')
    .optional(),
  
  socialContext: z.string()
    .max(4000, 'السياق الاجتماعي يجب ألا يتجاوز 4000 حرف')
    .optional(),

  // Ethno-cognitive archival fields (حقول الأرشفة الإثنو-معرفية)
  ethnographicMeaning: z.string()
    .max(5000, 'المعنى الإثنوغرافي للتسمية يجب ألا يتجاوز 5000 حرف')
    .optional(),

  linguisticOrigin: z.string()
    .max(3000, 'الأصل اللغوي للتسمية يجب ألا يتجاوز 3000 حرف')
    .optional(),

  cognitiveComplexity: z.string()
    .max(2000, 'مستوى التعقيد المعرفي يجب ألا يتجاوز 2000 حرف')
    .optional(),

  folkCognitiveFunction: z.string()
    .max(4000, 'الوظيفة المعرفية الشعبية يجب ألا يتجاوز 4000 حرف')
    .optional(),

  tagIds: z.array(z.string().cuid('معرف الوسم غير صالح'))
    .optional()
    .default([]),
  
  uploadedImages: z.array(z.string())
    .optional()
    .default([])
    .refine(images => images.every(url => url.startsWith('http')), {
      message: 'روابط الصور يجب أن تكون روابط صالحة'
    })
})

const GameUpdateSchema = GameCreateSchema.partial()

// Helper function to create slug from Arabic name
function createSlug(name: string): string {
  return name
    .replace(/[^\u0600-\u06FF\s]/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase()
}

// Helper function to get field suggestions for better error messages
function getFieldSuggestion(field: string): string {
  const suggestions: Record<string, string> = {
    'canonicalName': '💡 اكتب الاسم الرسمي للعبة بالعربية (مثال: الركض بالحاجبين المرفوعين)',
    'countryId': '💡 اختر الدولة من القائمة المنسدلة',
    'heritageFieldId': '💡 اختر تصنيف التراث المناسب (مثال: الألعاب الشعبية)',
    'gameType': '💡 حدد نوع اللعبة (مثال: حركية، ذهنية، طريفة)',
    'description': '💡 اكتب وصفاً مفصلاً للعبة (100 حرف على الأقل)',
    'rules': '💡 أضف قواعد اللعب (قاعدتين على الأقل)',
    'localNames': '💡 أضف الأسماء المحلية مفصولة بفواصل',
    'tools': '💡 أضف الأدوات المستخدمة مفصولة بفواصل',
    'environment': '💡 حدد مكان ممارسة اللعبة (مثال: السكيك، الحوي)',
    'timing': '💡 حدد وقت ممارسة اللعبة (مثال: النهار، العصر)'
  }
  return suggestions[field] || '💡 يرجى تصحيح هذا الحقل'
}

// ==================== CREATE GAME ====================

export async function createGame(formData: FormData) {
  let user: any = null;
  
  try {
    // Get current user with enhanced security check
    user = await getCurrentUser()
    if (!user) {
      throw new Error('❌ غير مصرح بالوصول. يرجى تسجيل الدخول أولاً.')
    }
    
    // Validate user permissions
    if (!['editor', 'reviewer', 'admin'].includes(user.role)) {
      throw new Error('❌ ليس لديك صلاحية لإضافة ألعاب. يرجى التواصل مع المسؤول.')
    }
    
    // Rate limiting check (prevent spam)
    const userGamesToday = await db.game.count({
      where: {
        contributorId: user.id,
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
      }
    })
    
    if (userGamesToday >= 10 && user.role !== 'admin') {
      throw new Error('❌ تم الوصول إلى الحد الأقصى لإضافة الألعاب اليوم (10 ألعاب). يرجى المحاولة غداً.')
    }

    // Debug: Log all FormData entries
    console.log('=== CREATE GAME DEBUG ===')
    console.log('FormData entries:')
    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`)
    }

  // Extract data from FormData
  const rawData = {
    canonicalName: formData.get('canonicalName') as string,
    localNames: JSON.parse(formData.get('localNames') as string || '[]'),
    countryId: formData.get('countryId') as string,
    region: formData.get('region') as string,
    geoCoordinates: formData.get('geoCoordinates') ?
      JSON.parse(formData.get('geoCoordinates') as string) : undefined,
    heritageFieldId: formData.get('heritageFieldId') as string,
    gameType: formData.get('gameType') as string,
    ageGroup: formData.get('ageGroup') as string,
    ageGroupDetails: formData.get('ageGroupDetails') as string,
    practitioners: formData.get('practitioners') as string,
    practitionersDetails: formData.get('practitionersDetails') as string,
    playersCount: formData.get('playersCount') as string,
    playersDetails: formData.get('playersDetails') as string,
    tools: JSON.parse(formData.get('tools') as string || '[]'),
    environment: formData.get('environment') as string,
    timing: formData.get('timing') as string,
    description: formData.get('description') as string,
    rules: JSON.parse(formData.get('rules') as string || '[]'),
    winLossSystem: formData.get('winLossSystem') as string,
    startEndMechanism: formData.get('startEndMechanism') as string,
    oralTradition: formData.get('oralTradition') as string,
    socialContext: formData.get('socialContext') as string,
    // Ethno-cognitive archival fields (حقول الأرشفة الإثنو-معرفية)
    ethnographicMeaning: formData.get('ethnographicMeaning') as string,
    linguisticOrigin: formData.get('linguisticOrigin') as string,
    cognitiveComplexity: formData.get('cognitiveComplexity') as string,
    folkCognitiveFunction: formData.get('folkCognitiveFunction') as string,
    tagIds: JSON.parse(formData.get('tagIds') as string || '[]'),
    uploadedImages: JSON.parse(formData.get('uploadedImages') as string || '[]'),
    references: formData.get('references') as string || '',
    imageCaption: formData.get('imageCaption') as string || ''
  }

    console.log('Extracted raw data:', {
      canonicalName: rawData.canonicalName,
      countryId: rawData.countryId,
      gameType: rawData.gameType,
      description: rawData.description?.substring(0, 100) + '...',
      rulesCount: rawData.rules?.length,
      uploadedImagesCount: rawData.uploadedImages?.length
    })

    // Validate required fields before schema validation
    if (!rawData.canonicalName || rawData.canonicalName.trim().length === 0) {
      throw new Error('❌ اسم اللعبة مطلوب. يرجى إدخال اسم اللعبة الرسمي.')
    }
    
    if (rawData.canonicalName.trim().length < 3) {
      throw new Error('❌ اسم اللعبة يجب أن يحتوي على 3 أحرف على الأقل.')
    }
    
    if (!rawData.countryId || rawData.countryId.trim().length === 0) {
      throw new Error('❌ الدولة مطلوبة. يرجى اختيار الدولة من القائمة.')
    }
    
    if (!rawData.heritageFieldId || rawData.heritageFieldId.trim().length === 0) {
      throw new Error('❌ مجال التراث مطلوب. يرجى تحديد تصنيف التراث المناسب.')
    }
    
    if (!rawData.gameType || rawData.gameType.trim().length === 0) {
      throw new Error('❌ نوع اللعبة مطلوب. يرجى تحديد نوع اللعبة (مثال: حركية، ذهنية).')
    }
    
    if (!rawData.description || rawData.description.trim().length === 0) {
      throw new Error('❌ الوصف مطلوب. يرجى كتابة وصف مفصل للعبة (100 حرف على الأقل).')
    }
    
    if (rawData.description && rawData.description.trim().length < 50) {
      throw new Error('❌ الوصف يجب أن يحتوي على 50 حرف على الأقل.')
    }

    // Validate data
    const validatedData = GameCreateSchema.parse(rawData)
    
    console.log('Validation successful, creating game with slug:', createSlug(validatedData.canonicalName))
    
    // Create slug
    const slug = createSlug(validatedData.canonicalName)
    
    // Check if slug already exists
    const existingGame = await db.game.findUnique({
      where: { slug }
    })
    
    if (existingGame) {
      return {
        success: false,
        message: `لعبة بنفس الاسم موجودة بالفعل: "${validatedData.canonicalName}"`,
        errorType: 'DuplicateGame',
        errorDetails: {
          message: 'يوجد لعبة مسجلة بنفس الاسم في قاعدة البيانات',
          existingGameId: existingGame.id,
          existingGameSlug: existingGame.slug,
          suggestion: 'يرجى استخدام اسم مختلف أو تحديث اللعبة الموجودة'
        }
      }
    }

    // Create game (published if admin, draft otherwise)
    // Extract tagIds and uploadedImages before creating game
    const { tagIds, uploadedImages, ...gameData } = validatedData
    
    // Admin creates published games directly, others create drafts
    const reviewStatus = user.role === 'admin' ? ReviewStatus.published : ReviewStatus.draft
    const publishedAt = user.role === 'admin' ? new Date() : null
    
    const game = await db.game.create({
      data: {
        ...gameData,
        slug,
        reviewStatus,
        publishedAt,
        contributorId: user.id,
        reviewerId: user.role === 'admin' ? user.id : null
      }
    })

    // Connect tags if provided
    if (tagIds && tagIds.length > 0) {
      await db.gameTag.createMany({
        data: tagIds.map(tagId => ({
          gameId: game.id,
          tagId
        })),
        skipDuplicates: true
      })
    }

    // Create media records for uploaded images
    if (uploadedImages && uploadedImages.length > 0) {
      // استخدام التسمية التوضيحية المقدمة من المستخدم أو إنشاء تسمية افتراضية
      const userCaption = rawData.imageCaption?.trim()

      await db.media.createMany({
        data: uploadedImages.map((url, index) => ({
          gameId: game.id,
          url,
          type: 'image',
          caption: userCaption || `صورة توضيحية للعبة ${gameData.canonicalName}`
        })),
        skipDuplicates: true
      })
    }

    // Create reference records
    if (rawData.references && rawData.references.trim().length > 0) {
      // تقسيم المراجع إلى سطور
      const referenceLines = rawData.references
        .split(/\n/)
        .map((line: string) => line.trim())
        .filter((line: string) => line.length > 0)

      if (referenceLines.length > 0) {
        await db.reference.createMany({
          data: referenceLines.map((citation: string) => ({
            gameId: game.id,
            citation: citation.replace(/^\d+\.\s*/, ''), // إزالة الترقيم من البداية
            sourceType: 'غير محدد'
          })),
          skipDuplicates: true
        })
      }
    }

    // Create review log
    await db.reviewLog.create({
      data: {
        gameId: game.id,
        reviewerId: user.id,
        action: user.role === 'admin' ? 'published' : 'created',
        notes: user.role === 'admin' ? 'تم إنشاء اللعبة ونشرها مباشرة' : 'تم إنشاء اللعبة كمسودة'
      }
    })

    // If admin published, trigger similarity calculation
    if (user.role === 'admin') {
      triggerSimilarityCalculation(game.id).catch((error) => {
        console.error('Error triggering similarity calculation:', error)
        db.systemLog.create({
          data: {
            action: 'similarity_calculation_failed',
            entityType: 'Game',
            entityId: game.id,
            userId: user.id,
            details: { error: error.message },
          },
        }).catch(console.error)
      })
    }

    revalidatePath('/dashboard/games')
    revalidatePath('/gallery')
    
    return {
      success: true,
      message: user.role === 'admin' ? 'تم إنشاء اللعبة ونشرها بنجاح' : 'تم إنشاء اللعبة بنجاح كمسودة',
      gameId: game.id
    }
  } catch (error) {
    console.error('Error creating game:', error)
    
    // Enhanced error logging for debugging - user is accessible from outer scope
    console.error('Error details:', {
      errorType: error?.constructor?.name,
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : 'No stack trace',
      formDataKeys: Array.from(formData.keys()),
      user: typeof user !== 'undefined' ? (user?.id || 'No user') : 'User not defined'
    })
    
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: '⚠️ يوجد أخطاء في البيانات المدخلة. يرجى تصحيح الحقول التالية:',
        errors: error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message,
          suggestion: getFieldSuggestion(e.path.join('.'))
        }))
      }
    }
    
    // Return more detailed error information with defensive checks
    const errorMessage = error instanceof Error ? error.message : 'حدث خطأ أثناء إنشاء اللعبة'
    const errorType = error?.constructor?.name || 'UnknownError'
    
    return {
      success: false,
      message: errorMessage,
      errorType: errorType,
      errorDetails: error instanceof Error ? {
        message: error.message,
        stack: error.stack || 'No stack trace available'
      } : {
        message: String(error),
        stack: 'No stack trace available'
      }
    }
  }
}

// ==================== UPDATE GAME ====================

export async function updateGame(gameId: string, updates: any) {
  try {
    // Get current user
    const user = await getCurrentUser()
    if (!user) {
      throw new Error('غير مصرح بالوصول. يرجى تسجيل الدخول')
    }

    // Validate updates
    const validatedUpdates = GameUpdateSchema.parse(updates)
    
    // Get current game
    const currentGame = await db.game.findUnique({
      where: { id: gameId }
    })
    
    if (!currentGame) {
      throw new Error('اللعبة غير موجودة')
    }

    // Update slug if name changed
    let slug = currentGame.slug
    if (validatedUpdates.canonicalName && validatedUpdates.canonicalName !== currentGame.canonicalName) {
      slug = createSlug(validatedUpdates.canonicalName)
      
      // Check if new slug exists (for different game)
      const existingWithSlug = await db.game.findFirst({
        where: {
          slug,
          id: { not: gameId }
        }
      })
      
      if (existingWithSlug) {
        throw new Error('لعبة أخرى بنفس الاسم موجودة بالفعل')
      }
    }

    // Extract fields that are not part of the Game model
    const { tagIds, uploadedImages, ...gameUpdates } = validatedUpdates

    // Update game
    const game = await db.game.update({
      where: { id: gameId },
      data: {
        ...gameUpdates,
        ...(slug !== currentGame.slug ? { slug } : {})
      }
    })

    // Update tags if provided
    if (tagIds) {
      // Remove existing tags
      await db.gameTag.deleteMany({
        where: { gameId }
      })
      
      // Add new tags
      if (tagIds.length > 0) {
        await db.gameTag.createMany({
          data: tagIds.map((tagId: string) => ({
            gameId,
            tagId
          })),
          skipDuplicates: true
        })
      }
    }

    // Update media if provided
    if (uploadedImages && uploadedImages.length > 0) {
      // Remove existing media
      await db.media.deleteMany({
        where: { gameId }
      })
      
      // Add new media
      await db.media.createMany({
        data: uploadedImages.map((url: string) => ({
          gameId,
          url,
          type: 'image',
          caption: gameUpdates.canonicalName ? `صورة توضيحية للعبة ${gameUpdates.canonicalName}` : 'صورة توضيحية'
        })),
        skipDuplicates: true
      })
    }

    // Create review log
    await db.reviewLog.create({
      data: {
        gameId,
        reviewerId: user.id,
        action: 'updated',
        notes: 'تم تحديث اللعبة',
        changes: JSON.stringify(validatedUpdates)
      }
    })

    revalidatePath(`/game/${game.slug}`)
    revalidatePath('/dashboard/games')
    
    return {
      success: true,
      message: 'تم تحديث اللعبة بنجاح',
      game
    }
  } catch (error) {
    console.error('Error updating game:', error)
    
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: '⚠️ يوجد أخطاء في البيانات المدخلة. يرجى تصحيح الحقول التالية:',
        errors: error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message,
          suggestion: getFieldSuggestion(e.path.join('.'))
        }))
      }
    }
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'حدث خطأ أثناء تحديث اللعبة'
    }
  }
}

// ==================== DELETE GAME ====================

export async function deleteGame(gameId: string) {
  try {
    // Get current user
    const user = await getCurrentUser()
    if (!user) {
      throw new Error('غير مصرح بالوصول. يرجى تسجيل الدخول')
    }

    // Check if game exists
    const game = await db.game.findUnique({
      where: { id: gameId }
    })

    if (!game) {
      throw new Error('اللعبة غير موجودة')
    }

    // حذف اللعبة بالكامل من قاعدة البيانات
    // السجلات المرتبطة ستُحذف تلقائياً بسبب onDelete: Cascade في schema
    await db.game.delete({
      where: { id: gameId }
    })

    revalidatePath('/dashboard/games')
    revalidatePath('/gallery')

    return {
      success: true,
      message: 'تم حذف اللعبة بالكامل من قاعدة البيانات'
    }
  } catch (error) {
    console.error('Error deleting game:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'حدث خطأ أثناء حذف اللعبة'
    }
  }
}

// ==================== SUBMIT FOR REVIEW ====================

export async function submitForReview(gameId: string) {
  try {
    // Get current user
    const user = await getCurrentUser()
    if (!user) {
      throw new Error('غير مصرح بالوصول. يرجى تسجيل الدخول')
    }

    const game = await db.game.update({
      where: { id: gameId },
      data: {
        reviewStatus: ReviewStatus.under_review
      }
    })

    // Create review log
    await db.reviewLog.create({
      data: {
        gameId,
        reviewerId: user.id,
        action: 'submitted',
        notes: 'تم إرسال اللعبة للمراجعة'
      }
    })

    revalidatePath('/dashboard/games')
    revalidatePath('/dashboard/review')
    
    return {
      success: true,
      message: 'تم إرسال اللعبة للمراجعة بنجاح',
      game
    }
  } catch (error) {
    console.error('Error submitting game for review:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'حدث خطأ أثناء إرسال اللعبة للمراجعة'
    }
  }
}

// ==================== PUBLISH GAME ====================

export async function publishGame(gameId: string, reviewerId: string) {
  try {
    const game = await db.game.update({
      where: { id: gameId },
      data: {
        reviewStatus: ReviewStatus.published,
        publishedAt: new Date(),
        reviewerId
      }
    })

    // Create review log
    await db.reviewLog.create({
      data: {
        gameId,
        reviewerId,
        action: 'published',
        notes: 'تم نشر اللعبة للجمهور'
      }
    })

    // Trigger similarity calculation for the newly published game
    // Run in background (don't await to avoid blocking the response)
    triggerSimilarityCalculation(gameId).catch((error) => {
      console.error('Error triggering similarity calculation:', error)
      // Log the error but don't fail the publish operation
      db.systemLog.create({
        data: {
          action: 'similarity_calculation_failed',
          entityType: 'Game',
          entityId: gameId,
          userId: reviewerId,
          details: { error: error.message },
        },
      }).catch(console.error)
    })

    revalidatePath(`/game/${game.slug}`)
    revalidatePath('/dashboard/games')
    revalidatePath('/gallery')
    revalidatePath('/dashboard/matches')
    
    return {
      success: true,
      message: 'تم نشر اللعبة بنجاح. جارٍ حساب التشابهات مع الألعاب الأخرى...',
      game
    }
  } catch (error) {
    console.error('Error publishing game:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'حدث خطأ أثناء نشر اللعبة'
    }
  }
}

// ==================== REJECT GAME ====================

export async function rejectGame(gameId: string, reviewerId: string, feedback: string) {
  try {
    const game = await db.game.update({
      where: { id: gameId },
      data: {
        reviewStatus: ReviewStatus.rejected,
        reviewNotes: feedback,
        reviewerId
      }
    })

    // Create review log
    await db.reviewLog.create({
      data: {
        gameId,
        reviewerId,
        action: 'rejected',
        notes: feedback
      }
    })

    revalidatePath('/dashboard/games')
    revalidatePath('/dashboard/review')
    
    return {
      success: true,
      message: 'تم رفض اللعبة مع تقديم الملاحظات',
      game
    }
  } catch (error) {
    console.error('Error rejecting game:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'حدث خطأ أثناء رفض اللعبة'
    }
  }
}

// ==================== SEARCH GAMES ====================

import { normalizeArabic, tokenizeArabic, semanticSimilarity } from '@/lib/similarity/text/arabic'
import { searchCache, CacheKeys } from '@/lib/utils/cache'

export async function searchGames(query: string, filters: any = {}) {
  try {
    // Generate cache key
    const cacheKey = CacheKeys.SEARCH_RESULTS(query, filters)
    
    // Try to get from cache first
    const cachedResults = searchCache.get(cacheKey)
    if (cachedResults) {
      return {
        success: true,
        games: cachedResults,
        cached: true
      }
    }

    const where: any = {
      reviewStatus: ReviewStatus.published // Only show published games to public
    }

    // Enhanced text search with Arabic normalization
    if (query) {
      const normalizedQuery = normalizeArabic(query)
      const queryTokens = tokenizeArabic(query, true)
      
      // Build more comprehensive search conditions
      where.OR = [
        // Exact match on canonical name
        { canonicalName: { contains: normalizedQuery, mode: 'insensitive' } },
        
        // Fuzzy match on canonical name
        { canonicalName: { contains: query, mode: 'insensitive' } },
        
        // Search in description
        { description: { contains: normalizedQuery, mode: 'insensitive' } },
        
        // Search in local names (array contains)
        { localNames: { has: query } },
        { localNames: { has: normalizedQuery } },
        
        // Search in game type
        { gameType: { contains: normalizedQuery, mode: 'insensitive' } },
        
        // Search in environment
        { environment: { contains: normalizedQuery, mode: 'insensitive' } },
        
        // Search in tools (array contains)
        ...(queryTokens.map(token => ({
          tools: { has: token }
        })))
      ]
    }

    // Apply filters
    if (filters.countryId) {
      where.countryId = filters.countryId
    }
    
    if (filters.heritageFieldId) {
      where.heritageFieldId = filters.heritageFieldId
    }
    
    if (filters.gameType) {
      where.gameType = filters.gameType
    }
    
    if (filters.ageGroup) {
      where.ageGroup = { contains: filters.ageGroup, mode: 'insensitive' }
    }
    
    if (filters.tagIds && filters.tagIds.length > 0) {
      where.tags = {
        some: {
          tagId: { in: filters.tagIds }
        }
      }
    }

    const games = await db.game.findMany({
      where,
      include: {
        country: true,
        heritageField: true,
        tags: {
          include: {
            tag: true
          }
        },
        media: {
          take: 1
        }
      },
      orderBy: {
        publishedAt: 'desc'
      },
      take: 100 // Increased limit for better search results
    })

    // If we have a query, rank results by relevance
    let rankedGames = games
    if (query) {
      rankedGames = rankSearchResults(games, query)
    }

    // Cache the results (5 minutes TTL)
    searchCache.set(cacheKey, rankedGames, 5 * 60 * 1000)

    return {
      success: true,
      games: rankedGames,
      cached: false,
      totalResults: rankedGames.length
    }
  } catch (error) {
    console.error('Error searching games:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'حدث خطأ أثناء البحث',
      games: []
    }
  }
}

/**
 * Rank search results by relevance
 * ترتيب نتائج البحث حسب الأهمية
 */
function rankSearchResults(games: any[], query: string): any[] {
  const normalizedQuery = normalizeArabic(query)
  const queryTokens = tokenizeArabic(query, true)
  
  return games.map(game => {
    let score = 0
    
    // Calculate relevance scores
    const nameScore = calculateNameRelevance(game.canonicalName, normalizedQuery, queryTokens)
    const descriptionScore = calculateTextRelevance(game.description, normalizedQuery, queryTokens)
    const localNamesScore = calculateLocalNamesRelevance(game.localNames, normalizedQuery, queryTokens)
    
    // Weighted scoring
    score += nameScore * 0.5 // Name is most important
    score += descriptionScore * 0.3
    score += localNamesScore * 0.2
    
    // Boost score for exact matches
    if (game.canonicalName.toLowerCase().includes(normalizedQuery.toLowerCase())) {
      score += 0.5
    }
    
    // Boost score for published games
    if (game.reviewStatus === 'published') {
      score += 0.1
    }
    
    return {
      ...game,
      _relevanceScore: score
    }
  })
  .sort((a, b) => b._relevanceScore - a._relevanceScore)
  .map(({ _relevanceScore, ...game }) => game) // Remove score from final output
}

/**
 * Calculate relevance score for game name
 * حساب درجة الأهمية لاسم اللعبة
 */
function calculateNameRelevance(name: string, query: string, queryTokens: string[]): number {
  if (!name) return 0
  
  const normalizedName = normalizeArabic(name)
  const nameTokens = tokenizeArabic(name, true)
  
  let score = 0
  
  // Exact match
  if (normalizedName.toLowerCase().includes(query.toLowerCase())) {
    score += 1.0
  }
  
  // Token overlap
  const nameTokenSet = new Set(nameTokens)
  const queryTokenSet = new Set(queryTokens)
  const overlap = [...queryTokenSet].filter(token => nameTokenSet.has(token)).length
  
  score += overlap * 0.2
  
  return Math.min(score, 1.0)
}

/**
 * Calculate relevance score for description
 * حساب درجة الأهمية للوصف
 */
function calculateTextRelevance(text: string, query: string, queryTokens: string[]): number {
  if (!text) return 0
  
  const normalizedText = normalizeArabic(text)
  const textTokens = tokenizeArabic(text, true)
  
  let score = 0
  
  // Query appears in text
  if (normalizedText.toLowerCase().includes(query.toLowerCase())) {
    score += 0.5
  }
  
  // Token overlap
  const textTokenSet = new Set(textTokens)
  const queryTokenSet = new Set(queryTokens)
  const overlap = [...queryTokenSet].filter(token => textTokenSet.has(token)).length
  
  score += overlap * 0.1
  
  // Semantic similarity
  const semanticScore = semanticSimilarity(text, query)
  score += semanticScore * 0.3
  
  return Math.min(score, 1.0)
}

/**
 * Calculate relevance score for local names
 * حساب درجة الأهمية للأسماء المحلية
 */
function calculateLocalNamesRelevance(localNames: string[], query: string, queryTokens: string[]): number {
  if (!localNames || localNames.length === 0) return 0
  
  let maxScore = 0
  
  for (const localName of localNames) {
    const nameScore = calculateNameRelevance(localName, query, queryTokens)
    maxScore = Math.max(maxScore, nameScore)
  }
  
  return maxScore
}

/**
 * Advanced search with semantic matching
 * بحث متقدم مع مطابقة دلالية
 */
export async function advancedSearch(
  query: string,
  filters: any = {},
  options: {
    useSemantic: boolean
    limit: number
    offset: number
  } = { useSemantic: true, limit: 50, offset: 0 }
) {
  try {
    // First, do a regular search
    const searchResult = await searchGames(query, filters)
    
    if (!searchResult.success || !searchResult.games || (Array.isArray(searchResult.games) && searchResult.games.length === 0)) {
      return searchResult
    }
    
    // Ensure games is an array
    const games = Array.isArray(searchResult.games) ? searchResult.games : []
    
    // If semantic search is enabled, re-rank results
    if (options.useSemantic && query && games.length > 0) {
      const rankedGames = rankSearchResults(games, query)
      
      // Apply pagination
      const paginatedGames = rankedGames.slice(
        options.offset,
        options.offset + options.limit
      )
      
      return {
        success: true,
        games: paginatedGames,
        totalResults: rankedGames.length,
        page: Math.floor(options.offset / options.limit) + 1,
        totalPages: Math.ceil(rankedGames.length / options.limit)
      }
    }
    
    // Apply pagination to regular results
    const paginatedGames = games.slice(
      options.offset,
      options.offset + options.limit
    )
    
    return {
      success: true,
      games: paginatedGames,
      totalResults: games.length,
      page: Math.floor(options.offset / options.limit) + 1,
      totalPages: Math.ceil(games.length / options.limit)
    }
  } catch (error) {
    console.error('Error in advanced search:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'حدث خطأ أثناء البحث المتقدم',
      games: []
    }
  }
}

// ==================== GET GAME BY SLUG ====================

export async function getGameBySlug(slug: string) {
  try {
    // Decode URL-encoded slug
    const decodedSlug = decodeURIComponent(slug)
    
    // First try exact match with published status
    let game = await db.game.findFirst({
      where: { 
        slug: decodedSlug,
        reviewStatus: ReviewStatus.published // Only accessible if published
      },
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
        },
        // إضافة المفهوم الثقافي
        concept: {
          select: {
            id: true,
            name: true,
            description: true
          }
        },
        // إضافة التطابقات المقبولة (حيث هذه اللعبة هي gameA)
        similaritiesAsA: {
          where: {
            status: 'accepted',
            gameB: {
              reviewStatus: ReviewStatus.published
            }
          },
          include: {
            gameB: {
              select: {
                id: true,
                canonicalName: true,
                slug: true,
                gameType: true,
                country: {
                  select: {
                    name: true
                  }
                },
                media: {
                  take: 1,
                  select: {
                    url: true
                  }
                }
              }
            }
          },
          take: 5,
          orderBy: {
            overallScore: 'desc'
          }
        },
        // إضافة التطابقات المقبولة (حيث هذه اللعبة هي gameB)
        similaritiesAsB: {
          where: {
            status: 'accepted',
            gameA: {
              reviewStatus: ReviewStatus.published
            }
          },
          include: {
            gameA: {
              select: {
                id: true,
                canonicalName: true,
                slug: true,
                gameType: true,
                country: {
                  select: {
                    name: true
                  }
                },
                media: {
                  take: 1,
                  select: {
                    url: true
                  }
                }
              }
            }
          },
          take: 5,
          orderBy: {
            overallScore: 'desc'
          }
        }
      }
    })
    
    // If not found, try to normalize the slug (remove diacritics)
    if (!game) {
      // Normalize Arabic slug (remove diacritics)
      const normalizedSlug = decodedSlug
        .replace(/[أإآ]/g, 'ا')
        .replace(/[ؤ]/g, 'و')
        .replace(/[ئ]/g, 'ي')
        .replace(/[\u064B-\u0652\u0670]/g, '')
        .replace(/ة/g, 'ه')
        .replace(/ى/g, 'ي')
        .replace(/ـ/g, '')
        .toLowerCase()

      // Try to find by normalized slug
      const games = await db.game.findMany({
        where: { 
          reviewStatus: ReviewStatus.published
        },
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
          },
          concept: {
            select: {
              id: true,
              name: true,
              description: true
            }
          },
          similaritiesAsA: {
            where: {
              status: 'accepted',
              gameB: {
                reviewStatus: ReviewStatus.published
              }
            },
            include: {
              gameB: {
                select: {
                  id: true,
                  canonicalName: true,
                  slug: true,
                  gameType: true,
                  country: {
                    select: {
                      name: true
                    }
                  },
                  media: {
                    take: 1,
                    select: {
                      url: true
                    }
                  }
                }
              }
            },
            take: 5,
            orderBy: {
              overallScore: 'desc'
            }
          },
          similaritiesAsB: {
            where: {
              status: 'accepted',
              gameA: {
                reviewStatus: ReviewStatus.published
              }
            },
            include: {
              gameA: {
                select: {
                  id: true,
                  canonicalName: true,
                  slug: true,
                  gameType: true,
                  country: {
                    select: {
                      name: true
                    }
                  },
                  media: {
                    take: 1,
                    select: {
                      url: true
                    }
                  }
                }
              }
            },
            take: 5,
            orderBy: {
              overallScore: 'desc'
            }
          }
        }
      })
      
      // Find game with matching normalized slug
      const foundGame = games.find(g => {
        const gameSlugNormalized = g.slug
          .replace(/[أإآ]/g, 'ا')
          .replace(/[ؤ]/g, 'و')
          .replace(/[ئ]/g, 'ي')
          .replace(/[\u064B-\u0652\u0670]/g, '')
          .replace(/ة/g, 'ه')
          .replace(/ى/g, 'ي')
          .replace(/ـ/g, '')
          .toLowerCase()
        
        return gameSlugNormalized === normalizedSlug
      })
      
      if (foundGame) {
        game = foundGame
      }
    }

    if (!game) {
      throw new Error('اللعبة غير موجودة أو غير منشورة')
    }

    return {
      success: true,
      game
    }
  } catch (error) {
    console.error('Error getting game:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'حدث خطأ أثناء جلب بيانات اللعبة',
      game: null
    }
  }
}

// ==================== GET DASHBOARD STATS ====================

export async function getDashboardStats() {
  try {
    const [
      totalGames,
      pendingReview,
      publishedGames,
      contributors
    ] = await Promise.all([
      db.game.count(),
      db.game.count({ where: { reviewStatus: ReviewStatus.under_review } }),
      db.game.count({ where: { reviewStatus: ReviewStatus.published } }),
      db.contributor.count()
    ])

    // Recent activity (last 7 days)
    const recentActivity = await db.reviewLog.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        game: {
          select: {
            canonicalName: true,
            slug: true
          }
        },
        reviewer: {
          select: {
            name: true
          }
        }
      }
    })

    return {
      success: true,
      stats: {
        totalGames,
        pendingReview,
        publishedGames,
        contributors
      },
      recentActivity
    }
  } catch (error) {
    console.error('Error getting dashboard stats:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'حدث خطأ أثناء جلب إحصائيات لوحة التحكم',
      stats: null,
      recentActivity: []
    }
  }
}

// ==================== GET ALL PUBLISHED GAMES FOR GALLERY ====================

export async function getPublishedGames() {
  try {
    const games = await db.game.findMany({
      where: {
        reviewStatus: ReviewStatus.published
      },
      include: {
        country: {
          select: {
            id: true,
            name: true,
            region: true
          }
        },
        heritageField: {
          select: {
            name: true
          }
        },
        tags: {
          include: {
            tag: true
          }
        },
        media: {
          orderBy: {
            createdAt: 'asc'
          },
          take: 1
        }
      },
      orderBy: {
        publishedAt: 'desc'
      }
    })

    return {
      success: true,
      games
    }
  } catch (error) {
    console.error('Error getting published games:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'حدث خطأ أثناء جلب الألعاب المنشورة',
      games: []
    }
  }
}

// ==================== GET ALL COUNTRIES ====================

export async function getAllCountries() {
  try {
    const countries = await db.country.findMany({
      orderBy: {
        name: 'asc'
      },
      select: {
        id: true,
        name: true,
        region: true,
        isoCode: true,
        _count: {
          select: {
            games: {
              where: {
                reviewStatus: ReviewStatus.published
              }
            }
          }
        }
      }
    })

    return {
      success: true,
      countries
    }
  } catch (error) {
    console.error('Error getting countries:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'حدث خطأ أثناء جلب الدول',
      countries: []
    }
  }
}