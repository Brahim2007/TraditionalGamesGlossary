# توحيد الخط في صفحات الداشبورد

## المشكلة
كانت بعض صفحات الداشبورد تستخدم `font-black` بينما البقية تستخدم `font-bold`، مما أدى إلى عدم تناسق في سُمك الخط عبر الصفحات.

## الحل

تم توحيد استخدام `font-bold` في جميع صفحات الداشبورد وفقاً للنمط التالي:

### النمط الموحد للعناوين:

1. **العناوين الرئيسية (h1)**: `text-4xl font-bold text-brand-deepest`
2. **العناوين الثانوية (h2)**: `text-2xl font-bold text-brand-deepest`
3. **العناوين الفرعية (h3)**: `text-xl font-bold text-brand-deepest`
4. **الأرقام في البطاقات الإحصائية**: `text-3xl font-bold` أو `text-4xl font-bold`

### الملفات المحدثة:

#### 1. `app/dashboard/suggestions/SuggestionsClient.tsx`

**قبل:**
```typescript
<h1 className="text-3xl font-black text-brand-deepest">مقترحات الألعاب</h1>
<div className="text-3xl font-black text-brand-deepest">{stats.total}</div>
<h2 className="text-2xl font-black">{selectedSuggestion.gameName}</h2>
```

**بعد:**
```typescript
<h1 className="text-4xl font-bold text-brand-deepest">مقترحات الألعاب</h1>
<div className="text-3xl font-bold text-brand-deepest">{stats.total}</div>
<h2 className="text-2xl font-bold">{selectedSuggestion.gameName}</h2>
```

#### 2. `app/dashboard/categories/CategoriesClient.tsx`

**قبل:**
```typescript
<h1 className="text-3xl font-black text-brand-deepest">إدارة التصنيفات</h1>
<h2 className="text-2xl font-black text-brand-deepest">
```

**بعد:**
```typescript
<h1 className="text-4xl font-bold text-brand-deepest">إدارة التصنيفات</h1>
<h2 className="text-2xl font-bold text-brand-deepest">
```

## الفائدة

✅ **تناسق بصري**: جميع صفحات الداشبورد الآن تستخدم نفس سُمك الخط
✅ **قابلية القراءة**: `font-bold` (700) أكثر راحة للقراءة من `font-black` (900)
✅ **توافق مع التصميم**: يتماشى مع خط IBM Plex Sans Arabic المستخدم في المشروع

## الخط المستخدم في المشروع

```css
font-family: 'IBM Plex Sans Arabic', 'Noto Sans Arabic', sans-serif;
```

### الأوزان المتاحة:
- `font-extralight` (200)
- `font-light` (300)
- `font-normal` (400)
- `font-medium` (500)
- `font-semibold` (600)
- **`font-bold` (700)** ← المستخدم الآن
- ~~`font-black` (900)~~ ← تم استبداله

## اختبار التحديثات

1. افتح المتصفح على `http://localhost:3000/dashboard/suggestions`
2. قارن الخط مع صفحات أخرى مثل:
   - `/dashboard/games`
   - `/dashboard/categories`
   - `/dashboard/review`
3. يجب أن تكون جميع العناوين الآن بنفس سُمك الخط

---

**التاريخ**: 2 فبراير 2026  
**الحالة**: ✅ مكتمل
