"use client"

import { useState, useRef } from 'react'
import { UploadCloud, CheckCircle, Loader2, X, Image as ImageIcon } from 'lucide-react'
import { IKContext, IKUpload } from '@imagekit/react'

interface ImageKitUploadButtonProps {
  onUploadComplete?: (url: string) => void
  onUploadError?: (error: Error) => void
  buttonText?: string
  maxFiles?: number
}

const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || ''
const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || ''

const authenticator = async () => {
  try {
    const response = await fetch('/api/imagekit/auth')
    if (!response.ok) {
      throw new Error('Authentication request failed')
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Authentication error:', error)
    throw error
  }
}

export function ImageKitUploadButton({
  onUploadComplete,
  onUploadError,
  buttonText = "رفع صورة",
  maxFiles = 5,
}: ImageKitUploadButtonProps) {
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const ikUploadRef = useRef<HTMLInputElement>(null)

  const onError = (err: any) => {
    setIsUploading(false)
    console.error('Upload error:', err)

    let errorMessage = 'حدث خطأ أثناء رفع الصورة'
    if (err?.message) {
      errorMessage = err.message
    }

    setError(errorMessage)

    if (onUploadError) {
      onUploadError(new Error(errorMessage))
    }
  }

  const onSuccess = (res: any) => {
    setIsUploading(false)
    setError(null)

    const url = res.url
    setUploadedFiles(prev => [...prev, url])

    if (onUploadComplete) {
      onUploadComplete(url)
    }
  }

  const onUploadStart = () => {
    setIsUploading(true)
    setError(null)
  }

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  // Check if ImageKit is configured
  if (!publicKey || !urlEndpoint) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800 font-bold mb-2">⚠️ ImageKit غير مُعد</p>
        <p className="text-yellow-700 text-sm mb-2">
          يرجى إضافة المتغيرات التالية إلى ملف <code className="bg-yellow-100 px-1 rounded">.env.local</code>:
        </p>
        <pre className="text-yellow-600 text-xs bg-yellow-100 p-2 rounded overflow-x-auto">
{`NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=public_xxx
IMAGEKIT_PRIVATE_KEY=private_xxx
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id`}
        </pre>
      </div>
    )
  }

  return (
    <IKContext
      publicKey={publicKey}
      urlEndpoint={urlEndpoint}
      authenticator={authenticator}
    >
      <div className="space-y-4">
        {/* Upload Button */}
        <div className="relative">
          <IKUpload
            ref={ikUploadRef}
            onError={onError}
            onSuccess={onSuccess}
            onUploadStart={onUploadStart}
            folder="/traditional-games"
            validateFile={(file: File) => {
              // Validate file type
              const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
              if (!validTypes.includes(file.type)) {
                return false
              }
              // Validate file size (max 5MB)
              if (file.size > 5 * 1024 * 1024) {
                return false
              }
              return true
            }}
            style={{ display: 'none' }}
          />

          <button
            type="button"
            onClick={() => ikUploadRef.current?.click()}
            disabled={isUploading || uploadedFiles.length >= maxFiles}
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
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-brand-deepest">
              تم رفع {uploadedFiles.length} صورة بنجاح
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {uploadedFiles.map((url, index) => (
                <div
                  key={index}
                  className="relative group bg-gray-100 rounded-lg overflow-hidden"
                >
                  <img
                    src={url}
                    alt={`صورة ${index + 1}`}
                    className="w-full h-24 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-green-500/80 text-white text-xs py-1 px-2 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    <span>صورة {index + 1}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Max files notice */}
        {uploadedFiles.length >= maxFiles && (
          <p className="text-sm text-amber-600">
            تم الوصول للحد الأقصى ({maxFiles} صور)
          </p>
        )}
      </div>
    </IKContext>
  )
}
