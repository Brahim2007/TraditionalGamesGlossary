import React from 'react'
import { 
  ScrollText, Target, ShieldCheck, Users, Globe, BookOpen, 
  Database, Code, Award, Heart, Sparkles, TrendingUp,
  FileText, GitBranch, Layers, Zap, Lock, Search,
  Map, Languages, CheckCircle2, ArrowRight, BookMarked,
  Workflow, BarChart3, Shield, Cpu, Server, Cloud
} from 'lucide-react'
import Link from 'next/link'
import { db } from '@/lib/db'

export default async function AboutPage() {
  // جلب إحصائيات حقيقية من قاعدة البيانات
  const [
    totalGames,
    totalCountries,
    totalContributors,
    totalTags,
    publishedGames,
    pendingReview
  ] = await Promise.all([
    db.game.count(),
    db.country.count(),
    db.contributor.count(),
    db.tag.count(),
    db.game.count({ where: { reviewStatus: 'published' } }),
    db.game.count({ where: { reviewStatus: 'under_review' } })
  ])

  // حساب الأقاليم
  const countries = await db.country.findMany({ select: { region: true } })
  const totalRegions = new Set(countries.map(c => c.region).filter(Boolean)).size

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-brand-deepest via-brand to-brand-light py-24">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-accent rounded-full blur-3xl animate-blob" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-blob animation-delay-2000" />
        </div>
        
        <div className="relative z-10 mx-auto max-w-6xl px-6 text-center">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border-2 border-white/30 bg-white/10 backdrop-blur-lg px-6 py-3 text-sm font-bold text-white shadow-2xl">
            <ScrollText className="h-5 w-5" />
            قصتنا وهويتنا
          </span>
          <h1 className="mb-6 text-5xl md:text-7xl font-black leading-tight text-white drop-shadow-2xl">
            المسرد التوثيقي <span className="text-accent">للألعاب التراثية العربية</span>
          </h1>
          <p className="mx-auto max-w-3xl text-xl md:text-2xl font-semibold leading-relaxed text-white/95 drop-shadow-lg">
            أرشيف رقمي بمعايير اليونسكو لتوثيق وحفظ الألعاب الشعبية العربية 
            كتراث ثقافي غير مادي للأجيال القادمة
          </p>
        </div>
      </div>

      {/* إحصائيات سريعة */}
      <div className="relative -mt-12 z-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="group bg-white rounded-2xl border-2 border-gray-100 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between mb-2">
                <BookOpen className="h-8 w-8 text-brand" />
                <div className="text-3xl font-black text-brand-deepest">{totalGames}</div>
              </div>
              <div className="text-sm font-bold text-gray-600">لعبة موثقة</div>
            </div>
            
            <div className="group bg-white rounded-2xl border-2 border-gray-100 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between mb-2">
                <Globe className="h-8 w-8 text-accent" />
                <div className="text-3xl font-black text-brand-deepest">{totalCountries}</div>
              </div>
              <div className="text-sm font-bold text-gray-600">دولة عربية</div>
            </div>
            
            <div className="group bg-white rounded-2xl border-2 border-gray-100 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between mb-2">
                <Users className="h-8 w-8 text-brand-light" />
                <div className="text-3xl font-black text-brand-deepest">{totalContributors}</div>
              </div>
              <div className="text-sm font-bold text-gray-600">مساهم</div>
            </div>
            
            <div className="group bg-white rounded-2xl border-2 border-gray-100 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between mb-2">
                <Map className="h-8 w-8 text-accent-dark" />
                <div className="text-3xl font-black text-brand-deepest">{totalRegions}</div>
              </div>
              <div className="text-sm font-bold text-gray-600">إقليم</div>
            </div>
          </div>
        </div>
      </div>

      {/* الرؤية والرسالة */}
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-brand-deepest mb-4">
            رؤيتنا ورسالتنا
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-brand to-accent mx-auto rounded-full" />
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="group relative overflow-hidden rounded-3xl border-2 border-gray-100 bg-gradient-to-br from-white to-gray-50 p-10 shadow-lg hover:shadow-2xl transition-all duration-500">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-full -mr-16 -mt-16" />
            <Target className="relative z-10 mb-6 h-12 w-12 text-brand" />
            <h3 className="relative z-10 mb-4 text-2xl font-black text-brand-deepest">
              الرؤية
            </h3>
            <p className="relative z-10 leading-relaxed text-gray-700 text-lg">
              أن نكون المرجع الرقمي الأول لتوثيق التراث الثقافي غير المادي في المنطقة العربية،
              ونموذجاً عالمياً في حفظ الألعاب الشعبية بمعايير أرشفة علمية دقيقة.
            </p>
          </div>

          <div className="group relative overflow-hidden rounded-3xl border-2 border-gray-100 bg-gradient-to-br from-white to-gray-50 p-10 shadow-lg hover:shadow-2xl transition-all duration-500">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -mr-16 -mt-16" />
            <Heart className="relative z-10 mb-6 h-12 w-12 text-accent" />
            <h3 className="relative z-10 mb-4 text-2xl font-black text-brand-deepest">
              الرسالة
            </h3>
            <p className="relative z-10 leading-relaxed text-gray-700 text-lg">
              نسعى لتوثيق الألعاب الشعبية العربية ليس فقط كقواعد وحركات، بل كسياق اجتماعي
              وثقافي يعكس قيم المجتمعات وتطورها عبر الزمن، مع إتاحتها للباحثين والأجيال القادمة.
            </p>
          </div>
        </div>
      </div>

      {/* المبادئ الأساسية */}
      <div className="bg-gradient-to-br from-gray-50 to-white py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-brand-deepest mb-4">
              المبادئ الأساسية
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              نعتمد على منهجية علمية صارمة في توثيق التراث الثقافي
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group bg-white rounded-2xl border-2 border-gray-100 p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand/10 group-hover:bg-brand group-hover:scale-110 transition-all duration-300">
                <Database className="h-8 w-8 text-brand group-hover:text-white transition-colors" />
              </div>
              <h4 className="mb-3 text-xl font-black text-brand-deepest">الأرشفة أولاً</h4>
              <p className="text-gray-600 leading-relaxed">
                نعامل الألعاب كسجلات أرشيفية، لا كمقالات مدونة. كل لعبة لها بيانات منظمة ومعايير توثيق صارمة.
              </p>
            </div>

            <div className="group bg-white rounded-2xl border-2 border-gray-100 p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10 group-hover:bg-accent group-hover:scale-110 transition-all duration-300">
                <Layers className="h-8 w-8 text-accent group-hover:text-brand-deepest transition-colors" />
              </div>
              <h4 className="mb-3 text-xl font-black text-brand-deepest">الفصل الدلالي</h4>
              <p className="text-gray-600 leading-relaxed">
                نحافظ على الفصل بين الوصف، القواعد، الموروث الشفهي، والسياق الاجتماعي كوحدات مستقلة.
              </p>
            </div>

            <div className="group bg-white rounded-2xl border-2 border-gray-100 p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-light/10 group-hover:bg-brand-light group-hover:scale-110 transition-all duration-300">
                <Languages className="h-8 w-8 text-brand-light group-hover:text-white transition-colors" />
              </div>
              <h4 className="mb-3 text-xl font-black text-brand-deepest">عربي أولاً</h4>
              <p className="text-gray-600 leading-relaxed">
                واجهة عربية كاملة مع دعم RTL، ومعالجة متقدمة للنصوص العربية والجذور اللغوية.
              </p>
            </div>

            <div className="group bg-white rounded-2xl border-2 border-gray-100 p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100 group-hover:bg-purple-500 group-hover:scale-110 transition-all duration-300">
                <BookMarked className="h-8 w-8 text-purple-600 group-hover:text-white transition-colors" />
              </div>
              <h4 className="mb-3 text-xl font-black text-brand-deepest">مفردات محكومة</h4>
              <p className="text-gray-600 leading-relaxed">
                نستخدم تصنيفات متوافقة مع معايير اليونسكو للتراث الثقافي غير المادي.
              </p>
            </div>

            <div className="group bg-white rounded-2xl border-2 border-gray-100 p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 group-hover:bg-blue-500 group-hover:scale-110 transition-all duration-300">
                <Shield className="h-8 w-8 text-blue-600 group-hover:text-white transition-colors" />
              </div>
              <h4 className="mb-3 text-xl font-black text-brand-deepest">بيانات منظمة</h4>
              <p className="text-gray-600 leading-relaxed">
                جميع المحتويات مخزنة في صيغ قابلة للاستعلام والتحليل، مع علاقات دلالية واضحة.
              </p>
            </div>

            <div className="group bg-white rounded-2xl border-2 border-gray-100 p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 group-hover:bg-green-500 group-hover:scale-110 transition-all duration-300">
                <Workflow className="h-8 w-8 text-green-600 group-hover:text-white transition-colors" />
              </div>
              <h4 className="mb-3 text-xl font-black text-brand-deepest">سير عمل احترافي</h4>
              <p className="text-gray-600 leading-relaxed">
                نظام مراجعة متعدد المستويات مع سجل تدقيق كامل لكل تغيير في البيانات.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* البنية التقنية */}
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-brand-deepest mb-4">
            البنية التقنية المتقدمة
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            نستخدم أحدث التقنيات لضمان أداء عالٍ وأمان محكم
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl border-2 border-blue-100 p-6 hover:shadow-lg transition-all">
            <Code className="h-10 w-10 text-blue-600 mb-4" />
            <h4 className="font-black text-brand-deepest mb-2">Next.js 15</h4>
            <p className="text-sm text-gray-600">App Router مع Server Components</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl border-2 border-purple-100 p-6 hover:shadow-lg transition-all">
            <Server className="h-10 w-10 text-purple-600 mb-4" />
            <h4 className="font-black text-brand-deepest mb-2">PostgreSQL</h4>
            <p className="text-sm text-gray-600">قاعدة بيانات قوية مع دعم PostGIS</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl border-2 border-green-100 p-6 hover:shadow-lg transition-all">
            <Database className="h-10 w-10 text-green-600 mb-4" />
            <h4 className="font-black text-brand-deepest mb-2">Prisma ORM</h4>
            <p className="text-sm text-gray-600">Type-safe database access</p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-white rounded-2xl border-2 border-orange-100 p-6 hover:shadow-lg transition-all">
            <Cpu className="h-10 w-10 text-orange-600 mb-4" />
            <h4 className="font-black text-brand-deepest mb-2">TypeScript</h4>
            <p className="text-sm text-gray-600">Strict mode للأمان التام</p>
          </div>

          <div className="bg-gradient-to-br from-pink-50 to-white rounded-2xl border-2 border-pink-100 p-6 hover:shadow-lg transition-all">
            <Sparkles className="h-10 w-10 text-pink-600 mb-4" />
            <h4 className="font-black text-brand-deepest mb-2">Tailwind CSS</h4>
            <p className="text-sm text-gray-600">تصميم حديث ومتجاوب</p>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-white rounded-2xl border-2 border-indigo-100 p-6 hover:shadow-lg transition-all">
            <Search className="h-10 w-10 text-indigo-600 mb-4" />
            <h4 className="font-black text-brand-deepest mb-2">Full-Text Search</h4>
            <p className="text-sm text-gray-600">بحث عربي متقدم</p>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-white rounded-2xl border-2 border-red-100 p-6 hover:shadow-lg transition-all">
            <Lock className="h-10 w-10 text-red-600 mb-4" />
            <h4 className="font-black text-brand-deepest mb-2">NextAuth.js</h4>
            <p className="text-sm text-gray-600">مصادقة آمنة</p>
          </div>

          <div className="bg-gradient-to-br from-teal-50 to-white rounded-2xl border-2 border-teal-100 p-6 hover:shadow-lg transition-all">
            <Cloud className="h-10 w-10 text-teal-600 mb-4" />
            <h4 className="font-black text-brand-deepest mb-2">Vercel</h4>
            <p className="text-sm text-gray-600">استضافة سريعة وموثوقة</p>
          </div>
        </div>
      </div>

      {/* المنهجية العلمية */}
      <div className="bg-brand-deepest py-24 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              المنهجية العلمية
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              نعتمد معايير صارمة في التوثيق والمراجعة
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white/10 backdrop-blur-lg border-2 border-white/20">
                <FileText className="h-10 w-10 text-accent" />
              </div>
              <h4 className="mb-3 text-xl font-bold">المصادر الموثوقة</h4>
              <p className="text-white/80 leading-relaxed">
                نعتمد على المصادر المكتوبة الموثوقة والروايات الشفوية من كبار السن،
                مع التحقق من صحة المعلومات.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white/10 backdrop-blur-lg border-2 border-white/20">
                <CheckCircle2 className="h-10 w-10 text-accent" />
              </div>
              <h4 className="mb-3 text-xl font-bold">التدقيق المتعدد</h4>
              <p className="text-white/80 leading-relaxed">
                كل لعبة تمر بمراحل مراجعة متعددة من قبل خبراء ومراجعين متخصصين
                قبل النشر النهائي.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white/10 backdrop-blur-lg border-2 border-white/20">
                <Globe className="h-10 w-10 text-accent" />
              </div>
              <h4 className="mb-3 text-xl font-bold">التنوع الجغرافي</h4>
              <p className="text-white/80 leading-relaxed">
                نوثق الاختلافات الإقليمية في المسميات والقواعد، مع احترام
                الخصوصيات المحلية لكل منطقة.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* التوافق مع اليونسكو */}
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="rounded-3xl border-2 border-accent/20 bg-gradient-to-br from-accent/5 to-white p-12 md:p-16 shadow-xl">
          <div className="flex items-start gap-6 mb-8">
            <div className="flex-shrink-0">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/20">
                <Award className="h-8 w-8 text-accent-dark" />
              </div>
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-brand-deepest mb-4">
                التوافق مع معايير اليونسكو
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                يتبع هذا المشروع المبادئ التوجيهية لاتفاقية صون التراث الثقافي
                غير المادي (2003)، والتي تؤكد على أهمية:
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4 bg-white rounded-xl p-6 border border-gray-100">
              <div className="flex-shrink-0 mt-1">
                <div className="h-3 w-3 rounded-full bg-accent" />
              </div>
              <div>
                <h4 className="font-bold text-brand-deepest mb-2">التوثيق كوسيلة للصون</h4>
                <p className="text-gray-600 text-sm">
                  حفظ المعرفة التراثية في صيغة رقمية منظمة
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-white rounded-xl p-6 border border-gray-100">
              <div className="flex-shrink-0 mt-1">
                <div className="h-3 w-3 rounded-full bg-accent" />
              </div>
              <div>
                <h4 className="font-bold text-brand-deepest mb-2">إشراك المجتمعات المحلية</h4>
                <p className="text-gray-600 text-sm">
                  مشاركة أفراد المجتمع في عملية التوثيق
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-white rounded-xl p-6 border border-gray-100">
              <div className="flex-shrink-0 mt-1">
                <div className="h-3 w-3 rounded-full bg-accent" />
              </div>
              <div>
                <h4 className="font-bold text-brand-deepest mb-2">نقل المعرفة بين الأجيال</h4>
                <p className="text-gray-600 text-sm">
                  جسر يربط الماضي بالمستقبل للأجيال القادمة
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-white rounded-xl p-6 border border-gray-100">
              <div className="flex-shrink-0 mt-1">
                <div className="h-3 w-3 rounded-full bg-accent" />
              </div>
              <div>
                <h4 className="font-bold text-brand-deepest mb-2">احترام التنوع الثقافي</h4>
                <p className="text-gray-600 text-sm">
                  تقدير الاختلافات الإقليمية والثقافية
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* المميزات التقنية */}
      <div className="bg-gradient-to-br from-gray-50 to-white py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-brand-deepest mb-4">
              مميزات تقنية متقدمة
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              تقنيات حديثة لتجربة استخدام استثنائية
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl border-2 border-gray-100 p-8 shadow-lg hover:shadow-xl transition-all">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                    <Zap className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div>
                  <h4 className="text-xl font-black text-brand-deepest mb-2">
                    نظام مطابقة ذكي
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    خوارزميات متقدمة للكشف عن التشابه بين الألعاب بدقة تصل إلى 85%،
                    مع تحليل بنيوي ودلالي وتراثي.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border-2 border-gray-100 p-8 shadow-lg hover:shadow-xl transition-all">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                    <Languages className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div>
                  <h4 className="text-xl font-black text-brand-deepest mb-2">
                    معالجة عربية متقدمة
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    تحليل الجذور اللغوية، معالجة الجمع المكسور، واستخراج الدلالات
                    من النصوص العربية بدقة عالية.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border-2 border-gray-100 p-8 shadow-lg hover:shadow-xl transition-all">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100">
                    <GitBranch className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div>
                  <h4 className="text-xl font-black text-brand-deepest mb-2">
                    سجل تدقيق كامل
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    تتبع كامل لجميع التغييرات على البيانات مع معلومات المحرر والتاريخ
                    والملاحظات لضمان الشفافية.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border-2 border-gray-100 p-8 shadow-lg hover:shadow-xl transition-all">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100">
                    <BarChart3 className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
                <div>
                  <h4 className="text-xl font-black text-brand-deepest mb-2">
                    تحليلات وإحصائيات
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    لوحات تحكم تفاعلية توفر رؤى عميقة حول التوزيع الجغرافي
                    والأنماط الثقافية للألعاب.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* الإحصائيات التفصيلية */}
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-brand-deepest mb-4">
            الإحصائيات والأرقام
          </h2>
          <p className="text-xl text-gray-600">
            أرقام حقيقية من قاعدة البيانات
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="mb-4 text-6xl font-black text-brand-deepest">
              {publishedGames}
            </div>
            <div className="text-lg font-bold text-gray-600 mb-2">لعبة منشورة</div>
            <div className="text-sm text-gray-500">متاحة للجمهور الآن</div>
          </div>

          <div className="text-center">
            <div className="mb-4 text-6xl font-black text-accent">
              {pendingReview}
            </div>
            <div className="text-lg font-bold text-gray-600 mb-2">قيد المراجعة</div>
            <div className="text-sm text-gray-500">في انتظار الموافقة</div>
          </div>

          <div className="text-center">
            <div className="mb-4 text-6xl font-black text-brand-light">
              {totalTags}
            </div>
            <div className="text-lg font-bold text-gray-600 mb-2">تصنيف</div>
            <div className="text-sm text-gray-500">لتنظيم المحتوى</div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-brand-deepest via-brand to-brand-light py-24">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl animate-blob" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-blob animation-delay-2000" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <h2 className="mb-6 text-4xl md:text-5xl font-black text-white">
            شاركنا في توثيق التراث
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-xl text-white/90 leading-relaxed">
            نرحب بمساهماتكم في توثيق الألعاب الشعبية من مختلف الدول العربية.
            انضموا إلينا في حفظ ذاكرة الأجيال وبناء أكبر أرشيف رقمي للتراث الثقافي.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/dashboard/games/new"
              className="group inline-flex items-center gap-3 rounded-2xl bg-accent hover:bg-accent-dark px-8 py-4 text-lg font-bold text-brand-deepest shadow-2xl transition-all duration-300 hover:scale-105"
            >
              <Sparkles className="h-6 w-6 group-hover:rotate-12 transition-transform" />
              أضف لعبة جديدة
              <ArrowRight className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            </Link>
            
            <Link
              href="/gallery"
              className="group inline-flex items-center gap-3 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-lg border-2 border-white/30 px-8 py-4 text-lg font-bold text-white shadow-2xl transition-all duration-300 hover:scale-105"
            >
              <BookOpen className="h-6 w-6 group-hover:scale-110 transition-transform" />
              استكشف المعرض
            </Link>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="bg-gray-50 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="mb-4 text-4xl font-black text-brand-deepest">مفتوح المصدر</div>
              <p className="text-gray-600">
                المشروع مفتوح للجميع ومتاح للباحثين والمهتمين
              </p>
            </div>
            <div>
              <div className="mb-4 text-4xl font-black text-brand-deepest">معايير عالمية</div>
              <p className="text-gray-600">
                نتبع أفضل الممارسات في الأرشفة الرقمية
              </p>
            </div>
            <div>
              <div className="mb-4 text-4xl font-black text-brand-deepest">مجتمع نشط</div>
              <p className="text-gray-600">
                مساهمون من مختلف الدول العربية
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
