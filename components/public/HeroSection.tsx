'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Play, Pause, Volume2, VolumeX, ChevronLeft, Sparkles, Search } from 'lucide-react'

export interface HeroVideoConfig {
  type: 'local' | 'youtube' | 'cloudinary'
  src: string // مسار الفيديو المحلي أو معرف YouTube أو رابط Cloudinary
  poster?: string // صورة الغلاف
  startTime?: number
  endTime?: number
}

interface HeroSectionProps {
  videos: HeroVideoConfig[] // تغيير من video إلى videos (مصفوفة)
  stats: {
    totalGames: number
    publishedGames: number
    regions: number
    countries: number
  }
  autoSwitchInterval?: number // الفاصل الزمني بالثواني للتبديل التلقائي (افتراضي: 15 ثانية)
}

export function HeroSection({ videos, stats, autoSwitchInterval = 15 }: HeroSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [showControls, setShowControls] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)
  
  const currentVideo = videos[currentVideoIndex]

  // Effect للتبديل التلقائي بين الفيديوهات
  useEffect(() => {
    if (videos.length <= 1) return // لا حاجة للتبديل إذا كان هناك فيديو واحد فقط
    
    const interval = setInterval(() => {
      setFadeOut(true)
      
      setTimeout(() => {
        setCurrentVideoIndex((prev) => (prev + 1) % videos.length)
        setIsVideoLoaded(false)
        setFadeOut(false)
      }, 500) // مدة تأثير الـ fade out
    }, autoSwitchInterval * 1000)
    
    return () => clearInterval(interval)
  }, [videos.length, autoSwitchInterval])

  // Effect لأحداث الفيديو
  useEffect(() => {
    const videoElement = videoRef.current
    if (!videoElement) return

    const handleCanPlay = () => setIsVideoLoaded(true)
    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)

    videoElement.addEventListener('canplay', handleCanPlay)
    videoElement.addEventListener('play', handlePlay)
    videoElement.addEventListener('pause', handlePause)

    return () => {
      videoElement.removeEventListener('canplay', handleCanPlay)
      videoElement.removeEventListener('play', handlePlay)
      videoElement.removeEventListener('pause', handlePause)
    }
  }, [currentVideoIndex])

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const switchToVideo = (index: number) => {
    if (index === currentVideoIndex) return
    
    setFadeOut(true)
    setTimeout(() => {
      setCurrentVideoIndex(index)
      setIsVideoLoaded(false)
      setFadeOut(false)
    }, 500)
  }

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        {currentVideo.type === 'local' ? (
          <>
            <video
              key={currentVideoIndex} // مفتاح للإعادة تحميل الفيديو عند التبديل
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
              poster={currentVideo.poster || '/images/hero-poster.jpg'}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                isVideoLoaded && !fadeOut ? 'opacity-100' : 'opacity-0'
              }`}
              onMouseEnter={() => setShowControls(true)}
              onMouseLeave={() => setShowControls(false)}
            >
              <source src={currentVideo.src} type="video/mp4" />
            </video>

            {/* Video Loading Placeholder */}
            {(!isVideoLoaded || fadeOut) && (
              <div
                className="absolute inset-0 bg-cover bg-center animate-pulse"
                style={{ backgroundImage: `url(${currentVideo.poster || '/images/hero-poster.jpg'})` }}
              />
            )}
          </>
        ) : (
          // Fallback gradient background
          <div className="absolute inset-0 bg-gradient-to-br from-brand-deepest via-brand to-brand-light" />
        )}

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-l from-black/80 via-black/50 to-black/70" />

        {/* Animated Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-accent/20 rounded-full blur-3xl animate-blob" />
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-brand/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute top-1/2 right-1/3 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-blob animation-delay-4000" />
        </div>
      </div>

      {/* Video Controls */}
      {currentVideo.type === 'local' && (
        <div
          className={`absolute bottom-8 left-8 z-20 flex gap-2 transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0'
          }`}
          onMouseEnter={() => setShowControls(true)}
        >
          <button
            onClick={togglePlay}
            className="p-3 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition-colors"
            aria-label={isPlaying ? 'إيقاف مؤقت' : 'تشغيل'}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 text-white" />
            ) : (
              <Play className="w-5 h-5 text-white" />
            )}
          </button>
          <button
            onClick={toggleMute}
            className="p-3 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition-colors"
            aria-label={isMuted ? 'تشغيل الصوت' : 'كتم الصوت'}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-white" />
            ) : (
              <Volume2 className="w-5 h-5 text-white" />
            )}
          </button>
        </div>
      )}

      {/* Video Indicators - مؤشرات الفيديوهات */}
      {videos.length > 1 && (
        <div className="absolute bottom-8 right-8 z-20 flex gap-2">
          {videos.map((_, index) => (
            <button
              key={index}
              onClick={() => switchToVideo(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentVideoIndex
                  ? 'w-8 h-3 bg-accent'
                  : 'w-3 h-3 bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`الانتقال إلى الفيديو ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-6 py-24 w-full">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-3 mb-8 animate-fade-in">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2.5">
                <Sparkles className="w-5 h-5 text-accent animate-pulse" />
                <span className="text-white/90 text-sm font-bold">
                  الأرشيف الرقمي المفتوح للتراث الشعبي
                </span>
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight mb-8 animate-slide-up">
              <span className="text-white block">ذاكرة</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-accent via-yellow-300 to-accent-light">
                الألعاب الشعبية
              </span>
            </h1>

            {/* Description */}
            <p className="text-xl md:text-2xl text-white/80 leading-relaxed mb-10 max-w-2xl animate-slide-up animation-delay-200">
              منصة توثيقية تفاعلية تحفظ قواعد وقيم الألعاب التقليدية في العالم العربي،
              لتبقى جسراً للأجيال القادمة.
            </p>

            {/* Stats Row */}
            <div className="flex flex-wrap gap-6 mb-10 animate-slide-up animation-delay-400">
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-3 border border-white/10">
                <div className="text-3xl font-black text-accent">{stats.totalGames}</div>
                <div className="text-white/70 text-sm font-medium">
                  لعبة موثقة
                  {stats.publishedGames < stats.totalGames && (
                    <span className="block text-xs text-green-400">
                      ({stats.publishedGames} منشورة)
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-3 border border-white/10">
                <div className="text-3xl font-black text-accent">{stats.countries}</div>
                <div className="text-white/70 text-sm font-medium">دولة عربية</div>
              </div>
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-3 border border-white/10">
                <div className="text-3xl font-black text-accent">{stats.regions}</div>
                <div className="text-white/70 text-sm font-medium">إقليم جغرافي</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 animate-slide-up animation-delay-600">
              <Link
                href="/gallery"
                className="group inline-flex items-center gap-3 bg-gradient-to-r from-accent to-accent-dark hover:from-accent-dark hover:to-accent px-8 py-4 rounded-2xl text-lg font-bold text-brand-deepest shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-accent/25"
              >
                <svg className="w-6 h-6 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" />
                </svg>
                استكشف المعرض
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              </Link>

              <Link
                href="#search"
                className="group inline-flex items-center gap-3 bg-white/10 backdrop-blur-md hover:bg-white/20 border-2 border-white/30 px-8 py-4 rounded-2xl text-lg font-bold text-white shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <Search className="w-6 h-6 group-hover:scale-110 transition-transform" />
                ابحث عن لعبة
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce-slow">
        <div className="flex flex-col items-center gap-2 text-white/50">
          <span className="text-xs font-medium">اكتشف المزيد</span>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  )
}
