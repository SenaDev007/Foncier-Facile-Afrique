'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  LayoutDashboard, Home, FileText, Users, MessageSquare,
  Star, Settings, LogOut, ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/admin', label: 'Tableau de bord', icon: LayoutDashboard, exact: true },
  { href: '/admin/annonces', label: 'Annonces', icon: Home },
  { href: '/admin/blog', label: 'Blog', icon: FileText },
  { href: '/admin/leads', label: 'Leads', icon: Users },
  { href: '/admin/messages', label: 'Messages', icon: MessageSquare },
  { href: '/admin/temoignages', label: 'Témoignages', icon: Star },
  { href: '/admin/utilisateurs', label: 'Utilisateurs', icon: Users },
  { href: '/admin/parametres', label: 'Paramètres', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <aside className="w-64 flex-shrink-0 bg-[#111111] border-r border-bg-border text-text-secondary flex flex-col h-screen sticky top-0 overflow-y-auto">
      <div className="p-5 border-b border-bg-border">
        <Link href="/" className="flex items-center gap-2" aria-label="Retour au site">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gold">
            <span className="text-text-inverse font-heading font-bold text-xs">FFA</span>
          </div>
          <div>
            <p className="font-heading font-bold text-white text-sm leading-tight">Foncier Facile</p>
            <p className="text-gold text-xs leading-tight">Back-office</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1" aria-label="Navigation admin">
        {navItems.map((item) => {
          const active = isActive(item.href, item.exact)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group',
                active
                  ? 'text-gold bg-bg-surface border-l-2 border-gold'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-surface'
              )}
              aria-current={active ? 'page' : undefined}
            >
              <div className="flex items-center gap-2.5">
                <item.icon className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                {item.label}
              </div>
              {active && <ChevronRight className="h-3.5 w-3.5 opacity-70" aria-hidden="true" />}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-bg-border">
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:text-red-400 hover:bg-red-400/10 transition-colors"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Déconnexion
        </button>
      </div>
    </aside>
  )
}
