'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Plus, Trash2, Play, GripVertical } from 'lucide-react'
import type { VideoClip } from '@/lib/actions/settings'

interface VideoClipsManagerProps {
  clips: VideoClip[]
  onChange: (clips: VideoClip[]) => void
}

export function VideoClipsManager({ clips, onChange }: VideoClipsManagerProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null)

  const addClip = () => {
    const newClip: VideoClip = {
      videoId: '',
      startTime: 0,
      endTime: 30,
      title: `مقطع ${clips.length + 1}`
    }
    onChange([...clips, newClip])
    setEditingIndex(clips.length)
  }

  const removeClip = (index: number) => {
    onChange(clips.filter((_, i) => i !== index))
  }

  const updateClip = (index: number, field: keyof VideoClip, value: string | number) => {
    const newClips = [...clips]
    newClips[index] = { ...newClips[index], [field]: value }
    onChange(newClips)
  }

  const extractYouTubeId = (url: string): string => {
    if (!url.includes('/') && !url.includes('?')) {
      return url
    }
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/
    ]
    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) return match[1]
    }
    return url
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-4">
      {clips.map((clip, index) => (
        <Card key={index} className="p-4 border-2 border-purple-200">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GripVertical className="w-4 h-4 text-gray-400" />
                <span className="font-bold text-purple-900">
                  {clip.title || `مقطع ${index + 1}`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingIndex(editingIndex === index ? null : index)}
                >
                  {editingIndex === index ? 'إخفاء' : 'تعديل'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeClip(index)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Editing Form */}
            {editingIndex === index && (
              <div className="space-y-3 pt-3 border-t border-purple-200">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    عنوان المقطع
                  </label>
                  <Input
                    value={clip.title || ''}
                    onChange={(e) => updateClip(index, 'title', e.target.value)}
                    placeholder="مقطع 1"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    رابط الفيديو
                  </label>
                  <Input
                    value={clip.videoId}
                    onChange={(e) => updateClip(index, 'videoId', extractYouTubeId(e.target.value))}
                    placeholder="k-vNeRMMILo أو https://www.youtube.com/watch?v=..."
                    className="text-left"
                    dir="ltr"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      وقت البداية (ثانية)
                    </label>
                    <Input
                      type="number"
                      value={clip.startTime}
                      onChange={(e) => updateClip(index, 'startTime', parseInt(e.target.value) || 0)}
                      min="0"
                    />
                    <p className="text-xs text-gray-500">{formatTime(clip.startTime)}</p>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      وقت النهاية (ثانية)
                    </label>
                    <Input
                      type="number"
                      value={clip.endTime}
                      onChange={(e) => updateClip(index, 'endTime', parseInt(e.target.value) || 0)}
                      min={clip.startTime + 1}
                    />
                    <p className="text-xs text-gray-500">{formatTime(clip.endTime)}</p>
                  </div>
                </div>

                {/* Preview */}
                {clip.videoId && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      معاينة المقطع
                    </label>
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-200">
                      <iframe
                        className="absolute inset-0 w-full h-full"
                        src={`https://www.youtube.com/embed/${clip.videoId}?start=${clip.startTime}&end=${clip.endTime}&controls=1`}
                        title={`Preview ${clip.title}`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Summary */}
            {editingIndex !== index && (
              <div className="text-sm text-gray-600 flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Play className="w-3 h-3" />
                  {clip.videoId || 'لم يتم تحديد الفيديو'}
                </span>
                <span>
                  {formatTime(clip.startTime)} - {formatTime(clip.endTime)}
                </span>
                <span className="text-purple-600 font-medium">
                  ({clip.endTime - clip.startTime} ثانية)
                </span>
              </div>
            )}
          </div>
        </Card>
      ))}

      {/* Add Button */}
      <Button
        onClick={addClip}
        variant="outline"
        className="w-full border-2 border-dashed border-purple-300 hover:border-purple-500 hover:bg-purple-50"
      >
        <Plus className="w-4 h-4 mr-2" />
        إضافة مقطع جديد
      </Button>

      {/* Total Duration */}
      {clips.length > 0 && (
        <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-purple-900">إجمالي المدة:</span>
            <span className="font-bold text-purple-700">
              {formatTime(clips.reduce((acc, clip) => acc + (clip.endTime - clip.startTime), 0))}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm mt-2">
            <span className="font-medium text-purple-900">عدد المقاطع:</span>
            <span className="font-bold text-purple-700">{clips.length}</span>
          </div>
        </div>
      )}
    </div>
  )
}
