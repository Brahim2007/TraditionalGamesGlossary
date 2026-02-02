#!/usr/bin/env tsx

// سكريبت اختبار تسجيل الدخول
// Login Test Script

import { db } from '@/lib/db'
import { verifyPassword } from '@/lib/auth/password'

async function testLogin() {
  console.log('🔐 جاري اختبار تسجيل الدخول...')

  // بيانات المستخدمين للاختبار
  const testUsers = [
    { email: 'admin@example.com', password: 'password123' },
    { email: 'reviewer@example.com', password: 'password123' },
    { email: 'editor@example.com', password: 'password123' },
    { email: 'viewer@example.com', password: 'password123' },
  ]

  let allTestsPassed = true

  for (const userData of testUsers) {
    console.log(`\n📋 اختبار تسجيل الدخول لـ: ${userData.email}`)
    
    try {
      // البحث عن المستخدم في قاعدة البيانات
      const contributor = await db.contributor.findUnique({
        where: { email: userData.email.toLowerCase().trim() },
      })

      if (!contributor) {
        console.log(`❌ المستخدم غير موجود: ${userData.email}`)
        allTestsPassed = false
        continue
      }

      console.log(`✅ المستخدم موجود: ${contributor.name}`)
      console.log(`   - الدور: ${contributor.role}`)
      console.log(`   - كلمة المرور المشفرة: ${contributor.passwordHash ? 'نعم' : 'لا'}`)

      if (!contributor.passwordHash) {
        console.log(`❌ لا يوجد تشفير لكلمة المرور`)
        allTestsPassed = false
        continue
      }

      // التحقق من كلمة المرور
      const isValid = await verifyPassword(userData.password, contributor.passwordHash)
      
      if (isValid) {
        console.log(`✅ كلمة المرور صحيحة`)
      } else {
        console.log(`❌ كلمة المرور غير صحيحة`)
        console.log(`   - كلمة المرور المدخلة: ${userData.password}`)
        console.log(`   - التشفير المخزن: ${contributor.passwordHash.substring(0, 30)}...`)
        allTestsPassed = false
      }

      // اختبار كلمة مرور خاطئة
      const wrongPassword = 'wrongpassword'
      const isWrongValid = await verifyPassword(wrongPassword, contributor.passwordHash)
      
      if (!isWrongValid) {
        console.log(`✅ كلمة المرور الخاطئة مرفوضة بشكل صحيح`)
      } else {
        console.log(`❌ كلمة المرور الخاطئة مقبولة! (مشكلة أمنية)`)
        allTestsPassed = false
      }

    } catch (error) {
      console.error(`❌ خطأ في اختبار ${userData.email}:`, error)
      allTestsPassed = false
    }
  }

  // اختبار إضافي: محاكاة دالة تسجيل الدخول من lib/actions/auth.ts
  console.log('\n🔍 اختبار محاكاة دالة تسجيل الدخول...')
  
  try {
    const testEmail = 'admin@example.com'
    const testPassword = 'password123'
    
    const contributor = await db.contributor.findUnique({
      where: { email: testEmail.toLowerCase().trim() },
    })

    if (contributor && contributor.passwordHash) {
      const isValid = await verifyPassword(testPassword, contributor.passwordHash)
      
      if (isValid) {
        console.log(`✅ محاكاة تسجيل الدخول ناجحة لـ ${testEmail}`)
        
        // التحقق من أن المستخدم موجود
        console.log(`✅ حالة المستخدم: موجود`)
      } else {
        console.log(`❌ محاكاة تسجيل الدخول فشلت لـ ${testEmail}`)
        allTestsPassed = false
      }
    } else {
      console.log(`❌ المستخدم غير موجود أو لا يوجد تشفير`)
      allTestsPassed = false
    }
  } catch (error) {
    console.error('❌ خطأ في محاكاة تسجيل الدخول:', error)
    allTestsPassed = false
  }

  // نتيجة الاختبار
  console.log('\n' + '='.repeat(50))
  if (allTestsPassed) {
    console.log('🎉 جميع اختبارات تسجيل الدخول ناجحة!')
    console.log('✅ يمكن للمستخدمين تسجيل الدخول باستخدام:')
    console.log('   - البريد الإلكتروني: admin@example.com')
    console.log('   - كلمة المرور: password123')
  } else {
    console.log('❌ بعض اختبارات تسجيل الدخول فشلت')
    console.log('⚠️  يرجى التحقق من ملفات المصادقة')
  }
  console.log('='.repeat(50))
}

// تشغيل الاختبار
testLogin()
  .then(() => {
    console.log('\n✨ تم الانتهاء من اختبار تسجيل الدخول.')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ فشل في اختبار تسجيل الدخول:', error)
    process.exit(1)
  })