# إعداد Cloudinary لرفع الصور 🌤️

## نظرة عامة

Cloudinary هو خدمة قوية لإدارة الصور والوسائط مع مميزات متقدمة:
- ✅ رفع مباشر من المتصفح
- ✅ معالجة تلقائية للصور (ضغط، تحجيم، تحسين)
- ✅ CDN عالمي سريع
- ✅ مجاني حتى 25GB تخزين و25GB نقل بيانات شهرياً

المرجع: [Cloudinary Console](https://console.cloudinary.com/)

---

## 🔑 معلومات حسابك

من لوحة التحكم: https://console.cloudinary.com/app/c-648de07d1227d0885badf850d0b7e5/settings/api-keys

```
Cloud Name: c-648de07d1227d0885badf850d0b7e5
API Key: 577559934418585
API Secret: -U52_OeSyuZBFjSqJ_XRaV-Yl9c
```

---

## 📦 الخطوة 1: تثبيت المكتبة

```bash
npm install cloudinary next-cloudinary
```

---

## 🔧 الخطوة 2: إضافة المفاتيح إلى `.env`

أضف هذه الأسطر إلى ملف `.env`:

```env
# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=c-648de07d1227d0885badf850d0b7e5
CLOUDINARY_API_KEY=577559934418585
CLOUDINARY_API_SECRET=-U52_OeSyuZBFjSqJ_XRaV-Yl9c
```

⚠️ **ملاحظة:** 
- `NEXT_PUBLIC_` يعني أن المتغير متاح في المتصفح (آمن للـ Cloud Name)
- `API_SECRET` يبقى في الخادم فقط (لا يُرسل للمتصفح)

---

## 📝 الخطوة 3: إنشاء مكون رفع Cloudinary

أنشئ ملف: `components/ui/cloudinary-upload-button.tsx`

```typescript
"use client";

import { CldUploadWidget } from 'next-cloudinary';
import { UploadCloud, CheckCircle } from 'lucide-react';
import { useState } from 'react';

interface CloudinaryUploadButtonProps {
  onUploadComplete?: (url: string) => void;
  onUploadError?: (error: Error) => void;
  buttonText?: string;
  maxFiles?: number;
}

export function CloudinaryUploadButton({
  onUploadComplete,
  onUploadError,
  buttonText = "رفع صورة",
  maxFiles = 5,
}: CloudinaryUploadButtonProps) {
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  return (
    <div className="space-y-4">
      <CldUploadWidget
        uploadPreset="traditional_games" // سننشئه في الخطوة 4
        onSuccess={(result: any) => {
          const url = result.info.secure_url;
          setUploadedFiles(prev => [...prev, url]);
          if (onUploadComplete) {
            onUploadComplete(url);
          }
        }}
        onError={(error: any) => {
          console.error('Upload error:', error);
          if (onUploadError) {
            onUploadError(new Error(error.message || 'Upload failed'));
          }
        }}
        options={{
          maxFiles: maxFiles,
          maxFileSize: 4000000, // 4MB
          resourceType: 'image',
          clientAllowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
          folder: 'traditional-games', // مجلد في Cloudinary
        }}
      >
        {({ open }) => (
          <button
            type="button"
            onClick={() => open()}
            className="w-full flex items-center justify-center gap-2 bg-brand-deepest text-white px-4 py-3 rounded-lg hover:bg-brand-deep transition-colors"
          >
            <UploadCloud className="h-4 w-4" />
            <span>{buttonText}</span>
          </button>
        )}
      </CldUploadWidget>

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-bold text-brand-deepest">
            تم رفع {uploadedFiles.length} صورة
          </h4>
          {uploadedFiles.map((url, index) => (
            <div
              key={index}
              className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-2 rounded"
            >
              <CheckCircle className="h-4 w-4" />
              <span>صورة {index + 1}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## 🎨 الخطوة 4: إنشاء Upload Preset

**مهم جداً!** يجب إنشاء Upload Preset في Cloudinary:

1. اذهب إلى: https://console.cloudinary.com/settings/upload
2. اضغط على **"Add upload preset"**
3. املأ البيانات:
   - **Upload preset name:** `traditional_games`
   - **Signing Mode:** اختر **"Unsigned"** (للرفع من المتصفح)
   - **Folder:** `traditional-games`
   - **Access mode:** `public`
4. اضغط **"Save"**

---

## 🔄 الخطوة 5: تحديث صفحة إضافة اللعبة

في ملف `app/dashboard/games/new/page.tsx`:

### استيراد المكون:
```typescript
import { CloudinaryUploadButton } from '@/components/ui/cloudinary-upload-button'
```

### استبدال UploadButton بـ CloudinaryUploadButton:
```typescript
{/* خيار 1: رفع الصور من الكمبيوتر */}
<div className="rounded-lg border border-gray-200 p-4 space-y-3">
  <div className="flex items-center gap-2">
    <UploadCloud className="h-4 w-4 text-brand-deepest" />
    <h4 className="text-sm font-bold text-brand-deepest">رفع من الكمبيوتر</h4>
  </div>
  <CloudinaryUploadButton
    onUploadComplete={(url) => {
      setFormData(prev => ({
        ...prev,
        uploadedImages: [...prev.uploadedImages, url]
      }))
      alert('تم رفع الصورة بنجاح!')
    }}
    onUploadError={(error) => {
      console.error('Upload error:', error)
      alert('حدث خطأ أثناء رفع الصورة')
    }}
    buttonText="رفع صورة من الكمبيوتر"
    maxFiles={5}
  />
  <p className="text-xs text-gray-500">
    ✅ يستخدم Cloudinary (مجاني حتى 25GB)
  </p>
</div>
```

---

## 🧪 الخطوة 6: الاختبار

```bash
# 1. ثبت المكتبات
npm install

# 2. أعد تشغيل الخادم
npm run dev

# 3. افتح المتصفح
http://localhost:3000/dashboard/games/new

# 4. جرب رفع صورة
```

---

## 🎯 المميزات الإضافية

### 1. عرض الصور المُحسّنة

Cloudinary يوفر تحويلات تلقائية للصور:

```typescript
// عرض صورة بحجم 400x300
https://res.cloudinary.com/c-648de07d1227d0885badf850d0b7e5/image/upload/w_400,h_300,c_fill/traditional-games/image.jpg

// عرض صورة محسّنة (ضغط تلقائي)
https://res.cloudinary.com/c-648de07d1227d0885badf850d0b7e5/image/upload/q_auto,f_auto/traditional-games/image.jpg
```

### 2. استخدام CldImage للعرض

```typescript
import { CldImage } from 'next-cloudinary';

<CldImage
  width="400"
  height="300"
  src="traditional-games/image.jpg"
  alt="صورة اللعبة"
  crop="fill"
  gravity="auto"
/>
```

---

## 📊 المقارنة

| الميزة | Uploadthing | Cloudinary |
|--------|-------------|------------|
| التخزين المجاني | 2GB | 25GB |
| النقل الشهري | محدود | 25GB |
| معالجة الصور | أساسي | ✅ متقدم جداً |
| التحويلات | ❌ | ✅ تلقائي |
| CDN | ✅ | ✅ عالمي |
| الإعداد | بسيط | متوسط |
| للإنتاج | ✅ جيد | ✅ ممتاز |

---

## 🔒 الأمان

### ما يجب حمايته:
- ✅ `CLOUDINARY_API_SECRET` - لا تشاركه أبداً
- ✅ ملف `.env` - موجود في `.gitignore`

### ما هو آمن للنشر:
- ✅ `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` - عام
- ✅ Upload Preset (Unsigned) - مصمم للاستخدام العام

---

## 🆘 استكشاف الأخطاء

### المشكلة: "Upload preset not found"
**الحل:**
1. تأكد من إنشاء Upload Preset في Cloudinary
2. تأكد من اسم الـ preset: `traditional_games`
3. تأكد من أن Signing Mode هو **"Unsigned"**

### المشكلة: "Invalid cloud name"
**الحل:**
1. تحقق من `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` في `.env`
2. يجب أن يكون: `c-648de07d1227d0885badf850d0b7e5`
3. أعد تشغيل الخادم

### المشكلة: الصور لا تظهر
**الحل:**
1. تحقق من Console في المتصفح (F12)
2. تأكد من أن الروابط صحيحة
3. تحقق من إعدادات Access في Cloudinary (يجب أن تكون public)

---

## 📚 روابط مفيدة

- [Cloudinary Console](https://console.cloudinary.com/)
- [Next Cloudinary Docs](https://next.cloudinary.dev/)
- [Cloudinary Upload Widget](https://cloudinary.com/documentation/upload_widget)
- [Image Transformations](https://cloudinary.com/documentation/image_transformations)

---

## ✅ الخلاصة

Cloudinary يوفر:
- ✅ رفع مباشر بدون خادم
- ✅ معالجة تلقائية للصور
- ✅ CDN عالمي سريع
- ✅ مجاني حتى 25GB
- ✅ مثالي للإنتاج

**الحالة:** ✅ جاهز للتطبيق  
**التاريخ:** 31 يناير 2026
