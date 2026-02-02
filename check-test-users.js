const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkTestUsers() {
  const testEmails = [
    'admin@example.com',
    'reviewer@example.com', 
    'editor@example.com',
    'viewer@example.com'
  ]

  console.log('🔍 Checking for test users in database...\n')

  for (const email of testEmails) {
    try {
      const user = await prisma.contributor.findUnique({
        where: { email }
      })

      if (user) {
        console.log(`✅ ${email} exists:`)
        console.log(`   Name: ${user.name}`)
        console.log(`   Role: ${user.role}`)
        console.log(`   Has password: ${user.passwordHash ? 'Yes' : 'No'}`)
        console.log('')
      } else {
        console.log(`❌ ${email} - NOT FOUND`)
      }
    } catch (error) {
      console.error(`Error checking ${email}:`, error.message)
    }
  }

  // Also check what users actually exist
  console.log('\n📋 All existing contributors:')
  const allUsers = await prisma.contributor.findMany({
    select: { 
      email: true, 
      name: true, 
      role: true,
      passwordHash: true 
    },
    take: 10
  })
  
  allUsers.forEach(user => {
    console.log(`   ${user.email} (${user.name}) - Role: ${user.role} - Has password: ${user.passwordHash ? 'Yes' : 'No'}`)
  })

  await prisma.$disconnect()
}

checkTestUsers().catch(console.error)