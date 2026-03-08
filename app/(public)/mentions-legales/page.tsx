import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mentions légales — Foncier Facile Afrique',
  description: 'Mentions légales, politique de confidentialité et conditions d\'utilisation de Foncier Facile Afrique.',
}

export default function MentionsLegalesPage() {
  return (
    <div className="bg-[#F9F9F6] min-h-screen">
      <div className="container-site py-14 max-w-3xl">
        <h1 className="font-heading text-3xl font-bold text-dark mb-8">Mentions légales</h1>

        <div className="bg-white rounded-2xl shadow-card p-8 space-y-8 prose prose-green max-w-none">
          <section>
            <h2>Éditeur du site</h2>
            <p>
              <strong>Foncier Facile Afrique</strong><br />
              Société de conseil en immobilier et foncier<br />
              Parakou, Bénin, Afrique de l&apos;Ouest<br />
              Email : contact@foncierfacileafrique.fr<br />
              Téléphone : +229 96 90 12 04
            </p>
          </section>

          <section>
            <h2>Hébergement</h2>
            <p>
              Ce site est hébergé par OVH SAS<br />
              2 rue Kellermann, 59100 Roubaix, France<br />
              <a href="https://www.ovh.com" target="_blank" rel="noopener noreferrer">www.ovh.com</a>
            </p>
          </section>

          <section>
            <h2>Propriété intellectuelle</h2>
            <p>
              L&apos;ensemble du contenu de ce site (textes, images, logos, graphiques) est la propriété
              exclusive de Foncier Facile Afrique et est protégé par les lois en vigueur sur la propriété
              intellectuelle. Toute reproduction, même partielle, est strictement interdite sans accord préalable.
            </p>
          </section>

          <section>
            <h2>Protection des données personnelles</h2>
            <p>
              Les informations collectées via les formulaires de ce site sont destinées exclusivement à
              Foncier Facile Afrique et ne sont jamais cédées à des tiers. Conformément à la réglementation
              en vigueur, vous disposez d&apos;un droit d&apos;accès, de rectification et de suppression de vos données.
              Pour exercer ce droit, contactez-nous à : contact@foncierfacileafrique.fr
            </p>
          </section>

          <section>
            <h2>Cookies</h2>
            <p>
              Ce site utilise des cookies techniques nécessaires à son fonctionnement. Aucun cookie de
              tracking tiers n&apos;est utilisé sans votre consentement.
            </p>
          </section>

          <section>
            <h2>Responsabilité</h2>
            <p>
              Les informations contenues sur ce site sont données à titre indicatif et ne constituent pas
              un conseil juridique ou financier. Foncier Facile Afrique ne peut être tenu responsable des
              dommages directs ou indirects résultant de l&apos;utilisation de ce site.
            </p>
          </section>

          <section>
            <h2>Contact</h2>
            <p>
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
