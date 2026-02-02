import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { getCategories } from '@/lib/actions/category'
import { CategoriesClient } from './CategoriesClient'

export const metadata: Metadata = {
  title: 'إدارة التصنيفات | لوحة التحكم',
  description: 'إدارة تصنيفات الألعاب التراثية',
}

export default async function CategoriesPage() {
  // Check authentication and authorization
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  // Only admins and reviewers can manage categories
  if (user.role !== 'admin' && user.role !== 'reviewer') {
    redirect('/dashboard')
  }

  // Fetch categories
  const result = await getCategories()
  const categories = result.categories || []

  return <CategoriesClient categories={categories} userRole={user.role} />
}
