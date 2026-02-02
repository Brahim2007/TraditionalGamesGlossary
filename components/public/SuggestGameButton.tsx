'use client'

import React, { useState, useEffect } from 'react'
import { Lightbulb, Sparkles } from 'lucide-react'
import { SuggestGameModal } from './SuggestGameModal'
import { cn } from '@/lib/utils'

interface SuggestGameButtonProps {
  variant?: 'floating' | 'cta'
  className?: string
}

export function SuggestGameButton({ variant = 'floating', className }: SuggestGameButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  // استماع للحدث المخصص من Footer أو أي مكان آخر
  useEffect(() => {
    const handleOpenModal = () => setIsModalOpen(true)
    window.addEventListener('openSuggestGameModal', handleOpenModal)
    
    return () => {
      window.removeEventListener('openSuggestGameModal', handleOpenModal)
    }
  }, [])

  if (variant === 'cta') {
    return (
      <>
        <button
          onClick={() => setIsModalOpen(true)}
          className={cn(
            'inline-flex items-center gap-3 bg-accent hover:bg-accent-dark text-brand-deepest px-8 py-4 rounded-2xl font-bold transition-all duration-300 hover:scale-105 shadow-lg',
            className
          )}
        >
          <Lightbulb className="w-6 h-6 text-[#D4AF37]" />
          اقترح لعبة تراثية
          <Sparkles className="w-5 h-5 text-[#D4AF37] animate-pulse" />
        </button>

        <SuggestGameModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </>
    )
  }

  // Floating variant (original)
  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 left-8 z-40 group flex items-center gap-3 rounded-full bg-gradient-to-r from-brand-deepest to-brand px-6 py-4 font-bold text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-3xl md:px-8"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-transform group-hover:rotate-90">
          <Lightbulb className="h-6 w-6 text-[#D4AF37]" />
        </div>
        <span className="hidden md:block">اقترح لعبة</span>
        <Sparkles className="h-5 w-5 text-[#D4AF37] animate-pulse" />
      </button>

      <SuggestGameModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
