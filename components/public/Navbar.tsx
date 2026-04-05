'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X, LayoutDashboard } from 'lucide-react'
import { cn } from '@/lib/utils'

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
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 16)
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
          'sticky top-0 z-50 w-full transition-all duration-300',
          isScrolled
            ? 'bg-[#1C1C1E]/95 backdrop-blur-md border-b border-[#3A3A3C] shadow-lg shadow-black/20'
            : 'bg-[#1C1C1E] border-b border-[#2C2C2E]'
        )}
      >
        <div className="container-site flex items-center justify-between h-[72px]">
          <Link
            href="/"
            className="flex items-center gap-3 flex-shrink-0"
            aria-label="Foncier Facile Afrique — Accueil"
          >
            <div className="relative w-14 h-14 flex items-center justify-center flex-shrink-0">
              <Image
                src="/images/logo/logo FFA 1.png"
                alt=""
                width={56}
                height={56}
                className="object-contain"
              />
            </div>
            <div className="hidden sm:flex flex-col justify-center gap-0 leading-tight">
              <span className="font-heading font-bold text-[#EFEFEF] text-lg tracking-tight block">
                Foncier Facile
              </span>
              <span className="text-[#D4A843] text-xs font-semibold tracking-widest uppercase">
                Afrique
              </span>
            </div>
          </Link>

          <nav
            className="hidden lg:flex flex-wrap items-center justify-end gap-0 max-w-[58%] xl:max-w-[65%]"
            aria-label="Navigation principale"
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-2.5 py-2 rounded-lg text-xs font-medium transition-colors',
                    isActive
                      ? 'text-[#D4A843] bg-[rgba(212,168,67,0.1)]'
                      : 'text-[#8E8E93] hover:text-[#EFEFEF] hover:bg-[#2C2C2E]'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="hidden md:inline-flex items-center gap-2 text-[#8E8E93] hover:text-[#D4A843] text-sm font-medium transition-colors"
              aria-label="Accéder au backoffice"
            >
              <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
              <span>Backoffice</span>
            </Link>
            <Link
              href="/contact"
              className="hidden md:inline-flex items-center justify-center bg-[#D4A843] text-[#1C1C1E] text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-[#B8912E] transition-colors shadow-lg shadow-[#D4A843]/20"
            >
              Nous contacter
            </Link>
            <button
              className="lg:hidden p-2.5 rounded-lg text-[#8E8E93] hover:text-[#EFEFEF] hover:bg-[#2C2C2E] transition-colors"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={isOpen}
            >
              {isOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </header>

      {isOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <nav
            className="absolute top-0 right-0 w-full max-w-sm h-full bg-[#1C1C1E] border-l border-[#3A3A3C] shadow-2xl p-6 pt-24 flex flex-col gap-1"
            onClick={(e) => e.stopPropagation()}
            aria-label="Navigation mobile"
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-4 py-3.5 rounded-xl text-sm font-medium transition-colors',
                    isActive
                      ? 'text-[#D4A843] bg-[rgba(212,168,67,0.12)]'
                      : 'text-[#EFEFEF] hover:bg-[#2C2C2E]'
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
            <div className="mt-4 pt-4 border-t border-[#3A3A3C] flex flex-col gap-2">
              <Link
                href="/admin"
                className="px-4 py-3 text-sm text-[#8E8E93] hover:text-[#D4A843] transition-colors flex items-center gap-2"
              >
                <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
                Backoffice
              </Link>
              <Link
                href="/contact"
                className="px-4 py-3.5 bg-[#D4A843] text-[#1C1C1E] text-sm font-semibold rounded-xl text-center hover:bg-[#B8912E] transition-colors"
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
