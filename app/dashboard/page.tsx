'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  BookOpen,
  Clock,
  Users,
  Activity,
  Plus,
  SlidersHorizontal,
  Award,
  Database,
  FileText,
  CheckCircle,
  AlertCircle,
  Globe,
  Tag,
  MapPin,
  Users as UsersIcon,
  Calendar,
  Wrench,
  Download,
  Upload,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getComprehensiveGameData, getDataModelStats, getSampleImportData } from '@/lib/actions/dashboard'

// Dashboard stat card component
function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  colorClass,
}: {
  title: string
  value: string | number
  icon: React.ElementType
  trend?: number
  colorClass: string
}) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className={`p-3 rounded-xl ${colorClass}`}>
            <Icon className="w-6 h-6" />
          </div>
          {trend && (
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full flex items-center gap-1">
              +{trend}% <Activity className="w-3 h-3" />
            </span>
          )}
        </div>
        <h3 className="text-3xl font-bold text-brand-deepest mb-1">{value}</h3>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
      </CardContent>
    </Card>
  )
}

// Field display component
function FieldDisplay({ label, value, icon: Icon }: { label: string; value: string | string[]; icon: React.ElementType }) {
  const isArray = Array.isArray(value)
  const displayValue = isArray ? value.join('، ') : value
  
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
      <div className="p-2 rounded-lg bg-gray-50">
        <Icon className="w-4 h-4 text-gray-500" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-bold text-gray-500 mb-1">{label}</p>
        <p className="text-brand-deepest">{displayValue || 'غير محدد'}</p>
      </div>
    </div>
  )
}

// Expandable game card
function GameDataCard({ game }: { game: any }) {
  const [expanded, setExpanded] = useState(false)
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between border-b border-gray-100 py-4 px-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-50">
            <BookOpen className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <CardTitle className="text-lg">{game.canonicalName}</CardTitle>
            <p className="text-sm text-gray-500">{game.country} • {game.heritageField}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={
            game.reviewStatus === 'published' ? 'published' :
            game.reviewStatus === 'draft' ? 'pending' :
            game.reviewStatus === 'under_review' ? 'review' :
            'default'
          }>
            {game.reviewStatus === 'published' ? 'منشور' :
             game.reviewStatus === 'draft' ? 'مسودة' :
             game.reviewStatus === 'under_review' ? 'قيد المراجعة' :
             game.reviewStatus === 'rejected' ? 'مرفوض' : 'مؤرشف'}
          </Badge>
          <button 
            onClick={() => setExpanded(!expanded)}
            className="p-2 hover:bg-gray-50 rounded-lg"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        {/* Basic info always visible */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">نوع اللعبة</p>
            <p className="font-bold">{game.gameType}</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">الفئة العمرية</p>
            <p className="font-bold">{game.ageGroup}</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">عدد اللاعبين</p>
            <p className="font-bold">{game.playersCount}</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">تاريخ الإنشاء</p>
            <p className="font-bold">{game.createdAt}</p>
          </div>
        </div>
        
        {/* Expanded detailed view */}
        {expanded && (
          <div className="border-t border-gray-100 pt-6 mt-6">
            <h4 className="text-lg font-bold mb-4">جميع بيانات اللعبة (36 حقل)</h4>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Column 1: Basic and Geographic Info */}
              <div>
                <h5 className="font-bold mb-3 flex items-center gap-2">
                  <Globe className="w-4 h-4" /> المعلومات الأساسية والجغرافية
                </h5>
                <div className="bg-gray-50 rounded-lg p-4">
                  <FieldDisplay label="الاسم الأساسي" value={game.canonicalName} icon={FileText} />
                  <FieldDisplay label="الأسماء المحلية" value={game.localNames} icon={Tag} />
                  <FieldDisplay label="الرابط الثابت" value={game.slug} icon={FileText} />
                  <FieldDisplay label="الدولة" value={game.country} icon={Globe} />
                  <FieldDisplay label="المنطقة" value={game.region} icon={MapPin} />
                  <FieldDisplay label="الإحداثيات الجغرافية" value={game.geoCoordinates} icon={MapPin} />
                </div>
              </div>
              
              {/* Column 2: Classification and Requirements */}
              <div>
                <h5 className="font-bold mb-3 flex items-center gap-2">
                  <Tag className="w-4 h-4" /> التصنيف والمتطلبات
                </h5>
                <div className="bg-gray-50 rounded-lg p-4">
                  <FieldDisplay label="مجال التراث" value={game.heritageField} icon={Award} />
                  <FieldDisplay label="نوع اللعبة" value={game.gameType} icon={Tag} />
                  <FieldDisplay label="الفئة العمرية" value={game.ageGroup} icon={UsersIcon} />
                  <FieldDisplay label="الممارسون" value={game.practitioners} icon={UsersIcon} />
                  <FieldDisplay label="عدد اللاعبين" value={game.playersCount} icon={UsersIcon} />
                  <FieldDisplay label="الأدوات" value={game.tools} icon={Wrench} />
                  <FieldDisplay label="البيئة" value={game.environment} icon={MapPin} />
                  <FieldDisplay label="التوقيت" value={game.timing} icon={Calendar} />
                </div>
              </div>
              
              {/* Column 3: Content */}
              <div>
                <h5 className="font-bold mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4" /> المحتوى
                </h5>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="py-3 border-b border-gray-100">
                    <p className="text-sm font-bold text-gray-500 mb-1">الوصف</p>
                    <p className="text-brand-deepest">{game.fullDescription || game.description}</p>
                  </div>
                  <FieldDisplay label="القواعد" value={game.rules} icon={FileText} />
                  <FieldDisplay label="نظام الفوز/الخسارة" value={game.winLossSystem} icon={Award} />
                  <FieldDisplay label="آلية البدء/الانتهاء" value={game.startEndMechanism} icon={Clock} />
                  <FieldDisplay label="التقليد الشفهي" value={game.oralTradition} icon={FileText} />
                  <FieldDisplay label="السياق الاجتماعي" value={game.socialContext} icon={UsersIcon} />
                </div>
              </div>
              
              {/* Column 4: Workflow and Metadata */}
              <div>
                <h5 className="font-bold mb-3 flex items-center gap-2">
                  <Database className="w-4 h-4" /> سير العمل والبيانات الوصفية
                </h5>
                <div className="bg-gray-50 rounded-lg p-4">
                  <FieldDisplay label="حالة المراجعة" value={game.reviewStatus} icon={CheckCircle} />
                  <FieldDisplay label="تاريخ الإنشاء" value={game.createdAt} icon={Calendar} />
                  <FieldDisplay label="تاريخ التحديث" value={game.updatedAt} icon={Calendar} />
                  <FieldDisplay label="تاريخ النشر" value={game.publishedAt} icon={Calendar} />
                  <FieldDisplay label="المساهم" value={game.contributor} icon={UsersIcon} />
                  <FieldDisplay label="المراجع" value={game.reviewer} icon={UsersIcon} />
                  <FieldDisplay label="ملاحظات المراجعة" value={game.reviewNotes} icon={FileText} />
                  <FieldDisplay label="الوسوم" value={game.tags} icon={Tag} />
                  <div className="py-3 border-b border-gray-100">
                    <p className="text-sm font-bold text-gray-500 mb-1">الوسائط والمراجع</p>
                    <p className="text-brand-deepest">{game.mediaCount} وسائط، {game.referencesCount} مراجع</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function DashboardPage() {
  const [comprehensiveData, setComprehensiveData] = useState<any>(null)
  const [dataModelStats, setDataModelStats] = useState<any>(null)
  const [sampleImportData, setSampleImportData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        const [gameData, statsData, importData] = await Promise.all([
          getComprehensiveGameData(),
          getDataModelStats(),
          getSampleImportData()
        ])
        
        setComprehensiveData(gameData)
        setDataModelStats(statsData)
        setSampleImportData(importData)
      } catch (error) {
        console.error('Error loading dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [])

  return (
    <div className="animate-in fade-in duration-500">
      {/* Header */}
      <div className="bg-gradient-to-l from-brand/10 to-white rounded-2xl p-8 border-2 border-brand/20 shadow-lg mb-8">
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-14 h-14 bg-brand rounded-xl flex items-center justify-center shadow-lg">
                <Database className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-4xl font-bold text-brand-deepest">
                  لوحة التحكم
                </h2>
                <p className="text-gray-600 mt-1">
                  عرض شامل لجميع البيانات والإحصائيات
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Link href="/dashboard/games/new">
              <Button className="bg-brand hover:bg-brand-deep shadow-md">
                <Plus className="w-5 h-5 ml-1" /> إضافة لعبة جديدة
              </Button>
            </Link>
            <Button variant="outline" className="border-brand/40 text-brand hover:bg-brand/10">
              <Download className="w-5 h-5 ml-1" /> تصدير البيانات
            </Button>
          </div>
        </div>
      </div>

      {/* Data Model Stats */}
      {dataModelStats?.success && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Card className="border-2 border-blue-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <BookOpen className="w-7 h-7 text-white" />
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full flex items-center gap-1">
                  +12% <Activity className="w-3 h-3" />
                </span>
              </div>
              <h3 className="text-4xl font-bold text-blue-600 mb-1">{dataModelStats.stats.totalGames}</h3>
              <p className="text-gray-600 text-sm font-medium">إجمالي الألعاب الموثقة</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Database className="w-7 h-7 text-white" />
                </div>
              </div>
              <h3 className="text-4xl font-bold text-purple-600 mb-1">36</h3>
              <p className="text-gray-600 text-sm font-medium">حقول البيانات الكاملة</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-emerald-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Globe className="w-7 h-7 text-white" />
                </div>
              </div>
              <h3 className="text-4xl font-bold text-emerald-600 mb-1">{dataModelStats.stats.totalCountries}</h3>
              <p className="text-gray-600 text-sm font-medium">الدول المغطاة</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-amber-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Award className="w-7 h-7 text-white" />
                </div>
              </div>
              <h3 className="text-4xl font-bold text-amber-600 mb-1">{dataModelStats.stats.totalHeritageFields}</h3>
              <p className="text-gray-600 text-sm font-medium">مجالات التراث</p>
            </CardContent>
          </Card>
        </div>
      )}

       {/* Actions Section */}
      <div className="mb-10">
        <Card className="border-2 border-gray-200 shadow-lg">
          <CardHeader className="bg-gradient-to-l from-gray-50 to-white border-b-2 border-gray-200">
            <CardTitle className="flex items-center gap-3 text-brand-deepest">
              <div className="w-10 h-10 bg-brand/10 rounded-lg flex items-center justify-center">
                <SlidersHorizontal className="w-5 h-5 text-brand" />
              </div>
              <div>
                <span className="text-xl">الإجراءات السريعة</span>
                <p className="text-xs text-gray-500 font-normal mt-1">
                  الوصول السريع للمهام الأساسية
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/dashboard/games/new" className="block group">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md group-hover:scale-110 transition-transform">
                    <Plus className="w-7 h-7 text-white" />
                  </div>
                  <h4 className="font-bold text-blue-900 mb-2 text-lg">إضافة لعبة جديدة</h4>
                  <p className="text-sm text-blue-700 leading-relaxed">استيراد أو إدخال بيانات لعبة جديدة</p>
                </div>
              </Link>
              
              <Link href="/dashboard/review" className="block group">
                <div className="bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-200 rounded-xl p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1">
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md group-hover:scale-110 transition-transform">
                    <CheckCircle className="w-7 h-7 text-white" />
                  </div>
                  <h4 className="font-bold text-amber-900 mb-2 text-lg">مراجعة المسودات</h4>
                  <p className="text-sm text-amber-700 leading-relaxed">مراجعة الألعاب قيد الانتظار</p>
                </div>
              </Link>
              
              <button 
                onClick={() => alert('ميزة التصدير قريباً')}
                className="block w-full text-center group"
              >
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-2 border-emerald-200 rounded-xl p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1">
                  <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md group-hover:scale-110 transition-transform">
                    <Download className="w-7 h-7 text-white" />
                  </div>
                  <h4 className="font-bold text-emerald-900 mb-2 text-lg">تصدير البيانات</h4>
                  <p className="text-sm text-emerald-700 leading-relaxed">تصدير جميع البيانات بصيغ مختلفة</p>
                </div>
              </button>
              
              <button 
                onClick={() => alert('ميزة التقارير قريباً')}
                className="block w-full text-center group"
              >
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-xl p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md group-hover:scale-110 transition-transform">
                    <FileText className="w-7 h-7 text-white" />
                  </div>
                  <h4 className="font-bold text-purple-900 mb-2 text-lg">التقارير والإحصائيات</h4>
                  <p className="text-sm text-purple-700 leading-relaxed">تقارير مفصلة عن المحتوى</p>
                </div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

       {/* Data Import Section */}
      <div className="mb-10">
        <Card className="border-2 border-indigo-200 shadow-lg">
          <CardHeader className="bg-gradient-to-l from-indigo-50 to-white border-b-2 border-indigo-200">
            <CardTitle className="flex items-center gap-3 text-indigo-900">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Upload className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl">استيراد البيانات الدقيق</span>
                <p className="text-xs text-gray-500 font-normal mt-1">
                  صيغ متعددة مع التحقق الآلي
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold mb-3">صيغ الاستيراد المدعومة</h4>
                <div className="space-y-3">
                  {sampleImportData?.importFormats?.map((format: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span className="font-medium">{format}</span>
                    </div>
                  ))}
                </div>
                
                <h4 className="font-bold mt-6 mb-3">قواعد التحقق من البيانات</h4>
                <div className="space-y-2">
                  {sampleImportData?.validationRules?.map((rule: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5" />
                      <span className="text-sm">{rule}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-bold mb-3">نموذج بيانات للاستيراد (JSON)</h4>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto max-h-64">
                  <pre className="text-sm">
                    {sampleImportData?.sampleJSON || 'جاري تحميل البيانات...'}
                  </pre>
                </div>
                <div className="mt-4 flex gap-3">
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4" /> تحميل نموذج CSV
                  </Button>
                  <Button size="sm" variant="outline">
                    <FileText className="w-4 h-4" /> عرض التوثيق الكامل
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Comprehensive Data Display */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-brand-deepest">
            البيانات النموذجية الشاملة
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Database className="w-4 h-4" />
            <span>عرض {comprehensiveData?.games?.length || 0} لعبة مع جميع الحقول (36 حقل لكل لعبة)</span>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-deepest"></div>
            <p className="mt-4 text-gray-500">جاري تحميل البيانات النموذجية...</p>
          </div>
        ) : comprehensiveData?.success && comprehensiveData.games.length > 0 ? (
          <div className="space-y-6">
            {comprehensiveData.games.map((game: any, idx: number) => (
              <GameDataCard key={game.id || idx} game={game} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg font-bold mb-2">لا توجد بيانات نموذجية</h4>
              <p className="text-gray-500 mb-4">لم يتم العثور على بيانات ألعاب للعرض.</p>
              <Link href="/dashboard/games/new">
                <Button>
                  <Plus className="w-5 h-5" /> إضافة لعبة جديدة
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
