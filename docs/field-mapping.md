# تعيين الحقول - قاعدة البيانات، واجهة العرض، وواجهة API

## نظرة عامة
هذا المستند يوضح تعيين الحقول الـ 23 المطلوبة بين:
1. **قاعدة البيانات** (Prisma Schema)
2. **صفحة عرض اللعبة** (Game Detail Page)
3. **واجهة API للداشبورد** (Dashboard API)

## جدول التعيين الكامل

| # | اسم الحقل (للاستيراد) | اسم الحقل في قاعدة البيانات | نوع البيانات | صفحة العرض | واجهة API | ملاحظات |
|---|------------------------|----------------------------|--------------|------------|-----------|----------|
| 1 | اسم اللعبة | `canonicalName` | `String @db.Text` | ✅ العنوان الرئيسي | ✅ متوفر | الاسم الأساسي للعبة |
| 2 | المسميات المحلية | `localNames` | `String[]` | ✅ في الهيدر | ✅ متوفر | أسماء بديلة للعبة |
| 3 | الدولة | `country.name` | `Country` relation | ✅ في الهيدر والجانب | ✅ متوفر | عبر علاقة مع جدول الدول |
| 4 | الإقليم | `region` | `String? @db.Text` | ✅ في الهيدر والجانب | ✅ متوفر | المنطقة الجغرافية |
| 5 | مجال التراث | `heritageField.name` | `HeritageField` relation | ✅ في الهيدر والجانب | ✅ متوفر | عبر علاقة مع جدول مجالات التراث |
| 6 | نوع اللعبة | `gameType` | `String` | ✅ في المعلومات الأساسية | ✅ متوفر | تصنيف الأداء |
| 7 | تاجات التصنيف | `tags` | `GameTag[]` relation | ✅ في الجانب الأيمن | ✅ متوفر | عبر جدول الوسوم |
| 8 | الفئة العمرية | `ageGroup` | `String? @db.Text` | ✅ في المعلومات الأساسية | ✅ متوفر | النطاق العمري |
| 9 | وصف الفئة العمرية | `ageGroupDetails` | `String? @db.Text` | ✅ في المعلومات الأساسية | ✅ متوفر | الخصائص النمائية |
| 10 | الممارسون | `practitioners` | `String?` | ✅ في المعلومات الأساسية | ✅ متوفر | الجنس (مختلط، ذكور، إناث) |
| 11 | وصف الممارسين | `practitionersDetails` | `String? @db.Text` | ✅ في المعلومات الأساسية | ✅ متوفر | السياق الاجتماعي للممارس |
| 12 | عدد اللاعبين | `playersCount` | `String?` | ✅ في المعلومات الأساسية | ✅ متوفر | العدد |
| 13 | وصف اللاعبين | `playersDetails` | `String? @db.Text` | ✅ في المعلومات الأساسية | ✅ متوفر | توزيع الأدوار |
| 14 | الأدوات | `tools` | `String[]` | ✅ في المعلومات الأساسية | ✅ متوفر | الأدوات المستخدمة |
| 15 | المكان | `environment` | `String? @db.Text` | ✅ في الجانب الأيمن | ✅ متوفر | بيئة اللعب |
| 16 | الوقت | `timing` | `String? @db.Text` | ✅ في المعلومات الأساسية والجانب | ✅ متوفر | التوقيت المفضل |
| 17 | الوصف الموسع | `description` | `String @db.Text` | ✅ قسم الوصف | ✅ متوفر | شرح فكرة اللعبة |
| 18 | قواعد اللعب | `rules` | `String[]` | ✅ قسم قواعد اللعب | ✅ متوفر | الخطوات التسلسلية |
| 19 | نظام الفوز والخسارة | `winLossSystem` | `String? @db.Text` | ✅ قسم نظام الفوز والخسارة | ✅ متوفر | معايير التقييم |
| 20 | آلية البدء والانتهاء | `startEndMechanism` | `String? @db.Text` | ✅ قسم آلية البدء والانتهاء | ✅ متوفر | لحظة الانطلاق والختام |
| 21 | الموروث الشفهي | `oralTradition` | `String? @db.Text` | ✅ قسم الموروث الشفهي | ✅ متوفر | الأهازيج أو الصيحات |
| 22 | السياق الاجتماعي | `socialContext` | `String? @db.Text` | ✅ قسم السياق الاجتماعي | ✅ متوفر | القيم المستفادة |
| 23 | المراجع | `references` | `Reference[]` relation | ✅ قسم المراجع | ✅ متوفر | المصادر والتوثيق |

## تفاصيل قاعدة البيانات (Prisma Schema)

### نموذج Game الرئيسي
```prisma
model Game {
  // الحقول الأساسية
  canonicalName     String   @db.Text      // اسم اللعبة
  englishName       String?  @db.Text      // الاسم الإنجليزي (مضاف حديثاً)
  localNames        String[]               // المسميات المحلية
  
  // الجغرافيا
  countryId         String                 // الدولة
  region            String?  @db.Text      // الإقليم
  
  // التراث
  heritageFieldId   String                 // مجال التراث
  
  // خصائص اللعبة
  gameType          String                 // نوع اللعبة
  ageGroup          String?  @db.Text      // الفئة العمرية
  ageGroupDetails   String?  @db.Text      // وصف الفئة العمرية
  practitioners     String?                // الممارسون
  practitionersDetails String? @db.Text    // وصف الممارسين
  playersCount      String?                // عدد اللاعبين
  playersDetails    String?  @db.Text      // وصف اللاعبين
  
  // البيئة والأدوات
  tools             String[]               // الأدوات
  environment       String?  @db.Text      // المكان
  timing            String?  @db.Text      // الوقت
  
  // المحتوى الوصفي
  description       String   @db.Text      // الوصف الموسع
  rules             String[]               // قواعد اللعب
  winLossSystem     String?  @db.Text      // نظام الفوز والخسارة
  startEndMechanism String?  @db.Text      // آلية البدء والانتهاء
  oralTradition     String?  @db.Text      // الموروث الشفهي
  socialContext     String?  @db.Text      // السياق الاجتماعي
  
  // العلاقات
  tags              GameTag[]              // تاجات التصنيف
  references        Reference[]            // المراجع
  // ... حقول أخرى
}
```

## تفاصيل صفحة العرض (Game Detail Page)

### الأقسام المعروضة في `app/(public)/game/[slug]/page.tsx`:

1. **الهيدر الرئيسي** (السطور 83-119):
   - `canonicalName` - اسم اللعبة
   - `localNames` - المسميات المحلية
   - `country.name` - الدولة
   - `region` - الإقليم
   - `heritageField.name` - مجال التراث

2. **المعلومات الأساسية** (السطور 158-227):
   - `ageGroup` + `ageGroupDetails` - الفئة العمرية ووصفها
   - `playersCount` + `playersDetails` - عدد اللاعبين ووصفهم
   - `practitioners` + `practitionersDetails` - الممارسون ووصفهم
   - `gameType` - نوع اللعبة
   - `timing` - الوقت
   - `tools` - الأدوات

3. **الأقسام التفصيلية**:
   - **الوصف** (السطور 143-155): `description`
   - **قواعد اللعب** (السطور 230-256): `rules`
   - **نظام الفوز والخسارة** (السطور 259-273): `winLossSystem`
   - **آلية البدء والانتهاء** (السطور 276-290): `startEndMechanism`
   - **الموروث الشفهي** (السطور 293-307): `oralTradition`
   - **السياق الاجتماعي** (السطور 310-324): `socialContext`
   - **المراجع** (السطور 327-350): `references`

4. **الجانب الأيمن** (السطور 354-428):
   - **الوسوم** (السطور 356-376): `tags`
   - **الموقع الجغرافي** (السطور 379-396): `country.name` + `region`
   - **بيئة اللعب** (السطور 399-416): `environment` + `timing`
   - **مجال التراث** (السطور 419-427): `heritageField.name`

## تفاصيل واجهة API للداشبورد

### نقطة النهاية الرئيسية: `lib/actions/game.ts`

```typescript
// وظيفة getGameBySlug تعيد جميع الحقول:
export async function getGameBySlug(slug: string) {
  const game = await prisma.game.findUnique({
    where: { slug },
    include: {
      country: true,
      heritageField: true,
      tags: { include: { tag: true } },
      media: true,
      references: true,
    },
  });
  // تعيد جميع الحقول الـ 23
}
```

### مخطط التحقق (Zod Schema) في `lib/actions/game.ts`:
```typescript
const gameSchema = z.object({
  canonicalName: z.string().min(1, "اسم اللعبة مطلوب"),
  englishName: z.string().optional(), // حقل جديد
  localNames: z.array(z.string()).optional(),
  countryId: z.string().min(1, "الدولة مطلوبة"),
  region: z.string().optional(),
  heritageFieldId: z.string().min(1, "مجال التراث مطلوب"),
  gameType: z.string().min(1, "نوع اللعبة مطلوب"),
  ageGroup: z.string().optional(),
  ageGroupDetails: z.string().optional(), // حقل جديد
  practitioners: z.string().optional(),
  practitionersDetails: z.string().optional(), // حقل جديد
  playersCount: z.string().optional(),
  playersDetails: z.string().optional(), // حقل جديد
  tools: z.array(z.string()).optional(),
  environment: z.string().optional(),
  timing: z.string().optional(),
  description: z.string().min(1, "الوصف مطلوب"),
  rules: z.array(z.string()).optional(),
  winLossSystem: z.string().optional(),
  startEndMechanism: z.string().optional(),
  oralTradition: z.string().optional(),
  socialContext: z.string().optional(),
  tagIds: z.array(z.string()).optional(),
  references: z.array(z.object({
    citation: z.string().min(1, "المرجع مطلوب"),
    sourceType: z.string().optional(),
    author: z.string().optional(),
    year: z.number().optional(),
  })).optional(),
});
```

## التحقق من الاكتمال

### ✅ جميع الحقول الـ 23 موجودة في:
1. **قاعدة البيانات**: ✅ (تم تحديث Prisma Schema)
2. **صفحة العرض**: ✅ (تم تحديث `app/(public)/game/[slug]/page.tsx`)
3. **واجهة API**: ✅ (موجودة في `lib/actions/game.ts`)

### ✅ الحقول الجديدة المضافة:
1. `englishName` - الاسم الإنجليزي (للترجمة التلقائية)
2. `ageGroupDetails` - وصف الفئة العمرية
3. `practitionersDetails` - وصف الممارسين
4. `playersDetails` - وصف اللاعبين

### ✅ الأقسام المضافة حديثاً في صفحة العرض:
1. نظام الفوز والخسارة
2. آلية البدء والانتهاء
3. الموروث الشفهي
4. السياق الاجتماعي
5. المراجع

## الخطوات التالية

1. **تحديث نموذج الإدخال** (`app/dashboard/games/new/page.tsx`) لإضافة الحقول الجديدة
2. **تحديث وظيفة الاستيراد** (`lib/utils/import-validation.ts`) لدعم الحقول الجديدة
3. **اختبار النظام الكامل** للتأكد من عمل جميع الحقول

## ملاحظات تقنية

- جميع الحقول تدعم النصوص العربية (RTL)
- الحقول الاختيارية تستخدم `String?` مع `@db.Text` للنصوص الطويلة
- العلاقات مع الجداول الأخرى (Country, HeritageField, Tags, References) تعمل بشكل صحيح
- نظام العرض يدعم التصميم المتجاوب مع جميع الأجهزة