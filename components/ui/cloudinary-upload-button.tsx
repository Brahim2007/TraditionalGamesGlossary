"use client";

import { CldUploadWidget } from 'next-cloudinary';
import { UploadCloud, CheckCircle, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

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
  const [isUploading, setIsUploading] = useState(false);
  const [cloudName, setCloudName] = useState<string>('');
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
    // Get cloud name from environment variable (client-side)
    const envCloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    if (envCloudName) {
      setCloudName(envCloudName);
    } else {
      // Fallback: try to get from window object or use hardcoded value
      setCloudName('dxz7cygmr'); // Hardcoded fallback
    }
  }, []);
  
  // Don't render on server side to avoid hydration mismatch
  if (!isClient) {
    return null;
  }
  
  if (!cloudName) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800 font-bold mb-2">❌ خطأ في الإعداد</p>
        <p className="text-red-700 text-sm mb-2">
          متغير البيئة <code className="bg-red-100 px-1 rounded">NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME</code> غير موجود.
        </p>
        <p className="text-red-600 text-xs">
          يرجى إضافة المتغير التالي إلى ملف .env.local:<br/>
          <code className="bg-red-100 px-1 rounded">NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dxz7cygmr</code>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <CldUploadWidget
        uploadPreset="traditional_games"
        options={{
          cloudName: cloudName,
          maxFiles: maxFiles,
          maxFileSize: 4000000, // 4MB
          resourceType: 'image',
          clientAllowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
          folder: 'traditional-games',
          sources: ['local', 'url', 'camera'],
          multiple: true,
          language: 'ar',
          text: {
            ar: {
              or: 'أو',
              back: 'رجوع',
              advanced: 'متقدم',
              close: 'إغلاق',
              no_results: 'لا توجد نتائج',
              search_placeholder: 'بحث...',
              menu: {
                files: 'ملفاتي',
                web: 'عنوان ويب',
                camera: 'كاميرا',
              },
              local: {
                browse: 'تصفح',
                dd_title_single: 'اسحب وأفلت صورة هنا',
                dd_title_multi: 'اسحب وأفلت صور هنا',
                drop_title_single: 'أفلت الصورة للرفع',
                drop_title_multiple: 'أفلت الصور للرفع',
              },
              url: {
                inner_title: 'عنوان URL للصورة:',
                input_placeholder: 'http://example.com/image.jpg',
              },
              camera: {
                capture: 'التقط صورة',
                cancel: 'إلغاء',
                take_pic: 'التقط صورة وارفعها',
              },
            },
          },
        }}
        onSuccess={(result: any) => {
          setIsUploading(false);
          const url = result.info.secure_url;
          setUploadedFiles(prev => [...prev, url]);
          if (onUploadComplete) {
            onUploadComplete(url);
          }
        }}
        onError={(error: any) => {
          setIsUploading(false);
          console.error('Upload error:', error);
          
          // رسالة خطأ مفصلة
          let errorMessage = 'حدث خطأ أثناء رفع الصورة';
          
          if (error?.error?.message) {
            errorMessage = error.error.message;
          } else if (error?.message) {
            errorMessage = error.message;
          }
          
          // إذا كان الخطأ متعلق بـ Upload Preset
          if (errorMessage.includes('preset') || errorMessage.includes('not found')) {
            errorMessage = 'خطأ: Upload Preset غير موجود في Cloudinary. يرجى إنشاء preset باسم "traditional_games" في إعدادات Cloudinary، أو استخدم خيار "أضف رابط صورة" أدناه.';
          }
          
          // إذا كان الخطأ متعلق بـ API Key
          if (errorMessage.includes('API key') || errorMessage.includes('Unknown API')) {
            errorMessage = 'خطأ: Cloud Name غير صحيح أو الخادم لم يُعاد تشغيله بعد إضافة المتغيرات. يرجى إعادة تشغيل الخادم (npm run dev).';
          }
          
          alert(errorMessage);
          
          if (onUploadError) {
            onUploadError(new Error(errorMessage));
          }
        }}
        onOpen={() => setIsUploading(true)}
        onClose={() => setIsUploading(false)}
        onQueuesEnd={(result: any, widget: any) => {
          // Fallback: if upload fails, provide manual URL input option
          if (result && result.info && result.info.error) {
            console.error('Upload failed, suggesting manual URL input');
            // The component will show the error message above
          }
        }}
      >
        {({ open }) => (
          <button
            type="button"
            onClick={() => open()}
            disabled={isUploading}
            className="w-full flex items-center justify-center gap-2 bg-brand-deepest text-white px-4 py-3 rounded-lg hover:bg-brand-deep transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>جاري الرفع...</span>
              </>
            ) : (
              <>
                <UploadCloud className="h-4 w-4" />
                <span>{buttonText}</span>
              </>
            )}
          </button>
        )}
      </CldUploadWidget>

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-bold text-brand-deepest">
            تم رفع {uploadedFiles.length} صورة بنجاح
          </h4>
          {uploadedFiles.map((url, index) => (
            <div
              key={index}
              className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-2 rounded"
            >
              <CheckCircle className="h-4 w-4" />
              <span className="truncate">صورة {index + 1}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
