// Seed file disabled - production data is managed exclusively through the dashboard
// DO NOT add any game data here - all games must be entered through the dashboard UI

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('⚠️ Seed file is disabled.')
  console.log('📝 All game data must be entered through the dashboard.')
  console.log('🚫 Do not create seed scripts for game data.')
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
