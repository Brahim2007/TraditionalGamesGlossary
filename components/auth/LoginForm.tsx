'use client'

// Login Form Component
// مكون نموذج تسجيل الدخول

import { useState, useTransition, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { login } from '@/lib/actions/auth'
import { Eye, EyeOff, Loader2, Mail, Lock } from 'lucide-react'

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/dashboard'

  const [isPending, startTransition] = useTransition()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [rememberMe, setRememberMe] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Listen for credential fills from LoginCredentials component
  useEffect(() => {
    const handleCredentialFill = (e: CustomEvent) => {
      if (e.detail.email) setEmail(e.detail.email)
      if (e.detail.password) setPassword(e.detail.password)
    }
    
    window.addEventListener('credential-fill' as any, handleCredentialFill as EventListener)
    return () => {
      window.removeEventListener('credential-fill' as any, handleCredentialFill as EventListener)
    }
  }, [])

  async function handleSubmit(formData: FormData) {
    setError(null)
    formData.append('rememberMe', rememberMe.toString())
    formData.append('redirectTo', redirectTo)

    startTransition(async () => {
      const result = await login(formData)

      if (result.success) {
        router.push(redirectTo)
        router.refresh()
      } else {
        setError(result.error || 'حدث خطأ غير متوقع')
      }
    })
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm shadow-sm">
          {error}
        </div>
      )}

      {/* Session expired message */}
      {searchParams.get('expired') && (
        <div className="bg-accent-light/20 border border-accent/30 text-brand-deepest px-4 py-3 rounded-xl text-sm shadow-sm">
          انتهت صلاحية جلستك، يرجى تسجيل الدخول مجدداً
        </div>
      )}

      {/* Email Field */}
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-bold text-brand-deepest">
          البريد الإلكتروني
        </label>
        <div className="relative">
          <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-accent z-10" />
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            disabled={isPending}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pr-10 text-right border-gray-200 bg-gray-50 focus:border-accent focus:ring-accent/20 focus:bg-white transition-all"
            placeholder="example@domain.com"
            dir="ltr"
          />
        </div>
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-bold text-brand-deepest">
          كلمة المرور
        </label>
        <div className="relative">
          <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-accent z-10" />
          <Input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            required
            disabled={isPending}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pr-10 pl-10 text-right border-gray-200 bg-gray-50 focus:border-accent focus:ring-accent/20 focus:bg-white transition-all"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-accent hover:text-accent-dark transition-colors z-10"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Remember Me & Forgot Password */}
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="rounded border-brand-deepest/30 text-accent focus:ring-accent/20 focus:ring-2"
          />
          <span className="text-sm text-brand-deepest font-medium">تذكرني</span>
        </label>
        <a
          href="/forgot-password"
          className="text-sm text-accent hover:text-accent-dark font-medium transition-colors"
        >
          نسيت كلمة المرور؟
        </a>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isPending}
        className="w-full bg-gradient-to-r from-brand-deepest to-brand-deep hover:from-brand-deep hover:to-brand-deepest text-white shadow-lg shadow-brand-deepest/30 transition-all duration-300 font-bold hover:shadow-xl hover:shadow-brand-deepest/40"
      >
        {isPending ? (
          <>
            <Loader2 className="ml-2 h-4 w-4 animate-spin" />
            جارٍ تسجيل الدخول...
          </>
        ) : (
          <>
            <span>تسجيل الدخول</span>
            <span className="mr-2 text-accent-light">→</span>
          </>
        )}
      </Button>
    </form>
  )
}
