#!/usr/bin/env tsx

// Seed Test Users Script
// سكريبت إضافة مستخدمين اختباريين

import { db } from '@/lib/db'
import { hashPassword } from '@/lib/auth/password'
import { ContributorRole } from '@prisma/client'

async function seedTestUsers() {
  console.log('🌱 جاري إضافة المستخدمين الاختباريين...')

  // Test users data
  const testUsers = [
    {
      email: 'admin@example.com',
      name: 'مدير النظام',
      role: 'admin' as ContributorRole,
      institution: 'وزارة التراث',
      password: 'password123',
    },
    {
      email: 'reviewer@example.com',
      name: 'مُراجع أول',
      role: 'reviewer' as ContributorRole,
      institution: 'جامعة القاهرة',
      password: 'password123',
    },
    {
      email: 'editor@example.com',
      name: 'محرر محتوى',
      role: 'editor' as ContributorRole,
      institution: 'مؤسسة الألعاب الشعبية',
      password: 'password123',
    },
    {
      email: 'viewer@example.com',
      name: 'مستعرض',
      role: 'viewer' as ContributorRole,
      institution: 'باحث مستقل',
      password: 'password123',
    },
  ]

  for (const userData of testUsers) {
    try {
      // Check if user already exists (using findFirst to avoid emailVerified issue)
      const existingUser = await db.contributor.findFirst({
        where: { email: userData.email },
      })

      if (existingUser) {
        console.log(`✅ المستخدم موجود بالفعل: ${userData.email}`)
        continue
      }

      // Hash password
      const passwordHash = await hashPassword(userData.password)

      // Create user
      await db.contributor.create({
        data: {
          email: userData.email,
          name: userData.name,
          role: userData.role,
          institution: userData.institution,
          passwordHash,
        },
      })

      console.log(`✅ تم إنشاء المستخدم: ${userData.email} (${userData.role})`)
    } catch (error) {
      console.error(`❌ خطأ في إنشاء المستخدم ${userData.email}:`, error)
    }
  }

  console.log('🎉 تم إضافة جميع المستخدمين الاختباريين بنجاح!')
  console.log('\n📋 بيانات الدخول:')
  console.log('-----------------')
  testUsers.forEach((user) => {
    console.log(`${user.role}: ${user.email} / ${user.password}`)
  })
}

// Run the seed function
seedTestUsers()
  .then(() => {
    console.log('\n✨ تم الانتهاء من عملية الإضافة.')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ فشل في عملية الإضافة:', error)
    process.exit(1)
  })