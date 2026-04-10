'use client'

import { usePathname } from 'next/navigation'
import { Header2 } from '@/components/ui/header-2'

const navLinks = [
  { href: '/', label: 'Accueil' },
  { href: '/catalogue', label: 'Catalogue' },
  { href: '/confier', label: 'Confier' },
  { href: '/sejour', label: 'Séjour' },
  { href: '/regularisation', label: 'Régularisation' },
  { href: '/services', label: 'Services' },
  { href: '/blog', label: 'Blog' },
  { href: '/ebooks', label: 'Boutique' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const pathname = usePathname()
  return <Header2 links={navLinks} pathname={pathname} />
}
