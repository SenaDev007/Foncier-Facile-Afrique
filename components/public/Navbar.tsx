'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Phone } from 'lucide-react'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/', label: 'Accueil' },
  { href: '/services', label: 'Services' },
  { href: '/annonces', label: 'Annonces' },
  { href: '/notre-expertise', label: 'Notre expertise' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-50 w-full bg-bg border-b border-bg-border transition-shadow duration-300',
          isScrolled ? 'shadow-md' : 'shadow-sm'
        )}
      >
        <div className="container-site flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0" aria-label="Foncier Facile Afrique — Accueil">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gold">
              <span className="text-text-inverse font-heading font-bold text-sm">FFA</span>
            </div>
            <div className="hidden sm:block">
              <p className="font-heading font-bold text-text-primary text-base leading-tight">Foncier Facile</p>
              <p className="text-gold text-xs font-semibold leading-tight">Afrique</p>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1" aria-label="Navigation principale">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  pathname === link.href
                    ? 'text-gold border-b-2 border-gold'
                    : 'text-text-secondary hover:text-gold hover:bg-gold-light'
                )}
                aria-current={pathname === link.href ? 'page' : undefined}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/login"
              className="text-xs text-text-muted hover:text-gold transition-colors"
              aria-label="Accès admin"
            >
              Admin
            </Link>
            <a
              href="tel:+22996901204"
              className="hidden md:flex items-center gap-2 text-text-secondary text-sm hover:text-gold transition-colors"
              aria-label="Appeler Foncier Facile Afrique"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              <span>+229 96 90 12 04</span>
            </a>
            <Link
              href="/contact"
              className="hidden md:inline-flex items-center justify-center bg-gold text-text-inverse text-sm font-medium px-4 py-2 rounded-lg hover:bg-gold-dark transition-colors"
            >
              Nous contacter
            </Link>
            <button
              className="lg:hidden p-2 rounded-md text-text-secondary hover:text-gold hover:bg-gold-light transition-colors"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </header>

      {isOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setIsOpen(false)}>
          <div className="absolute inset-0 bg-black/30" />
          <nav
            className="absolute top-16 left-0 right-0 bg-bg border border-bg-border shadow-xl p-4 flex flex-col gap-1"
            onClick={(e) => e.stopPropagation()}
            aria-label="Navigation mobile"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                  pathname === link.href
                    ? 'text-gold bg-gold-light font-semibold border-l-2 border-gold'
                    : 'text-text-secondary hover:text-gold hover:bg-gold-light'
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 pt-2 border-t border-bg-border flex flex-col gap-2">
              <Link
                href="/admin/login"
                className="px-4 py-3 text-xs text-text-muted hover:text-gold transition-colors"
              >
                Admin
              </Link>
              <a href="tel:+22996901204" className="flex items-center gap-2 px-4 py-3 text-text-secondary text-sm">
                <Phone className="h-4 w-4" aria-hidden="true" />
                +229 96 90 12 04
              </a>
              <Link
                href="/contact"
                className="bg-gold text-text-inverse text-sm font-medium px-4 py-3 rounded-lg text-center hover:bg-gold-dark transition-colors"
              >
                Nous contacter
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  )
}
