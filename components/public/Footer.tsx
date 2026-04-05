'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin, Send } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

const DEFAULT_TAGLINE = 'Foncier Facile Afrique · Expertise foncière & immobilière premium'
const DEFAULT_SOUS_TAGLINE = 'Sécurisation juridique · Vérification documentaire · Accompagnement clé en main'
const DEFAULT_DESCRIPTION = "Votre partenaire de confiance pour l'acquisition de terrains et biens immobiliers juridiquement sécurisés en Afrique de l'Ouest."
const DEFAULT_NEWSLETTER_INTRO = "Recevez nos nouvelles annonces, conseils fonciers et opportunités d'investissement en Afrique de l'Ouest."
const DEFAULT_LINKS_SERVICES = [
  { href: '/services#conseil-foncier', label: 'Conseil foncier' },
  { href: '/services#verification-docs', label: 'Vérification documentaire' },
  { href: '/services#recherche-terrain', label: 'Recherche terrain' },
  { href: '/services#diaspora', label: 'Accompagnement diaspora' },
]
const DEFAULT_LINKS_UTILES = [
  { href: '/catalogue', label: 'Catalogue des biens' },
  { href: '/confier', label: 'Confier mon bien' },
  { href: '/sejour', label: 'Séjour & tourisme' },
  { href: '/regularisation', label: 'Régularisation foncière' },
  { href: '/annonces', label: 'Annonces' },
  { href: '/services', label: 'Nos services' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
  { href: '/mentions-legales', label: 'Mentions légales' },
]

interface FooterProps {
  tagline?: string
  sousTagline?: string
  description?: string
  newsletterIntro?: string
  linksServices?: Array<{ href: string; label: string }>
  linksUtiles?: Array<{ href: string; label: string }>
}

export default function Footer({
  tagline,
  sousTagline,
  description,
  newsletterIntro,
  linksServices,
  linksUtiles,
}: FooterProps = {}) {
  const currentYear = new Date().getFullYear()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (data.success) {
        toast.success(data.message ?? 'Inscription confirmée.')
        setEmail('')
      } else {
        toast.error(data.error ?? 'Email invalide')
      }
    } catch {
      toast.error('Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <footer className="bg-[#1C1C1E] border-t border-[#3A3A3C] text-[#EFEFEF]">
      <div className="w-full border-b border-[rgba(212,168,67,0.4)] bg-[rgba(212,168,67,0.08)]">
        <div className="container-site py-1.5 flex flex-col md:flex-row items-center justify-between gap-1.5 text-xs text-[#EFEFEF]">
          <span className="uppercase tracking-[0.2em] text-[10px] text-[#D4A843]">
            {tagline ?? DEFAULT_TAGLINE}
          </span>
          <span className="text-[#8E8E93]">
            {sousTagline ?? DEFAULT_SOUS_TAGLINE}
          </span>
        </div>
      </div>

      <div className="container-site py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-10 h-10 flex-shrink-0">
                <Image
                  src="/images/logo/logo FFA 1.png"
                  alt="Foncier Facile Afrique"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col justify-center gap-0 leading-tight">
                <p className="font-heading font-bold text-[#EFEFEF] text-sm leading-tight">Foncier Facile</p>
                <p className="text-[#D4A843] text-xs font-semibold leading-tight">Afrique</p>
              </div>
            </div>
            <p className="text-xs leading-snug text-[#8E8E93] mt-2">
              {description ? (
                <span dangerouslySetInnerHTML={{ __html: description }} />
              ) : (
                <>
                  Votre partenaire de confiance pour l&apos;acquisition de terrains et biens immobiliers
                  juridiquement sécurisés en Afrique de l&apos;Ouest.
                </>
              )}
            </p>
            <div className="flex gap-2 mt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-7 h-7 rounded-full bg-[#2C2C2E] flex items-center justify-center hover:bg-[#D4A843] transition-colors"
              >
                <Facebook className="h-3.5 w-3.5 text-[#EFEFEF]" aria-hidden="true" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-7 h-7 rounded-full bg-[#2C2C2E] flex items-center justify-center hover:bg-[#D4A843] transition-colors"
              >
                <Instagram className="h-3.5 w-3.5 text-[#EFEFEF]" aria-hidden="true" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-7 h-7 rounded-full bg-[#2C2C2E] flex items-center justify-center hover:bg-[#D4A843] transition-colors"
              >
                <Linkedin className="h-3.5 w-3.5 text-[#EFEFEF]" aria-hidden="true" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-heading font-bold text-[#D4A843] uppercase tracking-widest text-xs mb-2">Services</h3>
            <ul className="space-y-1 text-xs">
              {(linksServices ?? DEFAULT_LINKS_SERVICES).map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[#8E8E93] hover:text-[#EFEFEF] transition-colors flex items-center gap-1.5"
                  >
                    <span className="text-[#D4A843]">›</span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-bold text-[#D4A843] uppercase tracking-widest text-xs mb-2">Liens utiles</h3>
            <ul className="space-y-1 text-xs">
              {(linksUtiles ?? DEFAULT_LINKS_UTILES).map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[#8E8E93] hover:text-[#EFEFEF] transition-colors flex items-center gap-1.5"
                  >
                    <span className="text-[#D4A843]">›</span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-bold text-[#D4A843] uppercase tracking-widest text-xs mb-2">Contact</h3>
            <ul className="space-y-1.5 text-xs">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-[#D4A843] mt-0.5 flex-shrink-0" aria-hidden="true" />
                <span className="text-[#8E8E93]">Parakou, Bénin — Afrique de l&apos;Ouest</span>
              </li>
              <li>
                <a
                  href="tel:+22996901204"
                  className="flex items-center gap-2.5 text-[#8E8E93] hover:text-[#EFEFEF] transition-colors"
                >
                  <Phone className="h-4 w-4 text-[#D4A843] flex-shrink-0" aria-hidden="true" />
                  +229 96 90 12 04
                </a>
              </li>
              <li>
                <a
                  href="mailto:contact@foncierfacileafrique.fr"
                  className="flex items-center gap-2.5 text-[#8E8E93] hover:text-[#EFEFEF] transition-colors break-all"
                >
                  <Mail className="h-4 w-4 text-[#D4A843] flex-shrink-0" aria-hidden="true" />
                  contact@foncierfacileafrique.fr
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-heading font-bold text-[#D4A843] uppercase tracking-widest text-xs mb-2">
              Newsletter
            </h3>
            <p className="text-xs text-[#8E8E93] mb-2 leading-snug">
              {newsletterIntro ?? DEFAULT_NEWSLETTER_INTRO}
            </p>
            <form onSubmit={handleSubscribe} className="space-y-1.5">
              <div className="flex flex-col sm:flex-row gap-1.5">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Votre email professionnel"
                  required
                  className="bg-[#2C2C2E] border-[#3A3A3C] text-[#EFEFEF] h-9 text-xs"
                  aria-label="Adresse email pour la newsletter"
                />
                <Button
                  type="submit"
                  disabled={loading}
                  size="sm"
                  className="inline-flex items-center gap-1 bg-[#D4A843] hover:bg-[#c2972e] text-[#1C1C1E] px-3 h-9 text-xs"
                >
                  <Send className="h-3.5 w-3.5" aria-hidden="true" />
                  S’abonner
                </Button>
              </div>
              <p className="text-[10px] text-[#636366] leading-tight">
                Aucun spam. 1 à 2 emails par mois, uniquement de la valeur immobilière.
              </p>
            </form>
          </div>
        </div>
      </div>

      <div className="border-t border-[#3A3A3C]">
        <div className="container-site flex flex-col md:flex-row md:flex-wrap md:justify-between md:items-baseline gap-x-6 gap-y-1 py-1 text-xs text-[#636366] leading-tight">
          <p className="m-0 md:shrink-0 leading-tight">&copy; {currentYear} Foncier Facile Afrique. Tous droits réservés.</p>
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 md:justify-end">
            <Link href="/mentions-legales" className="leading-tight hover:text-[#EFEFEF] transition-colors">
              Mentions légales
            </Link>
            <Link
              href="/politique-confidentialite"
              className="leading-tight hover:text-[#EFEFEF] transition-colors"
            >
              Politique de confidentialité
            </Link>
            <span className="leading-tight text-[#636366]">
              Conçu par{' '}
              <a
                href="https://yehiortech.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#D4A843]/90 hover:text-[#D4A843] transition-colors"
              >
                YEHI OR Tech
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
