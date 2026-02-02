# تكوين الخط في المشروع - IBM Plex Sans Arabic

## الخط الأساسي للمشروع

يستخدم المشروع خط **IBM Plex Sans Arabic** كخط أساسي مع نظام Fallback لضمان العرض الصحيح في جميع المتصفحات.

```
'IBM Plex Sans Arabic', 'IBM Plex Sans Arabic Fallback', 'Noto Sans Arabic', sans-serif
```

## التكوين في الملفات

### 1. `app/layout.tsx` - تحميل الخط من Google Fonts

```tsx
<link
  href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@200;300;400;500;600;700&display=swap"
  rel="stylesheet"
/>
```

**الأوزان المحملة:**
- 200 (ExtraLight)
- 300 (Light)
- 400 (Regular)
- 500 (Medium)
- 600 (SemiBold)
- 700 (Bold) ← الأكثر استخداماً في المشروع

### 2. `app/globals.css` - تطبيق الخط على body

```css
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@200;300;400;500;600;700&display=swap');

@layer base {
  body {
    background-color: hsl(var(--background));
    color: hsl(var(--foreground));
    font-family: 'IBM Plex Sans Arabic', 'IBM Plex Sans Arabic Fallback', 'Noto Sans Arabic', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
}
```

### 3. `tailwind.config.ts` - تعريف الخط في Tailwind

```typescript
fontFamily: {
  sans: ['IBM Plex Sans Arabic', 'IBM Plex Sans Arabic Fallback', 'Noto Sans Arabic', 'sans-serif'],
  arabic: ['IBM Plex Sans Arabic', 'IBM Plex Sans Arabic Fallback', 'Noto Sans Arabic', 'sans-serif'],
},
```

## استخدام الخط في المكونات

### الطريقة الافتراضية (تلقائي):
جميع العناصر ترث الخط من `body` تلقائياً.

### الطريقة الصريحة:
```tsx
<div className="font-arabic">النص هنا</div>
```

## نظام Fallback

1. **IBM Plex Sans Arabic** ← الخط الأساسي (إذا كان محملاً)
2. **IBM Plex Sans Arabic Fallback** ← احتياطي من نفس العائلة
3. **Noto Sans Arabic** ← خط عربي احتياطي من Google
4. **sans-serif** ← الخط الافتراضي للنظام

## الأوزان المستخدمة في المشروع

### العناوين:
- `font-bold` (700) - العناوين الرئيسية والثانوية
- `font-semibold` (600) - العناوين الفرعية

### النصوص:
- `font-normal` (400) - النصوص العادية
- `font-medium` (500) - النصوص المهمة
- `font-light` (300) - النصوص الخفيفة

### الأزرار والتسميات:
- `font-bold` (700) - الأزرار والشارات
- `font-medium` (500) - التسميات الصغيرة

## النمط الموحد للعناوين في الداشبورد

```typescript
// ✅ h1 - العنوان الرئيسي
<h1 className="text-4xl font-bold text-brand-deepest">

// ✅ h2 - العنوان الثانوي
<h2 className="text-2xl font-bold text-brand-deepest">

// ✅ h3 - العنوان الفرعي
<h3 className="text-xl font-bold text-brand-deepest">

// ✅ الأرقام في البطاقات
<div className="text-3xl font-bold text-brand-deepest">
<div className="text-4xl font-bold text-brand-deepest">
```

## لماذا IBM Plex Sans Arabic؟

✅ **دعم كامل للعربية**: مصمم خصيصاً للنصوص العربية
✅ **أوزان متعددة**: من 200 إلى 700 لمرونة التصميم
✅ **قابلية القراءة**: واضح ومريح للعين
✅ **مجاني ومفتوح المصدر**: من IBM
✅ **متوافق مع Google Fonts**: سهل التحميل والاستخدام

## اختبار الخط

للتحقق من أن الخط يعمل بشكل صحيح:

1. افتح أدوات المطور (F12)
2. اذهب إلى تبويب Elements
3. اختر أي عنصر نصي
4. في قسم Computed، ابحث عن `font-family`
5. يجب أن تظهر: `"IBM Plex Sans Arabic", "IBM Plex Sans Arabic Fallback", "Noto Sans Arabic", sans-serif`

## التحديثات المطبقة

✅ `tailwind.config.ts` - إضافة Fallback إلى تعريفات الخطوط
✅ `app/globals.css` - تحديث font-family في body
✅ `app/dashboard/suggestions/SuggestionsClient.tsx` - توحيد الأوزان
✅ `app/dashboard/categories/CategoriesClient.tsx` - توحيد الأوزان

---

**التاريخ**: 2 فبراير 2026  
**الحالة**: ✅ مكتمل ومحفوظ
