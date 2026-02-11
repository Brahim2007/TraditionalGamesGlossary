import { getCurrentUser } from '@/lib/auth'
import Link from 'next/link'
import { LayoutGrid } from 'lucide-react'
import { AuthButtons } from '@/components/public/AuthButtons'
import { Navigation } from './Navigation'

export async function Header() {
  const user = await getCurrentUser()

  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-deepest text-white transition-all duration-300 group-hover:bg-brand group-hover:scale-110">
              <LayoutGrid className="h-6 w-6" />
            </div>
            <div>
              <span className="block font-bold text-lg leading-none tracking-tight text-brand-deepest font-display">
                المسرد التوثيقي
              </span>
              <span className="text-[10px] font-medium text-gray-400 font-display">
                للألعاب التراثية العربية
              </span>
            </div>
          </Link>

          {/* Navigation */}
          <Navigation />

          {/* Auth Buttons */}
          <AuthButtons user={user} />
        </div>
      </div>
    </header>
  )
}
