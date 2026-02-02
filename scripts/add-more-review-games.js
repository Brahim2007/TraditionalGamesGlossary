// Script to add more games for review testing
// سكريبت لإضافة المزيد من الألعاب للمراجعة

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function addMoreReviewGames() {
  try {
    // Get all published/draft games
    const games = await prisma.game.findMany({
      where: {
        OR: [
          { reviewStatus: 'published' },
          { reviewStatus: 'draft' }
        ]
      },
      take: 5
    })

    if (games.length === 0) {
      console.log('❌ لا توجد ألعاب كافية في قاعدة البيانات')
      return
    }

    // Update them to under_review
    const updated = await prisma.game.updateMany({
      where: {
        id: {
          in: games.map(g => g.id)
        }
      },
      data: {
        reviewStatus: 'under_review'
      }
    })

    console.log(`✅ تم تعيين ${updated.count} ${updated.count === 1 ? 'لعبة' : 'ألعاب'} للمراجعة بنجاح`)
    console.log('\nالألعاب المضافة:')
    games.forEach((game, index) => {
      console.log(`   ${index + 1}. ${game.canonicalName}`)
    })
    console.log(`\nيمكنك الآن زيارة: http://localhost:3004/dashboard/review`)
  } catch (error) {
    console.error('❌ خطأ:', error)
  } finally {
    await prisma.$disconnect()
  }
}

addMoreReviewGames()
