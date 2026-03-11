import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-[#D4A843] text-white',
        secondary: 'border-transparent bg-[rgba(212,168,67,0.12)] text-[#D4A843]',
        destructive: 'border-transparent bg-red-100 text-red-800',
        outline: 'border-[#D4A843] text-[#D4A843]',
        gold: 'border-transparent bg-[rgba(212,168,67,0.12)] text-[#D4A843]',
        success: 'border-transparent bg-green-100 text-green-800',
        warning: 'border-transparent bg-orange-100 text-orange-800',
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
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
