// Test Similarity Engine
// اختبار محرك التشابه

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Simple similarity calculation for testing
function calculateSimpleSimilarity(gameA, gameB) {
  console.log('\n🔍 حساب التشابه المبسط بين اللعبتين...')
  
  // Check if same country
  const sameCountry = gameA.countryId === gameB.countryId
  const sameHeritage = gameA.heritageFieldId === gameB.heritageFieldId
  
  let score = 0
  if (sameCountry) score += 0.3
  if (sameHeritage) score += 0.3
  
  // Check if names are similar
  const nameA = gameA.canonicalName.toLowerCase()
  const nameB = gameB.canonicalName.toLowerCase()
  if (nameA.includes(nameB) || nameB.includes(nameA)) {
    score += 0.4
  }
  
  return Math.min(1, score)
}

async function testSimilarityEngine() {
  console.log('🚀 بدء اختبار محرك التشابه...\n')

  try {
    // Get all published games
    const games = await prisma.game.findMany({
      where: { reviewStatus: 'published' },
      include: {
        heritageField: true,
        country: true,
        tags: { include: { tag: true } },
      },
      take: 3,
    })

    console.log(`📊 عدد الألعاب المسترجعة: ${games.length}`)

    if (games.length < 2) {
      console.log('⚠️  تحتاج إلى لعبتين على الأقل لاختبار التشابه')
      return
    }

    // Test similarity between first two games
    const gameA = games[0]
    const gameB = games[1]

    console.log('\n🎮 اللعبة الأولى:')
    console.log(`   الاسم: ${gameA.canonicalName}`)
    console.log(`   البلد: ${gameA.country.name}`)
    console.log(`   التصنيف: ${gameA.heritageField.name}`)

    console.log('\n🎮 اللعبة الثانية:')
    console.log(`   الاسم: ${gameB.canonicalName}`)
    console.log(`   البلد: ${gameB.country.name}`)
    console.log(`   التصنيف: ${gameB.heritageField.name}`)

    // Calculate simple similarity
    const similarityScore = calculateSimpleSimilarity(gameA, gameB)

    console.log('\n📊 نتائج التشابه المبسط:')
    console.log(`   النتيجة الإجمالية: ${(similarityScore * 100).toFixed(1)}%`)
    console.log(`   نفس البلد: ${gameA.countryId === gameB.countryId ? 'نعم' : 'لا'}`)
    console.log(`   نفس التصنيف: ${gameA.heritageFieldId === gameB.heritageFieldId ? 'نعم' : 'لا'}`)
    
    // Check database for existing similarities
    console.log('\n🔍 التحقق من قاعدة البيانات...')
    
    const existingSimilarities = await prisma.gameSimilarity.findMany({
      where: {
        OR: [
          { gameAId: gameA.id, gameBId: gameB.id },
          { gameAId: gameB.id, gameBId: gameA.id }
        ]
      }
    })
    
    if (existingSimilarities.length > 0) {
      console.log(`   ✅ تم العثور على ${existingSimilarities.length} تطابق في قاعدة البيانات`)
      existingSimilarities.forEach((sim, index) => {
        console.log(`   ${index + 1}. النتيجة: ${(sim.overallScore * 100).toFixed(1)}% - الحالة: ${sim.status}`)
      })
    } else {
      console.log('   ℹ️  لا توجد تطابقات مخزنة في قاعدة البيانات')
    }

    console.log('\n✅ اختبار محرك التشابه اكتمل بنجاح!')

  } catch (error) {
    console.error('❌ خطأ في اختبار محرك التشابه:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run test
testSimilarityEngine()