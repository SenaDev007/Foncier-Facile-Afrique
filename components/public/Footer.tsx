'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin, Send } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { MinimalFooter } from '@/components/ui/minimal-footer'
import DOMPurify from 'isomorphic-dompurify'

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

  const safeDescription = description ? DOMPurify.sanitize(description) : null

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

  const companyLinks = [
    { href: '/mentions-legales', title: 'Mentions légales' },
    { href: '/politique-confidentialite', title: 'Politique de confidentialité' },
    { href: '/contact', title: 'Contact' },
  ]

  const resourceLinks = [...(linksUtiles ?? DEFAULT_LINKS_UTILES), ...(linksServices ?? DEFAULT_LINKS_SERVICES)].map((l) => ({
    href: l.href,
    title: l.label,
  }))

  return (
    <MinimalFooter
      brandTitle="Foncier Facile Afrique"
      brandSubtitle={sousTagline ?? DEFAULT_SOUS_TAGLINE}
      description={
        <div className="space-y-2">
          <p>
            {safeDescription ? (
              <span dangerouslySetInnerHTML={{ __html: safeDescription }} />
            ) : (
              DEFAULT_DESCRIPTION
            )}
          </p>
          <div className="space-y-1 text-xs">
            <p className="inline-flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-[#D4A843]" /> Parakou, Bénin — Afrique de l’Ouest</p>
            <p>
              <a href="tel:+22996901204" className="inline-flex items-center gap-2 hover:text-[#EFEFEF]"><Phone className="h-3.5 w-3.5 text-[#D4A843]" /> +229 96 90 12 04</a>
            </p>
            <p>
              <a href="mailto:contact@foncierfacileafrique.fr" className="inline-flex items-center gap-2 hover:text-[#EFEFEF]"><Mail className="h-3.5 w-3.5 text-[#D4A843]" /> contact@foncierfacileafrique.fr</a>
            </p>
          </div>
        </div>
      }
      resources={[]}
      company={[]}
      socialLinks={[
        { icon: <Facebook className="size-4" />, link: 'https://facebook.com', label: 'Facebook' },
        { icon: <Instagram className="size-4" />, link: 'https://instagram.com', label: 'Instagram' },
        { icon: <Linkedin className="size-4" />, link: 'https://linkedin.com', label: 'LinkedIn' },
      ]}
      logo={
        <Image
          src="/images/logo/logo FFA.png"
          alt="Foncier Facile Afrique"
          width={34}
          height={34}
          className="object-contain"
        />
      }
      newsletter={undefined}
      bottomText={
        <>
          &copy; {currentYear} Foncier Facile Afrique. Tous droits réservés. Conçu par{' '}
          <a
            href="https://yehiortech.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#D4A843]/90 hover:text-[#D4A843]"
          >
            YEHI OR Tech
          </a>
          .
        </>
      }
    />
  )
}
