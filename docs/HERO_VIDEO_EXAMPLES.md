# أمثلة تصميمات الفيديو في الصفحة الرئيسية

## 🎨 معرض التصميمات

هذا الملف يحتوي على أمثلة جاهزة للاستخدام يمكنك نسخها ولصقها مباشرة.

---

## 1️⃣ التصميم الأصلي (ذهبي تراثي)

### المميزات:
- ✨ ألوان ذهبية تراثية
- 🎯 مناسب للمحتوى الثقافي
- 📜 يعكس الأصالة والتراث

### الكود:

```tsx
{/* الإطار الخارجي الدوار */}
<div className="absolute inset-0 bg-gradient-to-br from-accent via-accent-dark to-accent rounded-3xl animate-spin-slow opacity-75 blur-xl" />

{/* الحدود المتحركة */}
<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent animate-shimmer-border" />

{/* رموز الاقتباس */}
<div className="absolute -top-8 -right-8 text-accent/30 animate-float z-0">
  <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 100 100">
    <path d="M20,45 Q20,20 40,20 Q35,35 35,45 Q35,55 25,55 Q15,55 15,45 Q15,35 20,35 Z M60,45 Q60,20 80,20 Q75,35 75,45 Q75,55 65,55 Q55,55 55,45 Q55,35 60,35 Z" />
  </svg>
</div>
```

### الألوان:
- الأساسي: `#AB9F80` (ذهبي)
- الداكن: `#8B7F60` (ذهبي داكن)
- الشفافية: `30%`

---

## 2️⃣ تصميم المحيط الأزرق

### المميزات:
- 🌊 ألوان البحر الهادئة
- 💙 مناسب للمحتوى الحديث
- ✨ يعطي شعوراً بالانتعاش

### الكود:

```tsx
{/* الإطار الخارجي الدوار */}
<div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 rounded-3xl animate-spin-slow opacity-75 blur-xl" />

{/* الحدود المتحركة */}
<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-shimmer-border" />
<div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-shimmer-border animation-delay-1000" />
<div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-cyan-400 to-transparent animate-shimmer-border-vertical" />
<div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-transparent via-cyan-400 to-transparent animate-shimmer-border-vertical animation-delay-1000" />

{/* رموز الاقتباس */}
<div className="absolute -top-8 -right-8 text-blue-400/40 animate-float z-0">
  <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 100 100">
    <path d="M20,45 Q20,20 40,20 Q35,35 35,45 Q35,55 25,55 Q15,55 15,45 Q15,35 20,35 Z M60,45 Q60,20 80,20 Q75,35 75,45 Q75,55 65,55 Q55,55 55,45 Q55,35 60,35 Z" />
  </svg>
</div>

<div className="absolute -bottom-8 -left-8 text-blue-400/40 animate-float animation-delay-2000 z-0" style={{transform: 'rotate(180deg)'}}>
  <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 100 100">
    <path d="M20,45 Q20,20 40,20 Q35,35 35,45 Q35,55 25,55 Q15,55 15,45 Q15,35 20,35 Z M60,45 Q60,20 80,20 Q75,35 75,45 Q75,55 65,55 Q55,55 55,45 Q55,35 60,35 Z" />
  </svg>
</div>
```

### الألوان:
- الأساسي: `#3B82F6` (أزرق)
- الثانوي: `#06B6D4` (سماوي)
- الداكن: `#2563EB` (أزرق داكن)

---

## 3️⃣ تصميم الغروب الوردي

### المميزات:
- 🌸 ألوان دافئة ورومانسية
- 💖 مناسب للمحتوى الإبداعي
- 🎨 يعطي شعوراً بالحيوية

### الكود:

```tsx
{/* الإطار الخارجي الدوار */}
<div className="absolute inset-0 bg-gradient-to-br from-pink-400 via-rose-400 to-red-400 rounded-3xl animate-spin-slow opacity-75 blur-xl" />

{/* الحدود المتحركة */}
<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-pink-300 to-transparent animate-shimmer-border" />
<div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-pink-300 to-transparent animate-shimmer-border animation-delay-1000" />
<div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-pink-300 to-transparent animate-shimmer-border-vertical" />
<div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-transparent via-pink-300 to-transparent animate-shimmer-border-vertical animation-delay-1000" />

{/* رموز الاقتباس */}
<div className="absolute -top-8 -right-8 text-rose-400/40 animate-float z-0">
  <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 100 100">
    <path d="M20,45 Q20,20 40,20 Q35,35 35,45 Q35,55 25,55 Q15,55 15,45 Q15,35 20,35 Z M60,45 Q60,20 80,20 Q75,35 75,45 Q75,55 65,55 Q55,55 55,45 Q55,35 60,35 Z" />
  </svg>
</div>

<div className="absolute -bottom-8 -left-8 text-rose-400/40 animate-float animation-delay-2000 z-0" style={{transform: 'rotate(180deg)'}}>
  <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 100 100">
    <path d="M20,45 Q20,20 40,20 Q35,35 35,45 Q35,55 25,55 Q15,55 15,45 Q15,35 20,35 Z M60,45 Q60,20 80,20 Q75,35 75,45 Q75,55 65,55 Q55,55 55,45 Q55,35 60,35 Z" />
  </svg>
</div>
```

### الألوان:
- الأساسي: `#F472B6` (وردي)
- الثانوي: `#FB7185` (وردي فاتح)
- الداكن: `#F87171` (أحمر فاتح)

---

## 4️⃣ تصميم الغابة الخضراء

### المميزات:
- 🌿 ألوان الطبيعة المنعشة
- 💚 مناسب للمحتوى البيئي
- 🍃 يعطي شعوراً بالهدوء

### الكود:

```tsx
{/* الإطار الخارجي الدوار */}
<div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 rounded-3xl animate-spin-slow opacity-75 blur-xl" />

{/* الحدود المتحركة */}
<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-shimmer-border" />
<div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-shimmer-border animation-delay-1000" />
<div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-emerald-400 to-transparent animate-shimmer-border-vertical" />
<div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-transparent via-emerald-400 to-transparent animate-shimmer-border-vertical animation-delay-1000" />

{/* رموز الاقتباس */}
<div className="absolute -top-8 -right-8 text-green-400/40 animate-float z-0">
  <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 100 100">
    <path d="M20,45 Q20,20 40,20 Q35,35 35,45 Q35,55 25,55 Q15,55 15,45 Q15,35 20,35 Z M60,45 Q60,20 80,20 Q75,35 75,45 Q75,55 65,55 Q55,55 55,45 Q55,35 60,35 Z" />
  </svg>
</div>

<div className="absolute -bottom-8 -left-8 text-green-400/40 animate-float animation-delay-2000 z-0" style={{transform: 'rotate(180deg)'}}>
  <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 100 100">
    <path d="M20,45 Q20,20 40,20 Q35,35 35,45 Q35,55 25,55 Q15,55 15,45 Q15,35 20,35 Z M60,45 Q60,20 80,20 Q75,35 75,45 Q75,55 65,55 Q55,55 55,45 Q55,35 60,35 Z" />
  </svg>
</div>
```

### الألوان:
- الأساسي: `#10B981` (أخضر زمردي)
- الثانوي: `#22C55E` (أخضر)
- الداكن: `#14B8A6` (تركواز)

---

## 5️⃣ تصميم الليل البنفسجي

### المميزات:
- 🌙 ألوان الليل الساحرة
- 💜 مناسب للمحتوى الفني
- ✨ يعطي شعوراً بالغموض

### الكود:

```tsx
{/* الإطار الخارجي الدوار */}
<div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-violet-500 to-indigo-500 rounded-3xl animate-spin-slow opacity-75 blur-xl" />

{/* الحدود المتحركة */}
<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent animate-shimmer-border" />
<div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent animate-shimmer-border animation-delay-1000" />
<div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-purple-400 to-transparent animate-shimmer-border-vertical" />
<div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-transparent via-purple-400 to-transparent animate-shimmer-border-vertical animation-delay-1000" />

{/* رموز الاقتباس */}
<div className="absolute -top-8 -right-8 text-purple-400/40 animate-float z-0">
  <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 100 100">
    <path d="M20,45 Q20,20 40,20 Q35,35 35,45 Q35,55 25,55 Q15,55 15,45 Q15,35 20,35 Z M60,45 Q60,20 80,20 Q75,35 75,45 Q75,55 65,55 Q55,55 55,45 Q55,35 60,35 Z" />
  </svg>
</div>

<div className="absolute -bottom-8 -left-8 text-purple-400/40 animate-float animation-delay-2000 z-0" style={{transform: 'rotate(180deg)'}}>
  <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 100 100">
    <path d="M20,45 Q20,20 40,20 Q35,35 35,45 Q35,55 25,55 Q15,55 15,45 Q15,35 20,35 Z M60,45 Q60,20 80,20 Q75,35 75,45 Q75,55 65,55 Q55,55 55,45 Q55,35 60,35 Z" />
  </svg>
</div>
```

### الألوان:
- الأساسي: `#A855F7` (بنفسجي)
- الثانوي: `#8B5CF6` (بنفسجي فاتح)
- الداكن: `#6366F1` (نيلي)

---

## 6️⃣ تصميم الشمس البرتقالية

### المميزات:
- 🌅 ألوان الشروق الدافئة
- 🧡 مناسب للمحتوى الحماسي
- 🔥 يعطي شعوراً بالطاقة

### الكود:

```tsx
{/* الإطار الخارجي الدوار */}
<div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-amber-400 to-yellow-400 rounded-3xl animate-spin-slow opacity-75 blur-xl" />

{/* الحدود المتحركة */}
<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-300 to-transparent animate-shimmer-border" />
<div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-300 to-transparent animate-shimmer-border animation-delay-1000" />
<div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-orange-300 to-transparent animate-shimmer-border-vertical" />
<div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-transparent via-orange-300 to-transparent animate-shimmer-border-vertical animation-delay-1000" />

{/* رموز الاقتباس */}
<div className="absolute -top-8 -right-8 text-orange-400/40 animate-float z-0">
  <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 100 100">
    <path d="M20,45 Q20,20 40,20 Q35,35 35,45 Q35,55 25,55 Q15,55 15,45 Q15,35 20,35 Z M60,45 Q60,20 80,20 Q75,35 75,45 Q75,55 65,55 Q55,55 55,45 Q55,35 60,35 Z" />
  </svg>
</div>

<div className="absolute -bottom-8 -left-8 text-orange-400/40 animate-float animation-delay-2000 z-0" style={{transform: 'rotate(180deg)'}}>
  <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 100 100">
    <path d="M20,45 Q20,20 40,20 Q35,35 35,45 Q35,55 25,55 Q15,55 15,45 Q15,35 20,35 Z M60,45 Q60,20 80,20 Q75,35 75,45 Q75,55 65,55 Q55,55 55,45 Q55,35 60,35 Z" />
  </svg>
</div>
```

### الألوان:
- الأساسي: `#FB923C` (برتقالي)
- الثانوي: `#FBBF24` (كهرماني)
- الداكن: `#FACC15` (أصفر)

---

## 7️⃣ تصميم الفضاء الداكن

### المميزات:
- 🌌 ألوان الفضاء الغامضة
- 🖤 مناسب للوضع الليلي
- ⭐ يعطي شعوراً بالعمق

### الكود:

```tsx
{/* الإطار الخارجي الدوار */}
<div className="absolute inset-0 bg-gradient-to-br from-gray-700 via-slate-700 to-zinc-700 rounded-3xl animate-spin-slow opacity-75 blur-xl" />

{/* الحدود المتحركة */}
<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gray-400 to-transparent animate-shimmer-border" />
<div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gray-400 to-transparent animate-shimmer-border animation-delay-1000" />
<div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-gray-400 to-transparent animate-shimmer-border-vertical" />
<div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-transparent via-gray-400 to-transparent animate-shimmer-border-vertical animation-delay-1000" />

{/* رموز الاقتباس */}
<div className="absolute -top-8 -right-8 text-gray-400/40 animate-float z-0">
  <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 100 100">
    <path d="M20,45 Q20,20 40,20 Q35,35 35,45 Q35,55 25,55 Q15,55 15,45 Q15,35 20,35 Z M60,45 Q60,20 80,20 Q75,35 75,45 Q75,55 65,55 Q55,55 55,45 Q55,35 60,35 Z" />
  </svg>
</div>

<div className="absolute -bottom-8 -left-8 text-gray-400/40 animate-float animation-delay-2000 z-0" style={{transform: 'rotate(180deg)'}}>
  <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 100 100">
    <path d="M20,45 Q20,20 40,20 Q35,35 35,45 Q35,55 25,55 Q15,55 15,45 Q15,35 20,35 Z M60,45 Q60,20 80,20 Q75,35 75,45 Q75,55 65,55 Q55,55 55,45 Q55,35 60,35 Z" />
  </svg>
</div>
```

### الألوان:
- الأساسي: `#374151` (رمادي داكن)
- الثانوي: `#475569` (رمادي أردوازي)
- الداكن: `#52525B` (رمادي زنك)

---

## 8️⃣ تصميم قوس قزح المتدرج

### المميزات:
- 🌈 ألوان متعددة حيوية
- 🎨 مناسب للمحتوى الإبداعي
- ✨ يعطي شعوراً بالبهجة

### الكود:

```tsx
{/* الإطار الخارجي الدوار */}
<div className="absolute inset-0 bg-gradient-to-br from-red-400 via-yellow-400 via-green-400 via-blue-400 to-purple-400 rounded-3xl animate-spin-slow opacity-75 blur-xl" />

{/* الحدود المتحركة */}
<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-400 via-yellow-400 via-green-400 via-blue-400 to-purple-400 animate-shimmer-border" />
<div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 via-blue-400 via-green-400 via-yellow-400 to-red-400 animate-shimmer-border animation-delay-1000" />
<div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-red-400 via-yellow-400 via-green-400 via-blue-400 to-purple-400 animate-shimmer-border-vertical" />
<div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-purple-400 via-blue-400 via-green-400 via-yellow-400 to-red-400 animate-shimmer-border-vertical animation-delay-1000" />

{/* رموز الاقتباس */}
<div className="absolute -top-8 -right-8 text-purple-400/40 animate-float z-0">
  <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 100 100">
    <path d="M20,45 Q20,20 40,20 Q35,35 35,45 Q35,55 25,55 Q15,55 15,45 Q15,35 20,35 Z M60,45 Q60,20 80,20 Q75,35 75,45 Q75,55 65,55 Q55,55 55,45 Q55,35 60,35 Z" />
  </svg>
</div>

<div className="absolute -bottom-8 -left-8 text-blue-400/40 animate-float animation-delay-2000 z-0" style={{transform: 'rotate(180deg)'}}>
  <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 100 100">
    <path d="M20,45 Q20,20 40,20 Q35,35 35,45 Q35,55 25,55 Q15,55 15,45 Q15,35 20,35 Z M60,45 Q60,20 80,20 Q75,35 75,45 Q75,55 65,55 Q55,55 55,45 Q55,35 60,35 Z" />
  </svg>
</div>
```

### الألوان:
- متعددة: أحمر → أصفر → أخضر → أزرق → بنفسجي

---

## 📝 ملاحظات الاستخدام

### كيفية التطبيق:
1. افتح `components/public/HeroVideoPlayer.tsx`
2. ابحث عن القسم المراد تغييره
3. انسخ الكود من الأمثلة أعلاه
4. الصق الكود في المكان المناسب
5. احفظ الملف وشاهد النتيجة!

### نصائح:
- 🎨 جرب مزج الألوان المختلفة
- ⚡ اضبط السرعات حسب الحاجة
- 📱 اختبر على أحجام شاشات مختلفة
- ♿ تأكد من التباين الجيد للقراءة

### التوافق:
- ✅ جميع المتصفحات الحديثة
- ✅ الأجهزة المحمولة
- ✅ الأجهزة اللوحية
- ✅ الشاشات الكبيرة

---

**ملاحظة**: يمكنك دمج عناصر من تصميمات مختلفة لإنشاء تصميمك الفريد! 🎨
