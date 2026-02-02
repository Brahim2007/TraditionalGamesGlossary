// سكريبت تنظيف قاعدة البيانات قبل النشر على Vercel
// يحذف جميع الألعاب الوهمية والبيانات المرتبطة بها
// ويبقي على التصنيفات وبيانات المديرين

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🧹 بدء عملية تنظيف قاعدة البيانات...')
  console.log('⚠️  سيتم حذف جميع الألعاب والبيانات المرتبطة بها')
  console.log('✅ سيتم الإبقاء على: التصنيفات، الدول، المجالات التراثية، الوسوم، والمستخدمين\n')

  try {
    // عد السجلات قبل الحذف
    const gamesCount = await prisma.game.count()
    const mediaCount = await prisma.media.count()
    const referencesCount = await prisma.reference.count()
    const gameTagsCount = await prisma.gameTag.count()
    const reviewLogsCount = await prisma.reviewLog.count()
    const similaritiesCount = await prisma.gameSimilarity.count()
    const conceptsCount = await prisma.gameConcept.count()

    console.log('📊 الإحصائيات الحالية:')
    console.log(`   - الألعاب: ${gamesCount}`)
    console.log(`   - الوسائط: ${mediaCount}`)
    console.log(`   - المراجع: ${referencesCount}`)
    console.log(`   - روابط الوسوم: ${gameTagsCount}`)
    console.log(`   - سجلات المراجعة: ${reviewLogsCount}`)
    console.log(`   - علاقات التشابه: ${similaritiesCount}`)
    console.log(`   - المفاهيم: ${conceptsCount}\n`)

    // حذف البيانات المرتبطة بالألعاب (بالترتيب الصحيح لتجنب مشاكل المفاتيح الخارجية)
    console.log('🗑️  جاري حذف البيانات المرتبطة بالألعاب...')

    // 1. حذف سجلات المراجعة (ReviewLogs)
    const deletedReviewLogs = await prisma.reviewLog.deleteMany({})
    console.log(`   ✅ تم حذف ${deletedReviewLogs.count} سجل مراجعة`)

    // 2. حذف علاقات التشابه (GameSimilarity)
    const deletedSimilarities = await prisma.gameSimilarity.deleteMany({})
    console.log(`   ✅ تم حذف ${deletedSimilarities.count} علاقة تشابه`)

    // 3. حذف الوسائط (Media)
    const deletedMedia = await prisma.media.deleteMany({})
    console.log(`   ✅ تم حذف ${deletedMedia.count} وسيط`)

    // 4. حذف المراجع (References)
    const deletedReferences = await prisma.reference.deleteMany({})
    console.log(`   ✅ تم حذف ${deletedReferences.count} مرجع`)

    // 5. حذف روابط الوسوم (GameTag)
    const deletedGameTags = await prisma.gameTag.deleteMany({})
    console.log(`   ✅ تم حذف ${deletedGameTags.count} رابط وسم`)

    // 6. إزالة ربط الألعاب بالمفاهيم (GameConcept) - يجب أن يكون قبل حذف الألعاب
    const updatedGames = await prisma.game.updateMany({
      data: { conceptId: null }
    })
    console.log(`   ✅ تم إزالة ربط ${updatedGames.count} لعبة بالمفاهيم`)

    // 7. حذف جميع الألعاب (Games)
    const deletedGames = await prisma.game.deleteMany({})
    console.log(`   ✅ تم حذف ${deletedGames.count} لعبة`)

    // 8. حذف المفاهيم التي لا ترتبط بألعاب (GameConcept) - اختياري
    // يمكن حذفها أو الإبقاء عليها حسب الحاجة
    const deletedConcepts = await prisma.gameConcept.deleteMany({})
    console.log(`   ✅ تم حذف ${deletedConcepts.count} مفهوم`)

    // التحقق من البيانات المحفوظة
    console.log('\n✅ البيانات المحفوظة:')
    const countriesCount = await prisma.country.count()
    const heritageFieldsCount = await prisma.heritageField.count()
    const tagsCount = await prisma.tag.count()
    const categoriesCount = await prisma.category.count()
    const contributorsCount = await prisma.contributor.count()
    const sessionsCount = await prisma.session.count()
    const settingsCount = await prisma.settings.count()
    const suggestionsCount = await prisma.gameSuggestion.count()

    console.log(`   ✅ الدول: ${countriesCount}`)
    console.log(`   ✅ المجالات التراثية: ${heritageFieldsCount}`)
    console.log(`   ✅ الوسوم: ${tagsCount}`)
    console.log(`   ✅ التصنيفات: ${categoriesCount}`)
    console.log(`   ✅ المستخدمين/المديرين: ${contributorsCount}`)
    console.log(`   ✅ الجلسات: ${sessionsCount}`)
    console.log(`   ✅ الإعدادات: ${settingsCount}`)
    console.log(`   ✅ اقتراحات الألعاب: ${suggestionsCount}`)

    console.log('\n✨ تم تنظيف قاعدة البيانات بنجاح!')
    console.log('📝 ملاحظة: جميع التصنيفات وبيانات المديرين محفوظة')
    console.log('🚀 جاهز للنشر على Vercel!')

  } catch (error) {
    console.error('❌ حدث خطأ أثناء تنظيف قاعدة البيانات:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error('❌ فشلت عملية التنظيف:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
