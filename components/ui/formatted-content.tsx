"use client"

import { Trophy, Play, Square, CheckCircle2, CircleDot, XCircle } from 'lucide-react'

interface FormattedContentProps {
  content: string
  type: 'win-loss' | 'start-end' | 'social-context' | 'numbered-list'
}

export function FormattedContent({ content, type }: FormattedContentProps) {
  if (!content) return null

  switch (type) {
    case 'win-loss':
      return <WinLossContent content={content} />
    case 'start-end':
      return <StartEndContent content={content} />
    case 'social-context':
    case 'numbered-list':
      return <NumberedContent content={content} />
    default:
      return <p className="text-[#333333] leading-relaxed whitespace-pre-wrap">{content}</p>
  }
}

function WinLossContent({ content }: { content: string }) {
  // Parse win and loss sections
  const lines = content.split(/\n/).filter(line => line.trim())

  const winLine = lines.find(line => line.includes('الفوز:') || line.includes('الفوز '))
  const lossLine = lines.find(line => line.includes('الخسارة:') || line.includes('الخسارة '))

  // If no structured format found, show as regular text
  if (!winLine && !lossLine) {
    return <p className="text-[#333333] leading-relaxed whitespace-pre-wrap">{content}</p>
  }

  const extractContent = (line: string | undefined, keyword: string) => {
    if (!line) return null
    return line.replace(new RegExp(`^.*?${keyword}:?\\s*`), '').trim()
  }

  const winContent = extractContent(winLine, 'الفوز')
  const lossContent = extractContent(lossLine, 'الخسارة')

  return (
    <div className="space-y-4">
      {winContent && (
        <div className="flex gap-4 p-4 bg-gradient-to-l from-emerald-50 to-green-50 rounded-xl border border-emerald-200">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-md">
              <Trophy className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-emerald-700 mb-1 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              الفوز
            </h4>
            <p className="text-emerald-900 leading-relaxed">{winContent}</p>
          </div>
        </div>
      )}

      {lossContent && (
        <div className="flex gap-4 p-4 bg-gradient-to-l from-red-50 to-rose-50 rounded-xl border border-red-200">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center shadow-md">
              <XCircle className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-red-700 mb-1 flex items-center gap-2">
              <XCircle className="h-4 w-4" />
              الخسارة
            </h4>
            <p className="text-red-900 leading-relaxed">{lossContent}</p>
          </div>
        </div>
      )}
    </div>
  )
}

function StartEndContent({ content }: { content: string }) {
  // Parse start and end sections
  const lines = content.split(/\n/).filter(line => line.trim())

  const startLine = lines.find(line => line.includes('البدء:') || line.includes('البدء '))
  const endLine = lines.find(line => line.includes('الانتهاء:') || line.includes('الانتهاء '))

  // If no structured format found, show as regular text
  if (!startLine && !endLine) {
    return <p className="text-[#333333] leading-relaxed whitespace-pre-wrap">{content}</p>
  }

  const extractContent = (line: string | undefined, keyword: string) => {
    if (!line) return null
    return line.replace(new RegExp(`^.*?${keyword}:?\\s*`), '').trim()
  }

  const startContent = extractContent(startLine, 'البدء')
  const endContent = extractContent(endLine, 'الانتهاء')

  return (
    <div className="space-y-4">
      {startContent && (
        <div className="flex gap-4 p-4 bg-gradient-to-l from-blue-50 to-sky-50 rounded-xl border border-blue-200">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-sky-600 rounded-xl flex items-center justify-center shadow-md">
              <Play className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-blue-700 mb-1 flex items-center gap-2">
              <Play className="h-4 w-4" />
              البدء
            </h4>
            <p className="text-blue-900 leading-relaxed">{startContent}</p>
          </div>
        </div>
      )}

      {endContent && (
        <div className="flex gap-4 p-4 bg-gradient-to-l from-amber-50 to-orange-50 rounded-xl border border-amber-200">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md">
              <Square className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-amber-700 mb-1 flex items-center gap-2">
              <Square className="h-4 w-4" />
              الانتهاء
            </h4>
            <p className="text-amber-900 leading-relaxed">{endContent}</p>
          </div>
        </div>
      )}
    </div>
  )
}

function NumberedContent({ content }: { content: string }) {
  // Split by numbered items (1. 2. 3. etc)
  const lines = content.split(/\n/).filter(line => line.trim())

  // Check if content has numbered format
  const hasNumbers = lines.some(line => /^\d+\.\s/.test(line.trim()))

  if (!hasNumbers) {
    // If no numbers, just split by newlines
    if (lines.length === 1) {
      return <p className="text-[#333333] leading-relaxed">{content}</p>
    }

    return (
      <div className="space-y-3">
        {lines.map((line, index) => (
          <div
            key={index}
            className="flex gap-3 p-3 bg-[#faf9f5] rounded-xl border border-[#e0e0e0]"
          >
            <CircleDot className="h-5 w-5 text-[#f4a582] flex-shrink-0 mt-0.5" />
            <p className="text-[#333333] leading-relaxed">{line}</p>
          </div>
        ))}
      </div>
    )
  }

  // Parse numbered items
  const items = lines.map(line => {
    const match = line.trim().match(/^(\d+)\.\s*(.*)/)
    if (match) {
      return { number: parseInt(match[1]), text: match[2] }
    }
    return { number: 0, text: line }
  })

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div
          key={index}
          className="flex gap-4 p-4 bg-gradient-to-l from-[#f4a582]/10 to-[#faf9f5] rounded-xl border border-[#f4a582]/30 hover:border-[#f4a582]/50 transition-colors"
        >
          {item.number > 0 ? (
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#f4a582] to-[#e8967a] text-sm font-bold text-white shadow-md">
              {item.number}
            </div>
          ) : (
            <CircleDot className="h-5 w-5 text-[#f4a582] flex-shrink-0 mt-1" />
          )}
          <p className="pt-1 text-[#333333] leading-relaxed flex-1">{item.text}</p>
        </div>
      ))}
    </div>
  )
}
