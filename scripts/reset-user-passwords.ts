سم#!/usr/bin/env tsx

// سكريبت إعادة تعيين كلمات مرور المستخدمين
// Reset User Passwords Script

import { db } from '@/lib/db'
import { hashPassword } from '@/lib/auth/password'
import { ContributorRole } from '@prisma/client'

async function resetUserPasswords() {
  console.log('🔐 جاري إعادة تعيين كلمات مرور المستخدمين...')

  // بيانات المستخدمين
  const users = [
    {
      email: 'admin@example.com',
      name: 'مدير النظام',
      role: 'admin' as ContributorRole,
      password: 'password123',
    },
    {
      email: 'reviewer@example.com',
      name: 'مُراجع أول',
      role: 'reviewer' as ContributorRole,
      password: 'password123',
    },
    {
      email: 'editor@example.com',
      name: 'محرر محتوى',
      role: 'editor' as ContributorRole,
      password: 'password123',
    },
    {
      email: 'viewer@example.com',
      name: 'مستعرض',
      role: 'viewer' as ContributorRole,
      password: 'password123',
    },
  ]

  for (const userData of users) {
    try {
      // البحث عن المستخدم
      const existingUser = await db.contributor.findFirst({
        where: { email: userData.email },
      })

      if (!existingUser) {
        console.log(`❌ المستخدم غير موجود: ${userData.email}`)
        continue
      }

      // تشفير كلمة المرور
      const passwordHash = await hashPassword(userData.password)

      // تحديث كلمة المرور
      await db.contributor.update({
        where: { id: existingUser.id },
        data: {
          passwordHash,
          resetToken: null,
          resetTokenExp: null,
        },
      })

      console.log(`✅ تم تحديث كلمة مرور: ${userData.email}`)
      
      // التحقق من التشفير
      const updatedUser = await db.contributor.findUnique({
        where: { id: existingUser.id },
        select: { passwordHash: true }
      })
      
      if (updatedUser?.passwordHash) {
        console.log(`   - التشفير: ${updatedUser.passwordHash.substring(0, 20)}...`)
      }
    } catch (error) {
      console.error(`❌ خطأ في تحديث ${userData.email}:`, error)
    }
  }

  console.log('\n🎉 تم إعادة تعيين جميع كلمات المرور بنجاح!')
  console.log('\n📋 بيانات الدخول الجديدة:')
  console.log('-----------------')
  users.forEach((user) => {
    console.log(`${user.role}: ${user.email} / ${user.password}`)
  })
}

// تشغيل الدالة
resetUserPasswords()
  .then(() => {
    console.log('\n✨ تم الانتهاء من عملية إعادة التعيين.')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ فشل في عملية إعادة التعيين:', error)
    process.exit(1)
  })