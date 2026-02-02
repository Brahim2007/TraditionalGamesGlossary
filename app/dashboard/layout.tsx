// Dashboard Layout with Authentication
// تخطيط لوحة التحكم مع المصادقة

import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { DashboardSidebar } from './DashboardSidebar'
import { DashboardHeader } from './DashboardHeader'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Get current user - redirect to login if not authenticated
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login?redirect=/dashboard')
  }

  return (
    <div className="flex min-h-screen bg-surface-bg">
      {/* Sidebar */}
      <DashboardSidebar user={user} />

      {/* Main Content */}
      <div className="flex-1 lg:mr-64">
        {/* Top Bar */}
        <DashboardHeader user={user} />

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
