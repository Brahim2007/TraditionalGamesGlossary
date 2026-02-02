// Script to test the review API
// سكريبت لاختبار API المراجعة

async function testReviewAPI() {
  try {
    console.log('🧪 اختبار API المراجعة...\n')

    // Test GET /api/review
    console.log('1️⃣ اختبار جلب قائمة المراجعة...')
    const response = await fetch('http://localhost:3001/api/review', {
      headers: {
        'Cookie': 'session=test' // You'll need a valid session
      }
    })

    console.log(`   الحالة: ${response.status}`)
    
    if (response.ok) {
      const data = await response.json()
      console.log(`   ✅ نجح الطلب`)
      console.log(`   📊 الإحصائيات:`)
      console.log(`      - قيد المراجعة: ${data.stats?.pending || 0}`)
      console.log(`      - موافق عليها: ${data.stats?.approved || 0}`)
      console.log(`      - مرفوضة: ${data.stats?.rejected || 0}`)
      console.log(`   📝 عدد الألعاب: ${data.pendingGames?.length || 0}`)
      
      if (data.pendingGames && data.pendingGames.length > 0) {
        console.log(`\n   الألعاب قيد المراجعة:`)
        data.pendingGames.forEach((game, index) => {
          console.log(`      ${index + 1}. ${game.canonicalName} (${game.country.name})`)
        })
      }
    } else {
      const error = await response.json()
      console.log(`   ❌ فشل الطلب: ${error.message}`)
      console.log(`   💡 تلميح: تأكد من تسجيل الدخول كمراجع أو مدير`)
    }

    console.log('\n✅ انتهى الاختبار')
    console.log('\n🌐 يمكنك زيارة الصفحة على:')
    console.log('   http://localhost:3001/dashboard/review')

  } catch (error) {
    console.error('❌ خطأ في الاختبار:', error.message)
  }
}

testReviewAPI()
