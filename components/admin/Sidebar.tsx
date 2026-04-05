'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { AdminSignOutButton } from '@/components/admin/AdminSignOutButton'
import {
  LayoutDashboard, Home, FileText, Users, MessageSquare,
  Star, Settings, ChevronRight, Briefcase, BookOpen, ShoppingCart, BarChart3, FileCode,
  BedDouble, CalendarDays, FolderOpen, KeyRound,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type NavItem = {
  href: string
  label: string
  icon: typeof LayoutDashboard
  exact?: boolean
  /** Rôles qui ne voient pas cette entrée (ex. éditeurs = contenu, pas le catalogue annonces). */
  excludeRoles?: readonly string[]
}

const navItems: NavItem[] = [
  { href: '/admin', label: 'Tableau de bord', icon: LayoutDashboard, exact: true },
  { href: '/admin/annonces', label: 'Annonces', icon: Home, excludeRoles: ['EDITEUR'] },
  { href: '/admin/logements', label: 'Logements séjour', icon: BedDouble, excludeRoles: ['EDITEUR'] },
  { href: '/admin/reservations', label: 'Réservations', icon: CalendarDays, excludeRoles: ['EDITEUR'] },
  { href: '/admin/dossiers', label: 'Dossiers fonciers', icon: FolderOpen, excludeRoles: ['EDITEUR'] },
  { href: '/admin/blog', label: 'Blog', icon: FileText },
  { href: '/admin/services', label: 'Services', icon: Briefcase },
  { href: '/admin/ebooks', label: 'Ebooks', icon: BookOpen, exact: true },
  { href: '/admin/ebooks/commandes', label: 'Commandes ebooks', icon: ShoppingCart },
  { href: '/admin/ebooks/stats', label: 'Stats ebooks', icon: BarChart3 },
  { href: '/admin/leads', label: 'Leads', icon: Users },
  { href: '/admin/messages', label: 'Messages', icon: MessageSquare },
  { href: '/admin/temoignages', label: 'Témoignages', icon: Star },
  { href: '/admin/utilisateurs', label: 'Utilisateurs', icon: Users },
  { href: '/admin/compte', label: 'Mon compte', icon: KeyRound },
  { href: '/admin/parametres', label: 'Paramètres', icon: Settings },
  { href: '/admin/contenus', label: 'Contenus des pages', icon: FileCode },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const role = session?.user?.role

  const visibleItems = navItems.filter((item) => {
    if (!item.excludeRoles?.length) return true
    if (!role) return true
    return !item.excludeRoles.includes(role)
  })

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <aside className="w-64 flex-shrink-0 bg-[#1C1C1E] border-r border-[#3A3A3C] flex flex-col h-screen sticky top-0 overflow-y-auto">
      <div className="p-5 border-b border-[#3A3A3C]">
        <Link href="/" className="flex items-center gap-3" aria-label="Retour au site">
          <div className="relative w-12 h-12 flex-shrink-0">
            <Image
              src="/images/logo/logo FFA 1.png"
              alt="Logo FFA"
              width={48}
              height={48}
              className="object-contain"
              sizes="48px"
              priority
            />
          </div>
          <div className="flex flex-col justify-center min-w-0">
            <p className="font-heading font-bold text-[#EFEFEF] text-sm leading-tight">Foncier Facile</p>
            <p className="text-[#D4A843] text-xs font-medium leading-tight">Afrique · Back-office</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1" aria-label="Navigation admin">
        {visibleItems.map((item) => {
          const active = isActive(item.href, item.exact)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                active
                  ? 'text-[#D4A843] bg-[rgba(212,168,67,0.1)] border-l-2 border-[#D4A843]'
                  : 'text-[#8E8E93] hover:text-[#EFEFEF] hover:bg-[#2C2C2E]'
              )}
              aria-current={active ? 'page' : undefined}
            >
              <div className="flex items-center gap-2.5">
                <item.icon className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                {item.label}
              </div>
              {active && <ChevronRight className="h-3.5 w-3.5 text-[#D4A843] opacity-80" aria-hidden="true" />}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-[#3A3A3C] space-y-2">
        <AdminSignOutButton variant="sidebar" />
        <p className="text-[10px] text-[#636366] px-3 pt-2 border-t border-[#2C2C2E]">
          Conçu par <span className="text-[#D4A843]/80">YEHI OR Tech</span>
        </p>
      </div>
    </aside>
  )
}
