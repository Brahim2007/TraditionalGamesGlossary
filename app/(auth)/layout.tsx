// Auth Pages Layout
// تخطيط صفحات المصادقة

import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'تسجيل الدخول | معجم الألعاب التراثية العربية',
  description: 'تسجيل الدخول إلى لوحة تحكم معجم الألعاب التراثية العربية',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-bg via-surface-subtle to-surface-bg flex items-center justify-center p-4">
      {/* Decorative pattern overlay - matching dashboard style */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #061D14 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>
      {/* Subtle brand gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-deepest/5 via-transparent to-accent/5" />
      {/* Gold accent subtle overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-accent/3 via-transparent to-transparent" />
      <div className="relative w-full max-w-md z-10">
        {children}
      </div>
    </div>
  )
}
