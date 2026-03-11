'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin, Send } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function Footer() {
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
        <div className="container-site py-3 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-[#EFEFEF]">
          <span className="uppercase tracking-[0.2em] text-[10px] text-[#D4A843]">
            Foncier Facile Afrique · Expertise foncière & immobilière premium
          </span>
          <span className="text-[#8E8E93]">
            Sécurisation juridique · Vérification documentaire · Accompagnement clé en main
          </span>
        </div>
      </div>

      <div className="container-site py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-14 h-14">
                <Image
                  src="/images/logo/logo FFA.png"
                  alt="Foncier Facile Afrique"
                  width={56}
                  height={56}
                  className="object-contain"
                />
              </div>
              <div>
                <p className="font-heading font-bold text-[#EFEFEF] text-sm leading-tight">Foncier Facile</p>
                <p className="text-[#D4A843] text-xs leading-tight">Afrique</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-[#8E8E93] mt-4">
              Votre partenaire de confiance pour l&apos;acquisition de terrains et biens immobiliers
              juridiquement sécurisés en Afrique de l&apos;Ouest.
            </p>
            <div className="flex gap-3 mt-5">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-8 h-8 rounded-full bg-[#2C2C2E] flex items-center justify-center hover:bg-[#D4A843] transition-colors"
              >
                <Facebook className="h-4 w-4 text-[#EFEFEF]" aria-hidden="true" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 rounded-full bg-[#2C2C2E] flex items-center justify-center hover:bg-[#D4A843] transition-colors"
              >
                <Instagram className="h-4 w-4 text-[#EFEFEF]" aria-hidden="true" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-8 h-8 rounded-full bg-[#2C2C2E] flex items-center justify-center hover:bg-[#D4A843] transition-colors"
              >
                <Linkedin className="h-4 w-4 text-[#EFEFEF]" aria-hidden="true" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-heading font-bold text-[#D4A843] uppercase tracking-widest text-sm mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: '/services#conseil', label: 'Conseil en achat foncier' },
                { href: '/services#verification', label: 'Vérification documentaire' },
                { href: '/services#courtage', label: 'Courtage immobilier' },
                { href: '/services#investissement', label: 'Investissement locatif' },
                { href: '/simulateur', label: 'Simulateur de budget' },
              ].map((item) => (
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
            <h3 className="font-heading font-bold text-[#D4A843] uppercase tracking-widest text-sm mb-4">Liens utiles</h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: '/annonces', label: 'Nos annonces' },
                { href: '/notre-expertise', label: 'Notre expertise' },
                { href: '/blog', label: 'Blog' },
                { href: '/contact', label: 'Contact' },
                { href: '/mentions-legales', label: 'Mentions légales' },
              ].map((item) => (
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
            <h3 className="font-heading font-bold text-[#D4A843] uppercase tracking-widest text-sm mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
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
            <h3 className="font-heading font-bold text-[#D4A843] uppercase tracking-widest text-sm mb-4">
              Newsletter
            </h3>
            <p className="text-sm text-[#8E8E93] mb-4">
              Recevez nos nouvelles annonces, conseils fonciers et opportunités d’investissement
              en Afrique de l’Ouest.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Votre email professionnel"
                  required
                  className="bg-[#2C2C2E] border-[#3A3A3C] text-[#EFEFEF]"
                  aria-label="Adresse email pour la newsletter"
                />
                <Button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-1 bg-[#D4A843] hover:bg-[#c2972e] text-[#1C1C1E] px-4"
                >
                  <Send className="h-4 w-4" aria-hidden="true" />
                  S’abonner
                </Button>
              </div>
              <p className="text-[11px] text-[#636366]">
                Aucun spam. 1 à 2 emails par mois, uniquement de la valeur immobilière.
              </p>
            </form>
          </div>
        </div>
      </div>

      <div className="border-t border-[#3A3A3C] pt-6 mt-4 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#636366] pb-6 px-4 md:px-0">
        <p>&copy; {currentYear} Foncier Facile Afrique. Tous droits réservés.</p>
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
          <Link href="/mentions-legales" className="hover:text-[#EFEFEF] transition-colors">
            Mentions légales
          </Link>
          <Link
            href="/politique-confidentialite"
            className="hover:text-[#EFEFEF] transition-colors"
          >
            Politique de confidentialité
          </Link>
          <span className="text-[#636366]">
            Conçu par <a href="https://yehiortech.com" target="_blank" rel="noopener noreferrer" className="text-[#D4A843]/90 hover:text-[#D4A843] transition-colors">YEHI OR Tech</a>
          </span>
        </div>
      </div>
    </footer>
  )
}
