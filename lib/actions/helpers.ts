// Helper functions for game creation
// Traditional Games Glossary

'use server'

import { db } from '@/lib/db'

/**
 * Get country ID by name
 * الحصول على معرف الدولة من الاسم
 */
export async function getCountryIdByName(countryName: string): Promise<string | null> {
  try {
    const country = await db.country.findFirst({
      where: {
        name: countryName
      },
      select: {
        id: true
      }
    })
    
    return country?.id || null
  } catch (error) {
    console.error('Error getting country ID:', error)
    return null
  }
}

/**
 * Get or create heritage field by name
 * الحصول على معرف مجال التراث أو إنشاؤه
 */
export async function getOrCreateHeritageFieldId(fieldName: string): Promise<string> {
  try {
    if (!fieldName || fieldName.trim().length === 0) {
      // Return default heritage field ID
      const defaultField = await db.heritageField.findFirst({
        where: {
          name: 'الألعاب الشعبية'
        }
      })
      
      if (defaultField) {
        return defaultField.id
      }
      
      // Create default if not exists
      const newDefault = await db.heritageField.create({
        data: {
          name: 'الألعاب الشعبية',
          description: 'الألعاب الشعبية التقليدية',
          category: 'Traditional Games'
        }
      })
      
      return newDefault.id
    }
    
    // Try to find existing heritage field
    let heritageField = await db.heritageField.findFirst({
      where: {
        name: fieldName
      }
    })
    
    // If not found, create it
    if (!heritageField) {
      heritageField = await db.heritageField.create({
        data: {
          name: fieldName,
          description: fieldName,
          category: 'Traditional Games'
        }
      })
    }
    
    return heritageField.id
  } catch (error) {
    console.error('Error getting/creating heritage field ID:', error)
    throw new Error('فشل في الحصول على معرف مجال التراث')
  }
}

/**
 * Get or create tag IDs by names
 * الحصول على معرفات الوسوم أو إنشاؤها
 */
export async function getOrCreateTagIds(tagNames: string[]): Promise<string[]> {
  try {
    if (!tagNames || tagNames.length === 0) {
      return []
    }
    
    const tagIds: string[] = []
    
    for (const tagName of tagNames) {
      if (!tagName || tagName.trim().length === 0) continue
      
      const trimmedName = tagName.trim()
      
      // Try to find existing tag
      let tag = await db.tag.findFirst({
        where: {
          name: trimmedName
        }
      })
      
      // If not found, create it
      if (!tag) {
        tag = await db.tag.create({
          data: {
            name: trimmedName,
            description: trimmedName,
            category: 'عام'
          }
        })
      }
      
      tagIds.push(tag.id)
    }
    
    return tagIds
  } catch (error) {
    console.error('Error getting/creating tag IDs:', error)
    return []
  }
}

/**
 * Get all countries
 * الحصول على جميع الدول
 */
export async function getAllCountries() {
  try {
    const countries = await db.country.findMany({
      orderBy: {
        name: 'asc'
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
      message: 'فشل في الحصول على قائمة الدول',
      countries: []
    }
  }
}

/**
 * Get all heritage fields
 * الحصول على جميع مجالات التراث
 */
export async function getAllHeritageFields() {
  try {
    const fields = await db.heritageField.findMany({
      orderBy: {
        name: 'asc'
      }
    })
    
    return {
      success: true,
      fields
    }
  } catch (error) {
    console.error('Error getting heritage fields:', error)
    return {
      success: false,
      message: 'فشل في الحصول على قائمة مجالات التراث',
      fields: []
    }
  }
}

/**
 * Get all tags
 * الحصول على جميع الوسوم
 */
export async function getAllTags() {
  try {
    const tags = await db.tag.findMany({
      orderBy: {
        name: 'asc'
      }
    })
    
    return {
      success: true,
      tags
    }
  } catch (error) {
    console.error('Error getting tags:', error)
    return {
      success: false,
      message: 'فشل في الحصول على قائمة الوسوم',
      tags: []
    }
  }
}
