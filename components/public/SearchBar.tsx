'use client'

import React from 'react'
import { Search, Shuffle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onRandomClick?: () => void
  placeholder?: string
}

export function SearchBar({
  value,
  onChange,
  onRandomClick,
  placeholder = 'ابحث عن لعبة، دولة، أو مهارة...',
}: SearchBarProps) {
  return (
    <div className="flex w-full max-w-lg gap-2 rounded-2xl border border-gray-200 bg-surface-subtle p-2 shadow-md">
      <div className="relative flex-1">
        <Input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-14 border-0 bg-transparent pr-12 text-base focus:ring-0"
        />
        <Search className="absolute right-4 top-4 h-6 w-6 text-accent" />
      </div>
      {onRandomClick && (
        <Button
          onClick={onRandomClick}
          variant="default"
          size="icon"
          className="h-14 w-14 rounded-xl"
          title="اكتشف لعبة عشوائية"
        >
          <Shuffle className="h-6 w-6" />
        </Button>
      )}
    </div>
  )
}
