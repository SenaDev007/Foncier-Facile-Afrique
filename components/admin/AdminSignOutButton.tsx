'use client'

import { signOut } from 'next-auth/react'
import { LogOut } from 'lucide-react'

type Props = {
  variant?: 'sidebar' | 'header'
  className?: string
  children?: React.ReactNode
}

/**
 * Déconnexion compatible NextAuth v5 (CSRF via fetch interne).
 * Les formulaires HTML POST vers /api/auth/signout ne fonctionnent pas sans jeton CSRF.
 */
export function AdminSignOutButton({ variant = 'header', className, children }: Props) {
  const handleSignOut = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    void signOut({ callbackUrl: `${origin}/admin/login` })
  }

  if (variant === 'sidebar') {
    return (
      <button
        type="button"
        onClick={handleSignOut}
        className={
          className ??
          'flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-[#8E8E93] hover:text-red-400 hover:bg-red-400/10 transition-colors'
        }
      >
        <LogOut className="h-4 w-4" aria-hidden="true" />
        {children ?? 'Déconnexion'}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className={
        className ??
        'px-3 py-1.5 border border-[#3A3A3C] text-[#8E8E93] text-sm rounded-lg hover:bg-[#3A3A3C] transition-colors'
      }
    >
      {children ?? 'Déconnexion'}
    </button>
  )
}
