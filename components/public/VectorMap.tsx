'use client'

import React from 'react'

interface VectorMapProps {
  x?: number
  y?: number
  countryName: string
}

export function VectorMap({ x = 100, y = 100, countryName }: VectorMapProps) {
  // Generate map path based on country
  const getMapPath = (name: string): string => {
    if (name.includes('قطر'))
      return 'M100,190 C95,170 90,150 85,130 C80,110 85,90 95,80 C100,75 110,75 115,80 C125,90 130,110 125,130 C120,150 115,170 115,190 L100,190 Z'
    if (name.includes('الإمارات'))
      return 'M40,120 L60,115 L80,110 L120,100 C140,90 160,80 170,90 L160,120 L140,140 L100,145 L60,140 Z'
    if (name.includes('العراق'))
      return 'M80,160 L60,120 L50,80 L70,50 L110,40 L140,60 L130,110 L100,160 Z'
    if (name.includes('الكويت'))
      return 'M90,110 L100,95 L115,95 L125,105 L115,120 L100,120 Z'
    if (name.includes('السعودية'))
      return 'M50,200 L30,150 L40,100 L60,70 L100,50 L150,60 L180,100 L170,150 L130,180 L80,190 Z'
    // Default Arab world silhouette
    return 'M60 20 L60 40 L40 50 L30 80 L20 90 L20 120 L40 140 L60 160 L120 170 L160 160 L180 140 L170 110 L150 90 L140 60 L120 40 L100 30 Z'
  }

  const pathD = getMapPath(countryName)

  return (
    <div className="map-container relative h-full w-full overflow-hidden rounded-xl border border-gray-100 bg-surface-subtle">
      {/* Dot pattern overlay */}
      <div className="bg-dots absolute inset-0 opacity-[0.05]" />

      <svg
        viewBox="0 0 200 200"
        className="h-full w-full text-gray-300"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow
              dx="2"
              dy="2"
              stdDeviation="2"
              floodColor="#2d4a3e"
              floodOpacity="0.1"
            />
          </filter>
        </defs>

        {/* Country shape */}
        <path
          d={pathD}
          className="fill-white stroke-brand-light stroke-[1.5] transition-all duration-500 hover:fill-surface-muted"
          style={{ filter: 'url(#shadow)' }}
        />

        {/* Location marker */}
        <g className="animate-in fade-in zoom-in duration-500">
          {/* Ping animation */}
          <circle
            cx={x}
            cy={y}
            r="12"
            className="fill-accent/20 animate-ping"
          />
          {/* Outer circle */}
          <circle
            cx={x}
            cy={y}
            r="5"
            className="fill-accent stroke-white stroke-2"
          />
          {/* Inner circle */}
          <circle cx={x} cy={y} r="2" className="fill-amber-600" />
        </g>
      </svg>
    </div>
  )
}
