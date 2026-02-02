'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Edit, Trash2, Eye, Loader2, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { deleteGame, publishGame } from '@/lib/actions/game'

interface GameActionsProps {
  gameId: string
  gameSlug: string
  gameName: string
  userRole: string
  contributorId?: string | null
  currentUserId: string
  reviewStatus: string
}

export function GameActions({
  gameId,
  gameSlug,
  gameName,
  userRole,
  contributorId,
  currentUserId,
  reviewStatus,
}: GameActionsProps) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)
  const [publishing, setPublishing] = useState(false)

  const canEdit =
    userRole === 'admin' ||
    userRole === 'reviewer' ||
    (userRole === 'editor' && contributorId === currentUserId)

  const canDelete = userRole === 'admin' || (userRole === 'editor' && contributorId === currentUserId)
  
  const canPublish = (userRole === 'admin' || userRole === 'reviewer') && reviewStatus === 'draft'

  const handleDelete = async () => {
    if (deleting) return

    const confirmed = confirm(
      `⚠️ هل أنت متأكد من حذف اللعبة "${gameName}"؟\n\nسيتم أرشفة اللعبة ولن تكون مرئية للجمهور.\nهذا الإجراء لا يمكن التراجع عنه.`
    )

    if (!confirmed) return

    setDeleting(true)

    try {
      const result = await deleteGame(gameId)

      if (result.success) {
        alert('✅ تم أرشفة اللعبة بنجاح')
        router.refresh()
      } else {
        alert(`❌ فشل الحذف: ${result.message}`)
      }
    } catch (error) {
      console.error('Error deleting game:', error)
      alert('حدث خطأ أثناء حذف اللعبة')
    } finally {
      setDeleting(false)
    }
  }

  const handlePublish = async () => {
    if (publishing) return

    const confirmed = confirm(
      `✅ هل تريد نشر اللعبة "${gameName}"؟\n\nسيتم نشر اللعبة وإتاحتها للجمهور.`
    )

    if (!confirmed) return

    setPublishing(true)

    try {
      const result = await publishGame(gameId, currentUserId)

      if (result.success) {
        alert('✅ تم نشر اللعبة بنجاح')
        router.refresh()
      } else {
        alert(`❌ فشل النشر: ${result.message}`)
      }
    } catch (error) {
      console.error('Error publishing game:', error)
      alert('حدث خطأ أثناء نشر اللعبة')
    } finally {
      setPublishing(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Link href={`/game/${gameSlug}`}>
        <Button variant="ghost" size="sm">
          <Eye className="w-4 h-4" />
          عرض
        </Button>
      </Link>
      {canPublish && (
        <Button
          variant="default"
          size="sm"
          onClick={handlePublish}
          disabled={publishing}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          {publishing ? (
            <Loader2 className="w-4 h-4 ml-1 animate-spin" />
          ) : (
            <CheckCircle className="w-4 h-4 ml-1" />
          )}
          نشر
        </Button>
      )}
      {canEdit && (
        <Link href={`/dashboard/games/edit/${gameId}`}>
          <Button variant="outline" size="sm">
            <Edit className="w-4 h-4 ml-1" />
            تعديل
          </Button>
        </Link>
      )}
      {canDelete && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          disabled={deleting}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          {deleting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Trash2 className="w-4 h-4" />
          )}
        </Button>
      )}
    </div>
  )
}
