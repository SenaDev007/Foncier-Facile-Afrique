'use client'

import { usePathname } from 'next/navigation'
import { Header2 } from '@/components/ui/header-2'

const navLinks = [
  { href: '/', label: 'Accueil' },
  {
    label: 'Nos Biens',
    sublinks: [
      { href: '/catalogue', label: 'Catalogue' },
      { href: '/confier', label: 'Confier mon bien' },
      { href: '/sejour', label: 'Séjour' },
    ],
  },
  {
    label: 'Services',
    sublinks: [
      { href: '/services', label: 'Nos services' },
      { href: '/regularisation', label: 'Régularisation' },
    ],
  },
  {
    label: 'Ressources',
    sublinks: [
      { href: '/blog', label: 'Blog & Conseils' },
      { href: '/ebooks', label: 'Boutique' },
    ],
  },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const pathname = usePathname()
  return <Header2 links={navLinks} pathname={pathname} />
}
