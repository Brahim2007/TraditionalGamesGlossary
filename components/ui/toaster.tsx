// Toast notification component
'use client'

import React from 'react'
import { CheckCircle2, XCircle, X } from 'lucide-react'
import { Toast } from '@/hooks/use-toast'

interface ToasterProps {
  toasts: Toast[]
  onDismiss: (id: string) => void
}

export function Toaster({ toasts, onDismiss }: ToasterProps) {
  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            animate-in slide-in-from-right duration-300
            flex items-start gap-3 p-4 rounded-lg shadow-lg border-2
            ${
              toast.variant === 'destructive'
                ? 'bg-red-50 border-red-200 text-red-900'
                : 'bg-green-50 border-green-200 text-green-900'
            }
          `}
        >
          {toast.variant === 'destructive' ? (
            <XCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
          )}
          <div className="flex-1">
            <div className="font-semibold">{toast.title}</div>
            {toast.description && (
              <div className="text-sm mt-1 opacity-90">{toast.description}</div>
            )}
          </div>
          <button
            onClick={() => onDismiss(toast.id)}
            className="flex-shrink-0 hover:opacity-70 transition-opacity"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
