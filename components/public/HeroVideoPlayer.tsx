'use client'

import { useEffect, useRef, useState } from 'react'

export interface VideoClip {
  videoId: string
  startTime: number
  endTime: number
  title?: string
}

interface HeroVideoPlayerProps {
  clips: VideoClip[]
}

export function HeroVideoPlayer({ clips }: HeroVideoPlayerProps) {
  const [currentClipIndex, setCurrentClipIndex] = useState(0)
  const [isReady, setIsReady] = useState(false)
  const playerRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // تحميل YouTube IFrame API
    if (!(window as any).YT) {
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      const firstScriptTag = document.getElementsByTagName('script')[0]
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)
    }

    // إعداد المشغل عند جاهزية API
    ;(window as any).onYouTubeIframeAPIReady = () => {
      setIsReady(true)
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy()
      }
    }
  }, [])

  useEffect(() => {
    if (!isReady || clips.length === 0 || !containerRef.current) return

    const currentClip = clips[currentClipIndex]

    // إنشاء أو تحديث المشغل
    if (!playerRef.current) {
      playerRef.current = new (window as any).YT.Player('hero-video-player', {
        videoId: currentClip.videoId,
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          showinfo: 0,
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
          enablejsapi: 1,
          start: currentClip.startTime,
          end: currentClip.endTime,
          loop: 0,
          vq: 'hd1080'
        },
        events: {
          onReady: (event: any) => {
            event.target.playVideo()
          },
          onStateChange: (event: any) => {
            // عند انتهاء المقطع الحالي
            if (event.data === (window as any).YT.PlayerState.ENDED) {
              // الانتقال للمقطع التالي
              const nextIndex = (currentClipIndex + 1) % clips.length
              setCurrentClipIndex(nextIndex)
            }
          }
        }
      })
    } else {
      // تحميل المقطع التالي
      playerRef.current.loadVideoById({
        videoId: currentClip.videoId,
        startSeconds: currentClip.startTime,
        endSeconds: currentClip.endTime
      })
    }
  }, [isReady, currentClipIndex, clips])

  if (clips.length === 0) {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-brand to-brand-deepest" />
    )
  }

  return (
    <div ref={containerRef} className="relative w-full bg-gradient-to-br from-brand-deepest via-brand to-brand-light overflow-hidden">
      {/* خلفية متحركة */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-accent rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-accent-dark rounded-full blur-3xl animate-blob animation-delay-4000" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* النص الإعلاني - على اليسار */}
          <div className="order-2 lg:order-1 space-y-8 animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center gap-3 rounded-full bg-white/20 backdrop-blur-lg border-2 border-white/40 px-6 py-3 text-sm font-bold text-white shadow-2xl animate-slide-up">
              <svg className="w-5 h-5 text-accent animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="drop-shadow-lg">الأرشيف الرقمي المفتوح للتراث الشعبي</span>
            </div>

            {/* العنوان الرئيسي */}
            <h1 className="text-5xl md:text-7xl font-black leading-tight text-white animate-slide-up animation-delay-200 drop-shadow-2xl">
              ذاكرة <span className="text-transparent bg-clip-text bg-gradient-to-l from-accent via-yellow-400 to-accent-dark animate-shimmer" style={{textShadow: '0 0 40px rgba(171, 159, 128, 0.5)'}}>الألعاب الشعبية</span>
            </h1>

            {/* الوصف */}
            <p className="text-xl md:text-2xl font-semibold leading-relaxed text-white/95 drop-shadow-lg animate-slide-up animation-delay-400">
              منصة توثيقية تفاعلية تحفظ قواعد وقيم الألعاب التقليدية في العالم العربي، 
              لتبقى جسراً للأجيال القادمة.
            </p>

            {/* أزرار الإجراءات */}
            <div className="flex flex-wrap gap-4 animate-slide-up animation-delay-600">
              <a
                href="/gallery"
                className="group inline-flex items-center gap-3 bg-gradient-to-r from-accent to-accent-dark hover:from-accent-dark hover:to-accent px-8 py-4 rounded-2xl text-lg font-bold text-brand-deepest shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105"
              >
                <svg className="w-6 h-6 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" />
                </svg>
                استكشف المعرض
                <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </a>
              
              <a
                href="#search"
                className="group inline-flex items-center gap-3 bg-white/10 backdrop-blur-md hover:bg-white/20 border-2 border-white/30 px-8 py-4 rounded-2xl text-lg font-bold text-white shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                ابحث عن لعبة
              </a>
            </div>
          </div>

          {/* الفيديو داخل شكل الاقتباس - على اليمين */}
          <div className="order-1 lg:order-2 relative animate-slide-in-right">
            {/* شكل رمز الاقتباس الخارجي */}
            <div className="relative">
              {/* علامة الاقتباس العلوية */}
              <div className="absolute -top-8 -right-8 text-accent/30 animate-float z-0">
                <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 100 100">
                  <path d="M20,45 Q20,20 40,20 Q35,35 35,45 Q35,55 25,55 Q15,55 15,45 Q15,35 20,35 Z M60,45 Q60,20 80,20 Q75,35 75,45 Q75,55 65,55 Q55,55 55,45 Q55,35 60,35 Z" />
                </svg>
              </div>

              {/* علامة الاقتباس السفلية */}
              <div className="absolute -bottom-8 -left-8 text-accent/30 animate-float animation-delay-2000 z-0" style={{transform: 'rotate(180deg)'}}>
                <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 100 100">
                  <path d="M20,45 Q20,20 40,20 Q35,35 35,45 Q35,55 25,55 Q15,55 15,45 Q15,35 20,35 Z M60,45 Q60,20 80,20 Q75,35 75,45 Q75,55 65,55 Q55,55 55,45 Q55,35 60,35 Z" />
                </svg>
              </div>

              {/* إطار الفيديو مع حركة مستمرة */}
              <div className="relative group">
                {/* الإطار الخارجي المتحرك */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent via-accent-dark to-accent rounded-3xl animate-spin-slow opacity-75 blur-xl" />
                
                {/* الإطار الداخلي */}
                <div className="relative bg-white/10 backdrop-blur-md rounded-3xl p-2 border-4 border-white/30 shadow-2xl overflow-hidden">
                  {/* حدود متحركة */}
                  <div className="absolute inset-0 rounded-3xl overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent animate-shimmer-border" />
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent animate-shimmer-border animation-delay-1000" />
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-accent to-transparent animate-shimmer-border-vertical" />
                    <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-transparent via-accent to-transparent animate-shimmer-border-vertical animation-delay-1000" />
                  </div>

                  {/* حاوية الفيديو */}
                  <div className="relative rounded-2xl overflow-hidden aspect-video bg-black/50">
                    {/* YouTube Player */}
                    <div 
                      id="hero-video-player"
                      className="absolute inset-0 w-full h-full"
                    />
                    
                    {/* Overlay خفيف */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/20 pointer-events-none" />
                  </div>

                  {/* شريط معلومات متحرك */}
                  <div className="mt-3 px-4 py-2 bg-white/5 backdrop-blur rounded-xl border border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      <span className="text-white/90 text-sm font-bold">مقاطع من الألعاب التراثية</span>
                      <div className="flex-1" />
                      <div className="flex gap-1">
                        {clips.map((_, index) => (
                          <div
                            key={index}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                              index === currentClipIndex 
                                ? 'bg-accent w-8' 
                                : 'bg-white/30'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* تأثيرات ضوئية متحركة */}
                <div className="absolute -inset-4 bg-gradient-to-r from-accent/20 via-transparent to-accent/20 rounded-full blur-2xl animate-pulse-slow pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
