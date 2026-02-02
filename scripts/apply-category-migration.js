/**
 * Script to apply Category table migration and seed default data
 * Run this after updating the schema to add categories functionality
 * 
 * Usage: node scripts/apply-category-migration.js
 */

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Default categories data
const defaultCategories = [
  {
    name: 'الكل',
    slug: 'all',
    description: 'عرض جميع الألعاب',
    icon: 'LayoutGrid',
    order: 0,
    isActive: true,
    color: '#3B7C5F',
  },
  {
    name: 'ألعاب حركية',
    slug: 'physical-games',
    description: 'ألعاب تعتمد على الحركة والنشاط البدني',
    icon: 'Activity',
    order: 1,
    isActive: true,
    color: '#10B981',
  },
  {
    name: 'ألعاب ذهنية',
    slug: 'mental-games',
    description: 'ألعاب تعتمد على التفكير والذكاء',
    icon: 'Brain',
    order: 2,
    isActive: true,
    color: '#8B5CF6',
  },
  {
    name: 'تراث خليجي',
    slug: 'gulf-heritage',
    description: 'ألعاب من التراث الخليجي',
    icon: 'Award',
    order: 3,
    isActive: true,
    color: '#F59E0B',
  },
  {
    name: 'ألعاب بحرية',
    slug: 'sea-games',
    description: 'ألعاب مرتبطة بالبحر والساحل',
    icon: 'Anchor',
    order: 4,
    isActive: true,
    color: '#3B82F6',
  },
  {
    name: 'تراث عراقي',
    slug: 'iraqi-heritage',
    description: 'ألعاب من التراث العراقي',
    icon: 'ScrollText',
    order: 5,
    isActive: true,
    color: '#DC2626',
  },
  {
    name: 'ألعاب طريفة',
    slug: 'fun-games',
    description: 'ألعاب مسلية وطريفة',
    icon: 'Smile',
    order: 6,
    isActive: true,
    color: '#EC4899',
  },
]

async function main() {
  console.log('🚀 Starting Category migration...\n')

  try {
    // Check if Category table exists by trying to count
    let tableExists = false
    try {
      await prisma.category.count()
      tableExists = true
      console.log('✅ Category table already exists\n')
    } catch (error) {
      console.log('⚠️  Category table does not exist yet')
      console.log('📝 Please run: npx prisma db push\n')
      console.log('After running the command above, run this script again.\n')
      process.exit(1)
    }

    // Check existing categories
    const existingCount = await prisma.category.count()
    console.log(`📊 Found ${existingCount} existing categories\n`)

    // Create or update default categories
    let created = 0
    let skipped = 0

    for (const category of defaultCategories) {
      try {
        // Check if category exists by name
        const existing = await prisma.category.findUnique({
          where: { name: category.name }
        })

        if (existing) {
          console.log(`⏭️  Skipping "${category.name}" - already exists`)
          skipped++
        } else {
          await prisma.category.create({
            data: category
          })
          console.log(`✅ Created "${category.name}"`)
          created++
        }
      } catch (error) {
        console.error(`❌ Error with "${category.name}":`, error.message)
      }
    }

    console.log('\n' + '='.repeat(60))
    console.log(`✅ Migration completed!`)
    console.log(`📊 Created: ${created} categories`)
    console.log(`⏭️  Skipped: ${skipped} categories (already exist)`)
    console.log('='.repeat(60) + '\n')

    // List all categories
    const allCategories = await prisma.category.findMany({
      orderBy: { order: 'asc' }
    })

    console.log('📋 All categories in database:')
    allCategories.forEach((cat, index) => {
      const status = cat.isActive ? '✓ Active' : '✗ Inactive'
      const color = cat.color || 'No color'
      console.log(`   ${index + 1}. ${cat.name}`)
      console.log(`      Slug: ${cat.slug}`)
      console.log(`      Icon: ${cat.icon} | Color: ${color} | ${status}`)
    })

    console.log('\n✨ Success! You can now manage categories from the dashboard.')
    console.log('🔗 Go to: http://localhost:3000/dashboard/categories\n')

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message)
    console.error('Full error:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch(error => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
