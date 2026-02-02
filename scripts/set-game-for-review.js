// Script to set a game to under_review status for testing
// استخدم هذا السكريبت لتعيين لعبة للمراجعة

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function setGameForReview() {
  try {
    // Get the first published or draft game
    const game = await prisma.game.findFirst({
      where: {
        OR: [
          { reviewStatus: 'published' },
          { reviewStatus: 'draft' }
        ]
      },
      include: {
        country: true,
        contributor: true
      }
    })

    if (!game) {
      console.log('❌ لا توجد ألعاب في قاعدة البيانات')
      return
    }

    // Update to under_review
    const updated = await prisma.game.update({
      where: { id: game.id },
      data: {
        reviewStatus: 'under_review'
      }
    })

    console.log('✅ تم تعيين اللعبة للمراجعة بنجاح:')
    console.log(`   - الاسم: ${updated.canonicalName}`)
    console.log(`   - الدولة: ${game.country.name}`)
    console.log(`   - المساهم: ${game.contributor?.name || 'غير محدد'}`)
    console.log(`   - الحالة: ${updated.reviewStatus}`)
    console.log(`\nيمكنك الآن زيارة: http://localhost:3001/dashboard/review`)
  } catch (error) {
    console.error('❌ خطأ:', error)
  } finally {
    await prisma.$disconnect()
  }
}

setGameForReview()
