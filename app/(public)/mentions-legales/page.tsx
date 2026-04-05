import type { Metadata } from 'next'
import { publicPageMetadata } from '@/lib/seo'

export const metadata: Metadata = publicPageMetadata({
  title: 'Mentions légales',
  description:
    "Mentions légales, éditeur du site et informations réglementaires — Foncier Facile Afrique.",
  pathname: '/mentions-legales',
})

export default function MentionsLegalesPage() {
  return (
    <div className="bg-ffa-ink min-h-screen">
      <section className="border-b border-ffa-divider py-14 md:py-20">
        <div className="container-site text-center">
          <p className="text-ffa-gold text-xs font-semibold uppercase tracking-[0.2em] mb-3">Légal</p>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-ffa-fg">Mentions légales</h1>
        </div>
      </section>

      <div className="container-site py-14 max-w-3xl">
        <div className="bg-ffa-elevated border border-ffa-divider rounded-2xl p-8 md:p-10 space-y-8 prose prose-ffa-dark max-w-none">
          <section>
            <h2 className="text-ffa-gold font-heading text-xl font-semibold">Éditeur du site</h2>
            <p className="text-ffa-fg">
              <strong>Foncier Facile Afrique</strong><br />
              Société de conseil en immobilier et foncier<br />
              Parakou, Bénin, Afrique de l&apos;Ouest<br />
              Email : contact@foncierfacileafrique.fr<br />
              Téléphone : +229 96 90 12 04
            </p>
          </section>

          <section>
            <h2 className="text-ffa-gold font-heading text-xl font-semibold">Hébergement</h2>
            <p className="text-ffa-fg">
              Ce site est hébergé par OVH SAS<br />
              2 rue Kellermann, 59100 Roubaix, France<br />
              <a href="https://www.ovh.com" target="_blank" rel="noopener noreferrer" className="text-ffa-gold hover:underline">www.ovh.com</a>
            </p>
          </section>

          <section>
            <h2 className="text-ffa-gold font-heading text-xl font-semibold">Propriété intellectuelle</h2>
            <p className="text-ffa-fg">
              L&apos;ensemble du contenu de ce site (textes, images, logos, graphiques) est la propriété
              exclusive de Foncier Facile Afrique et est protégé par les lois en vigueur sur la propriété
              intellectuelle. Toute reproduction, même partielle, est strictement interdite sans accord préalable.
            </p>
          </section>

          <section>
            <h2 className="text-ffa-gold font-heading text-xl font-semibold">Protection des données personnelles</h2>
            <p className="text-ffa-fg">
              Les informations collectées via les formulaires de ce site sont destinées exclusivement à
              Foncier Facile Afrique et ne sont jamais cédées à des tiers. Conformément à la réglementation
              en vigueur, vous disposez d&apos;un droit d&apos;accès, de rectification et de suppression de vos données.
              Pour exercer ce droit, contactez-nous à : contact@foncierfacileafrique.fr
            </p>
          </section>

          <section>
            <h2 className="text-ffa-gold font-heading text-xl font-semibold">Cookies</h2>
            <p className="text-ffa-fg">
              Ce site utilise des cookies techniques nécessaires à son fonctionnement. Aucun cookie de
              tracking tiers n&apos;est utilisé sans votre consentement.
            </p>
          </section>

          <section>
            <h2 className="text-ffa-gold font-heading text-xl font-semibold">Responsabilité</h2>
            <p className="text-ffa-fg">
              Les informations contenues sur ce site sont données à titre indicatif et ne constituent pas
              un conseil juridique ou financier. Foncier Facile Afrique ne peut être tenu responsable des
              dommages directs ou indirects résultant de l&apos;utilisation de ce site.
            </p>
          </section>

          <section>
            <h2 className="text-ffa-gold font-heading text-xl font-semibold">Contact</h2>
            <p className="text-ffa-fg">
              Pour toute question relative à ces mentions légales, contactez-nous :<br />
              Email : contact@foncierfacileafrique.fr<br />
              Téléphone : +229 96 90 12 04
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
