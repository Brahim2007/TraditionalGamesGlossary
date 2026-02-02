// Dashboard Settings Page
// صفحة الإعدادات

import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Settings, Shield, Database, Bell, Globe } from 'lucide-react'
import { getSetting } from '@/lib/actions/settings'
import { SettingsClient } from './SettingsClient'

export default async function SettingsPage() {
  const user = await getCurrentUser()

  // Redirect if not admin
  if (!user || user.role !== 'admin') {
    redirect('/dashboard')
  }

  // Fetch current settings
  const videoClipsResult = await getSetting('hero_video_clips')
  const siteTitleResult = await getSetting('site_title')
  const siteDescriptionResult = await getSetting('site_description')

  let videoClips = []
  try {
    videoClips = videoClipsResult.setting?.value 
      ? JSON.parse(videoClipsResult.setting.value)
      : [{
          videoId: 'k-vNeRMMILo',
          startTime: 0,
          endTime: 30,
          title: 'مقطع 1'
        }]
  } catch {
    videoClips = [{
      videoId: 'k-vNeRMMILo',
      startTime: 0,
      endTime: 30,
      title: 'مقطع 1'
    }]
  }

  const siteTitle = siteTitleResult.setting?.value || 'مسرد الألعاب التراثية العربية'
  const siteDescription = siteDescriptionResult.setting?.value || 'منصة توثيقية تفاعلية تحفظ قواعد وقيم الألعاب التقليدية في العالم العربي'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-l from-gray-100 to-white rounded-2xl p-8 border-2 border-gray-200 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-14 h-14 bg-gradient-to-br from-gray-600 to-gray-800 rounded-xl flex items-center justify-center shadow-lg">
                <Settings className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-brand-deepest">إعدادات النظام</h1>
                <p className="text-gray-600 mt-1">
                  إدارة إعدادات النظام والمستخدمين والصلاحيات
                </p>
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <div className="text-right">
              <p className="text-sm text-gray-500">للمسؤولين فقط</p>
              <p className="text-xs text-gray-400">صلاحيات كاملة</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Homepage Settings */}
      <SettingsClient 
        videoClips={videoClips}
        siteTitle={siteTitle}
        siteDescription={siteDescription}
      />

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Settings */}
        <Card className="border-2 border-blue-200 shadow-lg">
          <CardHeader className="bg-gradient-to-l from-blue-50 to-white border-b-2 border-blue-200">
            <CardTitle className="flex items-center gap-3 text-blue-900">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl">إعدادات النظام</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                اسم النظام
              </label>
              <Input defaultValue="معجم الألعاب التراثية العربية" />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                وصف النظام
              </label>
              <Input defaultValue="أرشيف رقمي للألعاب الشعبية العربية" />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                البريد الإلكتروني للدعم
              </label>
              <Input defaultValue="support@traditionalgames.com" />
            </div>

            <Button className="w-full">حفظ إعدادات النظام</Button>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="border-2 border-red-200 shadow-lg">
          <CardHeader className="bg-gradient-to-l from-red-50 to-white border-b-2 border-red-200">
            <CardTitle className="flex items-center gap-3 text-red-900">
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl">إعدادات الأمان</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                الحد الأدنى لكلمة المرور
              </label>
              <Input type="number" defaultValue="8" min="6" max="20" />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                مدة انتهاء الجلسة (أيام)
              </label>
              <Input type="number" defaultValue="7" min="1" max="30" />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-sm text-gray-700">تفعيل المصادقة الثنائية</span>
              </label>
            </div>

            <Button className="w-full">حفظ إعدادات الأمان</Button>
          </CardContent>
        </Card>

        {/* Database Settings */}
        <Card className="border-2 border-purple-200 shadow-lg">
          <CardHeader className="bg-gradient-to-l from-purple-50 to-white border-b-2 border-purple-200">
            <CardTitle className="flex items-center gap-3 text-purple-900">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <Database className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl">إعدادات قاعدة البيانات</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                نسخ احتياطي تلقائي
              </label>
              <select className="w-full border rounded-lg px-3 py-2" defaultValue="weekly">
                <option value="daily">يومياً</option>
                <option value="weekly">أسبوعياً</option>
                <option value="monthly">شهرياً</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                الاحتفاظ بالسجلات (أيام)
              </label>
              <Input type="number" defaultValue="90" min="30" max="365" />
            </div>

            <Button variant="outline" className="w-full">
              إنشاء نسخة احتياطية الآن
            </Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="border-2 border-amber-200 shadow-lg">
          <CardHeader className="bg-gradient-to-l from-amber-50 to-white border-b-2 border-amber-200">
            <CardTitle className="flex items-center gap-3 text-amber-900">
              <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl">إعدادات الإشعارات</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-sm text-gray-700">إشعارات المراجعة</span>
              </label>

              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-sm text-gray-700">إشعارات التطابقات الجديدة</span>
              </label>

              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm text-gray-700">إشعارات البريد الإلكتروني</span>
              </label>

              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-sm text-gray-700">إشعارات النظام</span>
              </label>
            </div>

            <Button className="w-full">حفظ إعدادات الإشعارات</Button>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Settings */}
      <Card className="border-2 border-green-200 shadow-lg">
        <CardHeader className="bg-gradient-to-l from-green-50 to-white border-b-2 border-green-200">
          <CardTitle className="flex items-center gap-3 text-green-900">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl">إعدادات متقدمة</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="w-full">
              إعادة تعيين النظام
            </Button>
            <Button variant="outline" className="w-full text-red-600 border-red-200">
              مسح ذاكرة التخزين المؤقت
            </Button>
            <Button variant="outline" className="w-full">
              تصدير جميع البيانات
            </Button>
            <Button variant="outline" className="w-full">
              استيراد بيانات
            </Button>
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm text-gray-500">
              <strong>ملاحظة:</strong> بعض الإعدادات تتطلب إعادة تشغيل النظام لتطبيق التغييرات.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* System Info */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-2xl border-2 border-gray-200 shadow-lg">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center">
            <Database className="w-4 h-4 text-white" />
          </div>
          معلومات النظام
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl border-2 border-gray-200 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">إصدار النظام</p>
            <p className="font-bold text-gray-900 text-lg">v2.0.0</p>
          </div>
          <div className="bg-white p-4 rounded-xl border-2 border-gray-200 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">آخر تحديث</p>
            <p className="font-bold text-gray-900 text-lg">31 يناير 2026</p>
          </div>
          <div className="bg-white p-4 rounded-xl border-2 border-green-200 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">حالة النظام</p>
            <p className="font-bold text-green-600 text-lg flex items-center gap-2">
              <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
              يعمل بشكل طبيعي
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}