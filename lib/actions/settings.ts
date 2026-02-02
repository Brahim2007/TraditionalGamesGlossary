'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { getCurrentUser } from '@/lib/auth'

// الحصول على إعداد معين
export async function getSetting(key: string) {
  try {
    const setting = await db.settings.findUnique({
      where: { key }
    })
    return { success: true, setting }
  } catch (error) {
    console.error('Error getting setting:', error)
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'حدث خطأ أثناء جلب الإعداد',
      setting: null 
    }
  }
}

// الحصول على جميع الإعدادات
export async function getAllSettings() {
  try {
    const settings = await db.settings.findMany({
      orderBy: { category: 'asc' }
    })
    return { success: true, settings }
  } catch (error) {
    console.error('Error getting settings:', error)
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'حدث خطأ أثناء جلب الإعدادات',
      settings: [] 
    }
  }
}

// الحصول على الإعدادات حسب الفئة
export async function getSettingsByCategory(category: string) {
  try {
    const settings = await db.settings.findMany({
      where: { category },
      orderBy: { key: 'asc' }
    })
    return { success: true, settings }
  } catch (error) {
    console.error('Error getting settings by category:', error)
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'حدث خطأ أثناء جلب الإعدادات',
      settings: [] 
    }
  }
}

// تحديث أو إنشاء إعداد
export async function upsertSetting(data: {
  key: string
  value: string
  category?: string
  label?: string
  description?: string
}) {
  try {
    const user = await getCurrentUser()
    if (!user || (user.role !== 'admin' && user.role !== 'reviewer')) {
      return { 
        success: false, 
        message: 'غير مصرح لك بتعديل الإعدادات' 
      }
    }

    const setting = await db.settings.upsert({
      where: { key: data.key },
      update: {
        value: data.value,
        category: data.category,
        label: data.label,
        description: data.description,
        updatedBy: user.id
      },
      create: {
        key: data.key,
        value: data.value,
        category: data.category,
        label: data.label,
        description: data.description,
        updatedBy: user.id
      }
    })

    revalidatePath('/')
    revalidatePath('/dashboard/settings')

    return { 
      success: true, 
      message: 'تم حفظ الإعداد بنجاح',
      setting 
    }
  } catch (error) {
    console.error('Error upserting setting:', error)
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'حدث خطأ أثناء حفظ الإعداد' 
    }
  }
}

// حذف إعداد
export async function deleteSetting(key: string) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== 'admin') {
      return { 
        success: false, 
        message: 'غير مصرح لك بحذف الإعدادات' 
      }
    }

    await db.settings.delete({
      where: { key }
    })

    revalidatePath('/')
    revalidatePath('/dashboard/settings')

    return { 
      success: true, 
      message: 'تم حذف الإعداد بنجاح' 
    }
  } catch (error) {
    console.error('Error deleting setting:', error)
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'حدث خطأ أثناء حذف الإعداد' 
    }
  }
}

// تهيئة الإعدادات الافتراضية
export async function initializeDefaultSettings() {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== 'admin') {
      return { 
        success: false, 
        message: 'غير مصرح لك بتهيئة الإعدادات' 
      }
    }

    const defaultSettings = [
      {
        key: 'hero_video_clips',
        value: JSON.stringify([
          {
            videoId: 'k-vNeRMMILo',
            startTime: 0,
            endTime: 30,
            title: 'مقطع 1'
          }
        ]),
        category: 'homepage',
        label: 'مقاطع فيديو الصفحة الرئيسية',
        description: 'قائمة بمقاطع الفيديو التي تظهر في خلفية القسم البطولي'
      },
      {
        key: 'site_title',
        value: 'مسرد الألعاب التراثية العربية',
        category: 'general',
        label: 'عنوان الموقع',
        description: 'العنوان الرئيسي للموقع'
      },
      {
        key: 'site_description',
        value: 'منصة توثيقية تفاعلية تحفظ قواعد وقيم الألعاب التقليدية في العالم العربي',
        category: 'general',
        label: 'وصف الموقع',
        description: 'الوصف المختصر للموقع'
      }
    ]

    for (const setting of defaultSettings) {
      await db.settings.upsert({
        where: { key: setting.key },
        update: {},
        create: {
          ...setting,
          updatedBy: user.id
        }
      })
    }

    revalidatePath('/')
    revalidatePath('/dashboard/settings')

    return { 
      success: true, 
      message: 'تم تهيئة الإعدادات الافتراضية بنجاح' 
    }
  } catch (error) {
    console.error('Error initializing default settings:', error)
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'حدث خطأ أثناء تهيئة الإعدادات' 
    }
  }
}

// أنواع مقاطع الفيديو
export interface VideoClip {
  videoId: string
  startTime: number
  endTime: number
  title?: string
}
