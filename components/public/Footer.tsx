import Link from 'next/link'
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#111111] border-t-2 border-gold text-text-secondary">
      <div className="container-site py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gold">
                <span className="text-text-inverse font-heading font-bold text-xs">FFA</span>
              </div>
              <div>
                <p className="font-heading font-bold text-white text-sm leading-tight">Foncier Facile</p>
                <p className="text-gold text-xs leading-tight">Afrique</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-text-muted">
              Votre partenaire de confiance pour l&apos;acquisition de terrains et biens immobiliers
              juridiquement sécurisés en Afrique de l&apos;Ouest.
            </p>
            <div className="flex gap-3 mt-5">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-8 h-8 rounded-full bg-bg-surface flex items-center justify-center hover:bg-gold transition-colors">
                <Facebook className="h-4 w-4 text-text-inverse" aria-hidden="true" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-8 h-8 rounded-full bg-bg-surface flex items-center justify-center hover:bg-gold transition-colors">
                <Instagram className="h-4 w-4 text-text-inverse" aria-hidden="true" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="w-8 h-8 rounded-full bg-bg-surface flex items-center justify-center hover:bg-gold transition-colors">
                <Linkedin className="h-4 w-4 text-text-inverse" aria-hidden="true" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-heading font-bold text-gold uppercase tracking-widest text-sm mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: '/services#conseil', label: 'Conseil en achat foncier' },
                { href: '/services#verification', label: 'Vérification documentaire' },
                { href: '/services#courtage', label: 'Courtage immobilier' },
                { href: '/services#investissement', label: 'Investissement locatif' },
                { href: '/simulateur', label: 'Simulateur de budget' },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-text-secondary hover:text-gold transition-colors flex items-center gap-1.5">
                    <span className="text-gold">›</span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-bold text-gold uppercase tracking-widest text-sm mb-4">Liens utiles</h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: '/annonces', label: 'Nos annonces' },
                { href: '/notre-expertise', label: 'Notre expertise' },
                { href: '/blog', label: 'Blog' },
                { href: '/contact', label: 'Contact' },
                { href: '/mentions-legales', label: 'Mentions légales' },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-text-secondary hover:text-gold transition-colors flex items-center gap-1.5">
                    <span className="text-gold">›</span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-bold text-gold uppercase tracking-widest text-sm mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-gold mt-0.5 flex-shrink-0" aria-hidden="true" />
                <span>Parakou, Bénin — Afrique de l&apos;Ouest</span>
              </li>
              <li>
                <a href="tel:+22996901204" className="flex items-center gap-2.5 text-text-secondary hover:text-gold transition-colors">
                  <Phone className="h-4 w-4 text-gold flex-shrink-0" aria-hidden="true" />
                  +229 96 90 12 04
                </a>
              </li>
              <li>
                <a href="mailto:contact@foncierfacileafrique.fr" className="flex items-center gap-2.5 text-text-secondary hover:text-gold transition-colors break-all">
                  <Mail className="h-4 w-4 text-gold flex-shrink-0" aria-hidden="true" />
                  contact@foncierfacileafrique.fr
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-bg-border pt-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-text-muted text-sm">&copy; {currentYear} Foncier Facile Afrique. Tous droits réservés.</p>
          <div className="flex items-center gap-6">
            <Link href="/mentions-legales" className="text-text-muted hover:text-gold text-sm transition-colors">Mentions légales</Link>
            <Link href="/mentions-legales#privacy" className="text-text-muted hover:text-gold text-sm transition-colors">Politique de confidentialité</Link>
            <Link href="#" className="text-text-muted hover:text-gold text-sm transition-colors">CGV</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
