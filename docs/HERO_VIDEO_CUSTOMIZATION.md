# دليل تخصيص الفيديو في الصفحة الرئيسية

## كيفية تخصيص الألوان

### 1. تغيير لون الإطار الخارجي

في `components/public/HeroVideoPlayer.tsx`، ابحث عن:

```tsx
<div className="absolute inset-0 bg-gradient-to-br from-accent via-accent-dark to-accent rounded-3xl animate-spin-slow opacity-75 blur-xl" />
```

**خيارات الألوان:**
- `from-blue-500 via-purple-500 to-pink-500` - تدرج ملون
- `from-green-400 to-blue-500` - أخضر إلى أزرق
- `from-red-400 to-orange-500` - أحمر إلى برتقالي

### 2. تغيير لون الحدود المتحركة

ابحث عن:

```tsx
<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent animate-shimmer-border" />
```

**تخصيص:**
- `via-accent` → `via-blue-500` (أزرق)
- `via-accent` → `via-purple-500` (بنفسجي)
- `via-accent` → `via-emerald-500` (أخضر زمردي)

### 3. تغيير لون رموز الاقتباس

ابحث عن:

```tsx
<div className="absolute -top-8 -right-8 text-accent/30 animate-float z-0">
```

**تخصيص:**
- `text-accent/30` → `text-blue-400/40`
- `text-accent/30` → `text-purple-400/50`
- `text-accent/30` → `text-rose-400/30`

## كيفية تخصيص السرعات

### 1. سرعة الدوران

في `globals.css`، عدّل:

```css
.animate-spin-slow {
  animation: spin-slow 8s linear infinite;
}
```

**خيارات:**
- `4s` - دوران سريع
- `12s` - دوران بطيء جداً
- `6s` - دوران متوسط

### 2. سرعة الحركة العائمة

```css
.animate-float {
  animation: float 3s ease-in-out infinite;
}
```

**خيارات:**
- `2s` - حركة سريعة
- `5s` - حركة بطيئة
- `4s` - حركة متوسطة

### 3. سرعة النبض

```css
.animate-pulse-slow {
  animation: pulse-slow 3s ease-in-out infinite;
}
```

## كيفية تخصيص الأحجام

### 1. حجم رموز الاقتباس

```tsx
<svg className="w-32 h-32" fill="currentColor" viewBox="0 0 100 100">
```

**خيارات:**
- `w-24 h-24` - صغير
- `w-40 h-40` - كبير
- `w-48 h-48` - كبير جداً

### 2. سُمك الحدود

```tsx
<div className="relative bg-white/10 backdrop-blur-md rounded-3xl p-2 border-4 border-white/30">
```

**خيارات:**
- `border-2` - رفيع
- `border-6` - سميك
- `border-8` - سميك جداً

### 3. حجم الإطار الخارجي

```tsx
<div className="absolute -inset-4 bg-gradient-to-r from-accent/20 via-transparent to-accent/20 rounded-full blur-2xl">
```

**خيارات:**
- `-inset-2` - قريب
- `-inset-6` - بعيد
- `-inset-8` - بعيد جداً

## كيفية تخصيص الشفافية

### 1. شفافية الخلفية

```tsx
<div className="relative bg-white/10 backdrop-blur-md">
```

**خيارات:**
- `bg-white/5` - شفاف جداً
- `bg-white/20` - شفاف قليلاً
- `bg-white/30` - أقل شفافية

### 2. شفافية الإطار الدوار

```tsx
<div className="absolute inset-0 bg-gradient-to-br from-accent via-accent-dark to-accent rounded-3xl animate-spin-slow opacity-75 blur-xl" />
```

**خيارات:**
- `opacity-50` - شفاف
- `opacity-90` - غير شفاف تقريباً
- `opacity-100` - غير شفاف تماماً

## كيفية تخصيص الأشكال

### 1. تغيير شكل الإطار

```tsx
<div className="relative bg-white/10 backdrop-blur-md rounded-3xl">
```

**خيارات:**
- `rounded-xl` - زوايا أقل استدارة
- `rounded-full` - دائري تماماً
- `rounded-2xl` - استدارة متوسطة

### 2. تغيير شكل رموز الاقتباس

يمكنك استبدال SVG بأشكال أخرى:

**مثال - قوسين:**
```tsx
<svg className="w-32 h-32" fill="currentColor" viewBox="0 0 100 100">
  <path d="M20,20 Q20,50 40,80" stroke="currentColor" fill="none" strokeWidth="4"/>
</svg>
```

**مثال - نجمة:**
```tsx
<svg className="w-32 h-32" fill="currentColor" viewBox="0 0 20 20">
  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
</svg>
```

## كيفية إضافة تأثيرات جديدة

### 1. تأثير التموج (Ripple)

في `globals.css`:

```css
@keyframes ripple {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

.animate-ripple {
  animation: ripple 2s ease-out infinite;
}
```

**الاستخدام:**
```tsx
<div className="absolute inset-0 rounded-full border-4 border-accent animate-ripple" />
```

### 2. تأثير الاهتزاز (Shake)

```css
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
}

.animate-shake {
  animation: shake 0.5s ease-in-out;
}
```

### 3. تأثير الانزلاق (Slide)

```css
@keyframes slide-diagonal {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(20px, -20px); }
}

.animate-slide-diagonal {
  animation: slide-diagonal 4s ease-in-out infinite;
}
```

## كيفية تغيير موضع العناصر

### 1. تبديل النص والفيديو

في `components/public/HeroVideoPlayer.tsx`:

```tsx
<div className="grid lg:grid-cols-2 gap-12 items-center">
  {/* النص - غيّر order-2 إلى order-1 */}
  <div className="order-1 lg:order-1 space-y-8">
    {/* النص */}
  </div>

  {/* الفيديو - غيّر order-1 إلى order-2 */}
  <div className="order-2 lg:order-2">
    {/* الفيديو */}
  </div>
</div>
```

### 2. تغيير موضع رموز الاقتباس

```tsx
{/* من الأعلى اليمين إلى الأعلى اليسار */}
<div className="absolute -top-8 -left-8 text-accent/30">

{/* من الأسفل اليسار إلى الأسفل اليمين */}
<div className="absolute -bottom-8 -right-8 text-accent/30">
```

## كيفية إضافة تأثيرات صوتية (اختياري)

### 1. إضافة صوت عند تبديل المقاطع

في `components/public/HeroVideoPlayer.tsx`:

```tsx
const playSound = () => {
  const audio = new Audio('/sounds/transition.mp3')
  audio.volume = 0.3
  audio.play()
}

// في onStateChange:
if (event.data === (window as any).YT.PlayerState.ENDED) {
  playSound() // إضافة هذا السطر
  const nextIndex = (currentClipIndex + 1) % clips.length
  setCurrentClipIndex(nextIndex)
}
```

### 2. إضافة موسيقى خلفية خفيفة

```tsx
useEffect(() => {
  const bgMusic = new Audio('/sounds/ambient.mp3')
  bgMusic.loop = true
  bgMusic.volume = 0.1
  bgMusic.play()

  return () => {
    bgMusic.pause()
  }
}, [])
```

## كيفية إضافة وضع ليلي/نهاري

### 1. إضافة متغيرات CSS

في `globals.css`:

```css
:root {
  --hero-bg-start: #061D14;
  --hero-bg-end: #134232;
  --hero-accent: #AB9F80;
}

[data-theme="light"] {
  --hero-bg-start: #F0F9FF;
  --hero-bg-end: #E0F2FE;
  --hero-accent: #0EA5E9;
}
```

### 2. استخدام المتغيرات

```tsx
<div 
  className="relative w-full overflow-hidden"
  style={{
    background: `linear-gradient(to bottom right, var(--hero-bg-start), var(--hero-bg-end))`
  }}
>
```

## كيفية تحسين الأداء

### 1. إيقاف الحركات على الأجهزة الضعيفة

```css
@media (prefers-reduced-motion: reduce) {
  .animate-spin-slow,
  .animate-float,
  .animate-pulse-slow,
  .animate-shimmer-border,
  .animate-shimmer-border-vertical {
    animation: none;
  }
}
```

### 2. استخدام will-change

```tsx
<div 
  className="absolute inset-0 bg-gradient-to-br from-accent via-accent-dark to-accent rounded-3xl animate-spin-slow opacity-75 blur-xl"
  style={{ willChange: 'transform' }}
/>
```

### 3. تقليل جودة الفيديو على الأجهزة المحمولة

في `HeroVideoPlayer.tsx`:

```tsx
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

playerVars: {
  // ... other settings
  vq: isMobile ? 'medium' : 'hd1080'
}
```

## أمثلة جاهزة

### مثال 1: تصميم أزرق بارد

```tsx
// الإطار الخارجي
className="bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600"

// الحدود
className="bg-gradient-to-r from-transparent via-cyan-400 to-transparent"

// رموز الاقتباس
className="text-blue-400/40"
```

### مثال 2: تصميم وردي دافئ

```tsx
// الإطار الخارجي
className="bg-gradient-to-br from-pink-400 via-rose-400 to-red-400"

// الحدود
className="bg-gradient-to-r from-transparent via-pink-300 to-transparent"

// رموز الاقتباس
className="text-rose-400/40"
```

### مثال 3: تصميم أخضر طبيعي

```tsx
// الإطار الخارجي
className="bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500"

// الحدود
className="bg-gradient-to-r from-transparent via-emerald-400 to-transparent"

// رموز الاقتباس
className="text-green-400/40"
```

## نصائح إضافية

1. **التجربة**: لا تخف من تجربة قيم مختلفة
2. **التوازن**: حافظ على توازن بين الحركة والهدوء
3. **الوصول**: تأكد من قابلية القراءة
4. **الأداء**: راقب استهلاك الموارد
5. **التوافق**: اختبر على متصفحات مختلفة

## الدعم

إذا واجهت أي مشاكل:
1. تحقق من console المتصفح
2. تأكد من تحميل YouTube API
3. تحقق من صحة أسماء الكلاسات
4. راجع الوثائق الأصلية
