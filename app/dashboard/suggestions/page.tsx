import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { getAllSuggestions, getSuggestionsStats } from '@/lib/actions/suggestion'
import { SuggestionsClient } from './SuggestionsClient'

export const metadata: Metadata = {
  title: 'مقترحات الألعاب | لوحة التحكم',
  description: 'مراجعة مقترحات الألعاب من المستخدمين',
}

export default async function SuggestionsPage() {
  // Check authentication and authorization
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  // Only admins and reviewers can view suggestions
  if (user.role !== 'admin' && user.role !== 'reviewer') {
    redirect('/dashboard')
  }

  // Fetch suggestions and stats
  const [suggestionsResult, statsResult] = await Promise.all([
    getAllSuggestions(),
    getSuggestionsStats(),
  ])

  const suggestions = suggestionsResult.suggestions || []
  const stats = statsResult.stats || {
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    converted: 0,
  }

  return <SuggestionsClient suggestions={suggestions} stats={stats} userRole={user.role} />
}
