'use client'

import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import PublicReviewForm from '@/components/public/PublicReviewForm'

type Props = {
  triggerVariant?: 'link' | 'button'
  triggerClassName?: string
}

export function PublicReviewModal({ triggerVariant = 'link', triggerClassName }: Props) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const syncFromHash = () => {
      if (window.location.hash === '#donner-avis') {
        setOpen(true)
        window.history.replaceState(null, '', window.location.pathname + window.location.search)
      }
    }
    syncFromHash()
    window.addEventListener('hashchange', syncFromHash)
    return () => window.removeEventListener('hashchange', syncFromHash)
  }, [])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerVariant === 'button' ? (
          <Button type="button" size="lg" className={cn('rounded-full', triggerClassName)}>
            Donner mon avis
          </Button>
        ) : (
          <button
            type="button"
            className={cn(
              'inline-flex items-center gap-1.5 text-sm font-medium text-[#D4A843] hover:text-[#E8B84B] hover:underline',
              triggerClassName,
            )}
          >
            Donner mon avis
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[min(90vh,720px)] overflow-y-auto border-[#3A3A3C] bg-[#2C2C2E] p-6 text-[#EFEFEF] sm:max-w-lg [&>button]:text-[#EFEFEF] [&>button]:hover:text-[#D4A843]">
        <DialogHeader className="text-left">
          <DialogTitle className="font-heading text-xl text-[#EFEFEF] sm:text-2xl">
            Donner votre avis
          </DialogTitle>
          <DialogDescription className="text-[#8E8E93] text-sm">
            Vous avez travaillé avec Foncier Facile Afrique ? Partagez votre expérience. Les avis sont relus avant
            publication sur cette page.
          </DialogDescription>
        </DialogHeader>
        <PublicReviewForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
