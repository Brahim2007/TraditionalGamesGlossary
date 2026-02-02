// Login Page
// صفحة تسجيل الدخول

import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { LoginForm } from '@/components/auth/LoginForm'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Gamepad2 } from 'lucide-react'
import { LoginCredentials } from '@/components/auth/LoginCredentials'

export default async function LoginPage() {
  // Redirect to dashboard if already logged in
  const user = await getCurrentUser()
  if (user) {
    redirect('/dashboard')
  }

  return (
    <Card className="shadow-2xl border border-gray-100 bg-surface-DEFAULT backdrop-blur-sm">
      <CardHeader className="text-center pb-2">
        {/* Logo with green and gold theme - matching dashboard style */}
        <div className="mx-auto w-20 h-20 bg-gradient-to-br from-brand-deepest to-brand-deep rounded-full flex items-center justify-center mb-4 shadow-lg ring-4 ring-accent/20 hover:ring-accent/30 transition-all">
          <Gamepad2 className="w-10 h-10 text-accent-light" />
        </div>

        <CardTitle className="text-3xl font-bold text-brand-deepest mb-2">
          معجم الألعاب التراثية
        </CardTitle>
        <p className="text-brand-light mt-2">
          سجّل دخولك للوصول إلى لوحة التحكم
        </p>
      </CardHeader>

      <CardContent className="pt-4">
        <div id="login-form">
          <Suspense fallback={<div className="h-64 animate-pulse bg-gray-100 rounded-xl" />}>
            <LoginForm />
          </Suspense>
        </div>

        {/* Demo Credentials */}
        <LoginCredentials />
      </CardContent>

      {/* Footer */}
      <div className="px-6 pb-6 text-center">
        <p className="text-xs text-brand-light">
          أرشيف رقمي للألعاب الشعبية العربية
        </p>
      </div>
    </Card>
  )
}
