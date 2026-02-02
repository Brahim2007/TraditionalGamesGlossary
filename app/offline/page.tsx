/**
 * Offline Page
 * صفحة عدم الاتصال
 */

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'غير متصل | مسرد الألعاب التراثية',
  description: 'يبدو أنك غير متصل بالإنترنت',
};

export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white px-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Icon */}
        <div className="mx-auto w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
          <svg
            className="w-12 h-12 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
            />
          </svg>
        </div>

        {/* Title */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            غير متصل
          </h1>
          <p className="text-xl text-gray-600">
            يبدو أنك غير متصل بالإنترنت
          </p>
        </div>

        {/* Description */}
        <div className="space-y-4 text-gray-600">
          <p>
            لا تقلق! يمكنك الاستمرار في تصفح المحتوى المخزن مؤقتاً.
          </p>
          <p>
            سيتم مزامنة أي تغييرات تقوم بها تلقائياً عند عودة الاتصال.
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="إعادة المحاولة"
          >
            إعادة المحاولة
          </button>

          <button
            onClick={() => window.history.back()}
            className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            aria-label="العودة للخلف"
          >
            العودة للخلف
          </button>

          <a
            href="/"
            className="block w-full text-center text-blue-600 hover:text-blue-700 font-medium focus:outline-none focus:underline"
            aria-label="الذهاب للصفحة الرئيسية"
          >
            الذهاب للصفحة الرئيسية
          </a>
        </div>

        {/* Connection Status */}
        <div
          id="connection-status"
          className="p-4 bg-gray-50 rounded-lg text-sm text-gray-600"
          role="status"
          aria-live="polite"
        >
          <p className="font-medium mb-1">حالة الاتصال:</p>
          <p id="status-text">غير متصل</p>
        </div>
      </div>

      {/* Script for connection monitoring */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              const statusText = document.getElementById('status-text');
              const statusDiv = document.getElementById('connection-status');
              
              function updateStatus() {
                if (navigator.onLine) {
                  statusText.textContent = 'متصل - جاري إعادة التحميل...';
                  statusDiv.className = 'p-4 bg-green-50 rounded-lg text-sm text-green-600';
                  setTimeout(() => window.location.reload(), 1000);
                } else {
                  statusText.textContent = 'غير متصل';
                  statusDiv.className = 'p-4 bg-gray-50 rounded-lg text-sm text-gray-600';
                }
              }
              
              window.addEventListener('online', updateStatus);
              window.addEventListener('offline', updateStatus);
              
              updateStatus();
            })();
          `,
        }}
      />
    </div>
  );
}
