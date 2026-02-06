// Seed file disabled - real data is managed through the dashboard
// This file is kept empty to prevent accidental overwrite of production data

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('⚠️ Seed file is disabled. Use the dashboard to manage games.')
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
