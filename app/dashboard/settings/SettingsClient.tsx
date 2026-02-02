'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Video, Save, CheckCircle2, AlertCircle } from 'lucide-react'
import { upsertSetting, type VideoClip } from '@/lib/actions/settings'
import { useRouter } from 'next/navigation'
import { VideoClipsManager } from './VideoClipsManager'

interface SettingsClientProps {
  videoClips: VideoClip[]
  siteTitle: string
  siteDescription: string
}

export function SettingsClient({ 
  videoClips: initialVideoClips, 
  siteTitle, 
  siteDescription 
}: SettingsClientProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  
  const [videoClips, setVideoClips] = useState<VideoClip[]>(initialVideoClips)
  const [title, setTitle] = useState(siteTitle)
  const [description, setDescription] = useState(siteDescription)

  const handleSaveHomepageSettings = async () => {
    setLoading(true)
    setMessage(null)

    try {
      // التحقق من صحة المقاطع
      if (videoClips.length === 0) {
        setMessage({ type: 'error', text: 'يجب إضافة مقطع فيديو واحد على الأقل' })
        setLoading(false)
        return
      }

      const invalidClip = videoClips.find(clip => !clip.videoId || clip.startTime >= clip.endTime)
      if (invalidClip) {
        setMessage({ type: 'error', text: 'يرجى التأكد من صحة بيانات جميع المقاطع' })
        setLoading(false)
        return
      }
      
      const results = await Promise.all([
        upsertSetting({
          key: 'hero_video_clips',
          value: JSON.stringify(videoClips),
          category: 'homepage',
          label: 'مقاطع فيديو الصفحة الرئيسية',
          description: 'قائمة بمقاطع الفيديو التي تظهر في خلفية القسم البطولي'
        }),
        upsertSetting({
          key: 'site_title',
          value: title,
          category: 'general',
          label: 'عنوان الموقع',
          description: 'العنوان الرئيسي للموقع'
        }),
        upsertSetting({
          key: 'site_description',
          value: description,
          category: 'general',
          label: 'وصف الموقع',
          description: 'الوصف المختصر للموقع'
        })
      ])

      const failed = results.find(r => !r.success)
      if (failed) {
        setMessage({ type: 'error', text: failed.message || 'حدث خطأ أثناء الحفظ' })
      } else {
        setMessage({ type: 'success', text: 'تم حفظ الإعدادات بنجاح' })
        router.refresh()
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'حدث خطأ أثناء حفظ الإعدادات' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-2 border-purple-200 shadow-lg">
      <CardHeader className="bg-gradient-to-l from-purple-50 to-white border-b-2 border-purple-200">
        <CardTitle className="flex items-center gap-3 text-purple-900">
          <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
            <Video className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl">إعدادات الصفحة الرئيسية</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {/* Video Clips Manager */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            مقاطع الفيديو
          </label>
          <p className="text-xs text-gray-500 mb-4">
            يمكنك إضافة عدة مقاطع من فيديوهات مختلفة بأوقات محددة. سيتم تشغيلها بشكل متتابع بدون انقطاع.
          </p>
          <VideoClipsManager 
            clips={videoClips}
            onChange={setVideoClips}
          />
        </div>

        {/* Site Title */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            عنوان الموقع
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="مسرد الألعاب التراثية العربية"
          />
        </div>

        {/* Site Description */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            وصف الموقع
          </label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="منصة توثيقية تفاعلية تحفظ قواعد وقيم الألعاب التقليدية في العالم العربي"
            rows={3}
          />
        </div>

        {/* Message */}
        {message && (
          <div
            className={`flex items-center gap-2 p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-50 text-green-800 border-2 border-green-200'
                : 'bg-red-50 text-red-800 border-2 border-red-200'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span className="text-sm font-medium">{message.text}</span>
          </div>
        )}

        {/* Save Button */}
        <Button
          onClick={handleSaveHomepageSettings}
          disabled={loading}
          className="w-full"
        >
          {loading ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              جاري الحفظ...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              حفظ إعدادات الصفحة الرئيسية
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
