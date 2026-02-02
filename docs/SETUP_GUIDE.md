# دليل الإعداد / Setup Guide

## 🚀 البدء السريع / Quick Start

### 1. تثبيت المتطلبات / Install Dependencies

```bash
npm install
```

### 2. إعداد قاعدة البيانات / Setup Database

```bash
# إنشاء قاعدة البيانات
createdb tgg_db

# تطبيق المخطط
npx prisma db push

# تطبيق الفهارس والتحسينات
node scripts/run-migrations.js

# إضافة بيانات تجريبية (اختياري)
npm run db:seed
```

### 3. إعداد متغيرات البيئة / Setup Environment Variables

```bash
# نسخ ملف القالب
cp .env.template .env

# تعديل القيم
nano .env
```

**المتغيرات المطلوبة:**
- `DATABASE_URL` - رابط قاعدة البيانات
- `SESSION_SECRET` - سر الجلسة (32 حرف على الأقل)
- `CLOUDINARY_*` - إعدادات Cloudinary

**المتغيرات الاختيارية:**
- `UPSTASH_*` - لـ Rate Limiting الموزع
- `SMTP_*` - لإرسال البريد الإلكتروني
- `OPENAI_API_KEY` - للذكاء الاصطناعي

### 4. تشغيل المشروع / Run Project

```bash
# التطوير
npm run dev

# الإنتاج
npm run build
npm start
```

---

## 🔧 الإعداد المتقدم / Advanced Setup

### تفعيل Rate Limiting مع Upstash

```bash
# تثبيت الحزم
npm install @upstash/ratelimit @upstash/redis

# إضافة المتغيرات
UPSTASH_REDIS_REST_URL=your_url
UPSTASH_REDIS_REST_TOKEN=your_token
```

### تفعيل Service Worker

في `app/layout.tsx`:

```typescript
'use client';

useEffect(() => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js');
  }
}, []);
```

### إنشاء صفحة عدم الاتصال

```bash
# إنشاء الصفحة
mkdir -p app/offline
touch app/offline/page.tsx
```

---

## 📊 التحقق من الإعداد / Verify Setup

```bash
# التحقق من قاعدة البيانات
npm run db:studio

# اختبار التحسينات
node tests/test-enhancements.js

# فحص الأمان
# سيتم إضافة سكريبت للفحص
```

---

## 🐛 استكشاف الأخطاء / Troubleshooting

### خطأ في الاتصال بقاعدة البيانات

```bash
# التحقق من PostgreSQL
psql -U postgres -c "SELECT version();"

# إعادة إنشاء قاعدة البيانات
dropdb tgg_db
createdb tgg_db
npx prisma db push
```

### خطأ في الفهارس

```bash
# حذف الفهارس القديمة
psql $DATABASE_URL -c "DROP INDEX IF EXISTS idx_game_search_arabic;"

# إعادة تطبيق الترحيلات
node scripts/run-migrations.js
```

### مشاكل في ذاكرة التخزين المؤقت

```typescript
// مسح جميع ذاكرة التخزين المؤقت
import { clearAllCaches } from '@/lib/utils/cache';
clearAllCaches();
```

---

## 📚 المزيد من المعلومات

راجع `docs/IMMEDIATE_RECOMMENDATIONS.md` للحصول على تفاصيل كاملة عن جميع التحسينات.
