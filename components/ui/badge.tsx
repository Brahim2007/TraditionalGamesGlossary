import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold transition-colors',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-brand-deepest text-white',
        secondary: 'border-transparent bg-accent/10 text-accent-dark',
        outline: 'border-gray-200 bg-white text-gray-700',
        published: 'border-emerald-200 bg-emerald-50 text-emerald-600',
        pending: 'border-amber-200 bg-amber-50 text-amber-600',
        review: 'border-blue-200 bg-blue-50 text-blue-600',
        draft: 'border-gray-200 bg-gray-50 text-gray-600',
        rejected: 'border-red-200 bg-red-50 text-red-600',
        tag: 'border-brand-deepest/10 bg-brand-deepest/5 text-brand-deepest',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
