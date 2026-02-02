// Dashboard Stats Page
// صفحة الإحصائيات

import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { getDashboardStats } from '@/lib/actions/dashboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, Users, Gamepad2, Clock, TrendingUp } from 'lucide-react'

export default async function StatsPage() {
  const user = await getCurrentUser()

  // Redirect if not reviewer or admin
  if (!user || !['reviewer', 'admin'].includes(user.role)) {
    redirect('/dashboard')
  }

  const stats = await getDashboardStats()

  if (!stats.success) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-brand-deepest mb-6">الإحصائيات</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          خطأ في جلب الإحصائيات: {stats.message}
        </div>
      </div>
    )
  }

  const { totalGames, pendingReview, publishedGames, contributors } = stats.stats || {
    totalGames: 0,
    pendingReview: 0,
    publishedGames: 0,
    contributors: 0
  }
  const recentActivity = stats.recentActivity || []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-l from-purple/10 to-white rounded-2xl p-8 border-2 border-purple/20 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-brand-deepest">الإحصائيات</h1>
                <p className="text-gray-600 mt-1">
                  نظرة عامة على أداء النظام ونشاط المستخدمين
                </p>
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <div className="text-right">
              <p className="text-sm text-gray-500">تحديث تلقائي</p>
              <p className="text-xs text-gray-400">كل 5 دقائق</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-2 border-brand/30 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-brand-deep font-medium mb-1">إجمالي الألعاب</p>
                <p className="text-4xl font-bold text-brand-deep mt-2">{totalGames || 0}</p>
                <p className="text-xs text-gray-500 mt-1">في النظام</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-brand to-brand-deep rounded-xl flex items-center justify-center shadow-lg">
                <Gamepad2 className="w-7 h-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-amber-200 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-700 font-medium mb-1">في انتظار المراجعة</p>
                <p className="text-4xl font-bold text-amber-600 mt-2">{pendingReview || 0}</p>
                <p className="text-xs text-gray-500 mt-1">يحتاج إلى اهتمام</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                <Clock className="w-7 h-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 font-medium mb-1">الألعاب المنشورة</p>
                <p className="text-4xl font-bold text-green-600 mt-2">{publishedGames || 0}</p>
                <p className="text-xs text-gray-500 mt-1">متاحة للعامة</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-200 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 font-medium mb-1">المساهمين</p>
                <p className="text-4xl font-bold text-blue-600 mt-2">{contributors || 0}</p>
                <p className="text-xs text-gray-500 mt-1">نشطين</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Users className="w-7 h-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="border-2 border-gray-200 shadow-lg">
        <CardHeader className="bg-gradient-to-l from-gray-50 to-white border-b-2 border-gray-200">
          <CardTitle className="flex items-center gap-3 text-brand-deepest">
            <div className="w-10 h-10 bg-brand/10 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-brand" />
            </div>
            <div>
              <span className="text-xl">النشاط الأخير</span>
              <p className="text-xs text-gray-500 font-normal mt-1">
                آخر {recentActivity.length} عملية
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentActivity.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>لا يوجد نشاط حديث</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl hover:border-brand/30 hover:bg-brand/5 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${
                      activity.action === 'published' ? 'bg-gradient-to-br from-green-400 to-green-600' :
                      activity.action === 'created' ? 'bg-gradient-to-br from-blue-400 to-blue-600' :
                      activity.action === 'updated' ? 'bg-gradient-to-br from-amber-400 to-amber-600' :
                      'bg-gradient-to-br from-purple-400 to-purple-600'
                    }`}>
                      {activity.action === 'published' && (
                        <TrendingUp className="w-6 h-6 text-white" />
                      )}
                      {activity.action === 'created' && (
                        <Gamepad2 className="w-6 h-6 text-white" />
                      )}
                      {activity.action === 'updated' && (
                        <Clock className="w-6 h-6 text-white" />
                      )}
                      {activity.action === 'approved' && (
                        <Users className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">
                        {activity.game?.canonicalName || 'لعبة غير معروفة'}
                      </p>
                      <p className="text-sm text-gray-600 mt-0.5">
                        <span className="font-medium">{activity.reviewer?.name || 'مستخدم غير معروف'}</span>
                        {' '}-{' '}
                        <span className="text-gray-500">{getActionText(activity.action)}</span>
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
                    {new Date(activity.createdAt).toLocaleDateString('ar-SA')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info */}
      <div className="text-sm text-gray-500">
        <p>
          <strong>ملاحظة:</strong> يتم تحديث الإحصائيات تلقائياً. آخر تحديث: الآن
        </p>
      </div>
    </div>
  )
}

function getActionText(action: string): string {
  const actions: Record<string, string> = {
    created: 'أنشأ اللعبة',
    updated: 'حدث اللعبة',
    published: 'نشر اللعبة',
    reviewed: 'راجع اللعبة',
    submitted: 'أرسل للمراجعة',
    rejected: 'رفض اللعبة',
    archived: 'أرشف اللعبة',
  }
  return actions[action] || action
}