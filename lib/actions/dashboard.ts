// Server Actions for Dashboard data operations
// Traditional Games Glossary - Comprehensive Data Display

'use server'

import { db } from '@/lib/db'
import { ReviewStatus } from '@prisma/client'

// Helper function to format geographic coordinates
function formatGeoCoordinates(coordinates: any): string {
  if (!coordinates) return 'غير متوفر'
  
  try {
    if (typeof coordinates === 'string') {
      coordinates = JSON.parse(coordinates)
    }
    
    if (coordinates.lat && coordinates.lng) {
      return `خط العرض: ${coordinates.lat.toFixed(4)}، خط الطول: ${coordinates.lng.toFixed(4)}`
    } else if (coordinates.x && coordinates.y) {
      return `X: ${coordinates.x}، Y: ${coordinates.y}`
    } else {
      return 'تنسيق غير معروف'
    }
  } catch {
    return 'تنسيق غير صالح'
  }
}

// Get comprehensive game data for dashboard display
export async function getComprehensiveGameData() {
  try {
    const games = await db.game.findMany({
      take: 10, // Limit to 10 games for dashboard
      include: {
        country: {
          select: {
            name: true,
            isoCode: true,
            region: true
          }
        },
        heritageField: {
          select: {
            name: true,
            category: true
          }
        },
        tags: {
          include: {
            tag: true
          }
        },
        media: {
          take: 1,
          select: {
            url: true,
            caption: true,
            type: true
          }
        },
        references: {
          take: 2,
          select: {
            citation: true,
            sourceType: true
          }
        },
        contributor: {
          select: {
            name: true,
            institution: true
          }
        },
        reviewer: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Transform data for display
    const transformedGames = games.map(game => ({
      // Basic Information
      id: game.id,
      canonicalName: game.canonicalName,
      localNames: game.localNames,
      slug: game.slug,
      
      // Geographic Information
      country: game.country?.name || 'غير محدد',
      countryCode: game.country?.isoCode || '',
      region: game.region || 'غير محدد',
      geoCoordinates: formatGeoCoordinates(game.geoCoordinates),
      
      // Classification
      heritageField: game.heritageField?.name || 'غير محدد',
      heritageCategory: game.heritageField?.category || '',
      gameType: game.gameType,
      ageGroup: game.ageGroup || 'غير محدد',
      practitioners: game.practitioners || 'غير محدد',
      playersCount: game.playersCount || 'غير محدد',
      
      // Requirements
      tools: game.tools,
      environment: game.environment || 'غير محدد',
      timing: game.timing || 'غير محدد',
      
      // Content
      description: game.description.length > 100 ? 
        game.description.substring(0, 100) + '...' : game.description,
      fullDescription: game.description,
      rules: game.rules,
      winLossSystem: game.winLossSystem || 'غير محدد',
      startEndMechanism: game.startEndMechanism || 'غير محدد',
      oralTradition: game.oralTradition || 'غير محدد',
      socialContext: game.socialContext || 'غير محدد',
      
      // Workflow Status
      reviewStatus: game.reviewStatus,
      createdAt: game.createdAt ? game.createdAt.toLocaleDateString('ar-SA') : 'غير محدد',
      updatedAt: game.updatedAt ? game.updatedAt.toLocaleDateString('ar-SA') : 'غير محدد',
      publishedAt: game.publishedAt ? game.publishedAt.toLocaleDateString('ar-SA') : 'غير منشور',
      
      // Responsibility
      contributor: game.contributor?.name || 'غير محدد',
      contributorInstitution: game.contributor?.institution || '',
      reviewer: game.reviewer?.name || 'غير محدد',
      reviewNotes: game.reviewNotes || 'لا توجد ملاحظات',
      
      // Related Data
      tags: game.tags.map(gt => gt.tag.name),
      mediaCount: game.media.length,
      referencesCount: game.references.length,
      
      // Sample media
      sampleMedia: game.media[0] || null
    }))

    return {
      success: true,
      games: transformedGames,
      totalCount: transformedGames.length,
      fieldsCount: 36 // Total fields in Game model
    }
  } catch (error) {
    console.error('Error fetching comprehensive game data:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'حدث خطأ أثناء جلب بيانات الألعاب',
      games: [],
      totalCount: 0,
      fieldsCount: 0
    }
  }
}

// Get data model statistics
export async function getDataModelStats() {
  try {
    const [
      totalGames,
      totalCountries,
      totalHeritageFields,
      totalTags,
      totalMedia,
      totalReferences,
      totalContributors
    ] = await Promise.all([
      db.game.count(),
      db.country.count(),
      db.heritageField.count(),
      db.tag.count(),
      db.media.count(),
      db.reference.count(),
      db.contributor.count()
    ])

    // Get field completion statistics
    const gamesWithAllFields = await db.game.findMany({
      select: {
        canonicalName: true,
        description: true,
        rules: true,
        tools: true
      }
    })

    const completionStats = {
      hasDescription: gamesWithAllFields.filter(g => g.description && g.description.length > 0).length,
      hasRules: gamesWithAllFields.filter(g => g.rules && g.rules.length > 0).length,
      hasTools: gamesWithAllFields.filter(g => g.tools && g.tools.length > 0).length,
      total: gamesWithAllFields.length
    }

    return {
      success: true,
      stats: {
        totalGames,
        totalCountries,
        totalHeritageFields,
        totalTags,
        totalMedia,
        totalReferences,
        totalContributors,
        completionStats
      }
    }
  } catch (error) {
    console.error('Error fetching data model stats:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'حدث خطأ أثناء جلب إحصائيات نموذج البيانات',
      stats: null
    }
  }
}

// Get dashboard statistics for stats page
export async function getDashboardStats() {
  try {
    const [
      totalGames,
      pendingReview,
      publishedGames,
      contributors,
      recentActivity
    ] = await Promise.all([
      db.game.count(),
      db.game.count({ where: { reviewStatus: 'under_review' } }),
      db.game.count({ where: { reviewStatus: 'published' } }),
      db.contributor.count(),
      db.reviewLog.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          game: {
            select: { canonicalName: true, slug: true }
          },
          reviewer: {
            select: { name: true }
          }
        }
      })
    ])

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
    console.error('Error fetching dashboard stats:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'حدث خطأ أثناء جلب إحصائيات لوحة التحكم',
      stats: null,
      recentActivity: []
    }
  }
}

// Get sample data for import validation
export async function getSampleImportData() {
  try {
    // Get one game with all related data as sample
    const sampleGame = await db.game.findFirst({
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
        },
        references: {
          take: 1
        }
      }
    })

    if (!sampleGame) {
      throw new Error('لا توجد بيانات نموذجية متاحة')
    }

    // Create sample CSV format
    const sampleCSV = `canonicalName,localNames,slug,countryId,region,gameType,ageGroup,practitioners,playersCount,tools,environment,timing,description,rules,winLossSystem,startEndMechanism,oralTradition,socialContext,reviewStatus
"${sampleGame.canonicalName}","${sampleGame.localNames.join(',')}","${sampleGame.slug}","${sampleGame.countryId}","${sampleGame.region || ''}","${sampleGame.gameType}","${sampleGame.ageGroup || ''}","${sampleGame.practitioners || ''}","${sampleGame.playersCount || ''}","${sampleGame.tools.join(',')}","${sampleGame.environment || ''}","${sampleGame.timing || ''}","${sampleGame.description.substring(0, 50)}...","${sampleGame.rules.join('|')}","${sampleGame.winLossSystem || ''}","${sampleGame.startEndMechanism || ''}","${sampleGame.oralTradition || ''}","${sampleGame.socialContext || ''}","${sampleGame.reviewStatus}"`

    // Create sample JSON format
    const sampleJSON = {
      canonicalName: sampleGame.canonicalName,
      localNames: sampleGame.localNames,
      slug: sampleGame.slug,
      countryId: sampleGame.countryId,
      region: sampleGame.region,
      gameType: sampleGame.gameType,
      ageGroup: sampleGame.ageGroup,
      practitioners: sampleGame.practitioners,
      playersCount: sampleGame.playersCount,
      tools: sampleGame.tools,
      environment: sampleGame.environment,
      timing: sampleGame.timing,
      description: sampleGame.description.substring(0, 100) + '...',
      rules: sampleGame.rules,
      winLossSystem: sampleGame.winLossSystem,
      startEndMechanism: sampleGame.startEndMechanism,
      oralTradition: sampleGame.oralTradition,
      socialContext: sampleGame.socialContext,
      reviewStatus: sampleGame.reviewStatus
    }

    return {
      success: true,
      sampleGame,
      sampleCSV,
      sampleJSON: JSON.stringify(sampleJSON, null, 2),
      importFormats: ['CSV', 'JSON', 'Excel'],
      validationRules: [
        'الاسم الأساسي مطلوب ولا يمكن أن يكون فارغاً',
        'الرابط الثابت يجب أن يكون فريداً',
        'معرف الدولة يجب أن يشير إلى سجل موجود',
        'معرف مجال التراث يجب أن يشير إلى سجل موجود',
        'القواعد يجب أن تحتوي على قاعدتين على الأقل',
        'الوصف يجب أن يكون طوله 100 حرف على الأقل'
      ]
    }
  } catch (error) {
    console.error('Error fetching sample import data:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'حدث خطأ أثناء جلب بيانات الاستيراد النموذجية',
      sampleCSV: '',
      sampleJSON: '',
      importFormats: [],
      validationRules: []
    }
  }
}