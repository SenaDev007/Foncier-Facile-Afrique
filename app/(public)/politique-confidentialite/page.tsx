import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Politique de confidentialité — Foncier Facile Afrique',
  description: 'Politique de confidentialité et protection des données personnelles de Foncier Facile Afrique.',
}

export default function PolitiqueConfidentialitePage() {
  return (
    <div className="bg-[#1C1C1E] min-h-screen">
      <section className="border-b border-[#2C2C2E] py-14 md:py-20">
        <div className="container-site text-center">
          <p className="text-[#D4A843] text-xs font-semibold uppercase tracking-[0.2em] mb-3">Vie privée</p>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-[#EFEFEF]">Politique de confidentialité</h1>
        </div>
      </section>

      <div className="container-site py-14 max-w-3xl">
        <div className="bg-[#2C2C2E] border border-[#3A3A3C] rounded-2xl p-8 md:p-10 space-y-8 prose prose-ffa-dark max-w-none">
          <section>
            <h2 className="text-[#D4A843] font-heading text-xl font-semibold">Responsable du traitement</h2>
            <p className="text-[#EFEFEF]">
              Foncier Facile Afrique, société de conseil en immobilier et foncier, basée à Parakou (Bénin),
              est responsable du traitement des données personnelles collectées via ce site.
            </p>
          </section>

          <section>
            <h2 className="text-[#D4A843] font-heading text-xl font-semibold">Données collectées</h2>
            <p className="text-[#EFEFEF]">
              Nous collectons les données que vous nous communiquez volontairement : nom, prénom, adresse email,
              numéro de téléphone, contenu de vos messages et, le cas échéant, les informations relatives à votre
              projet immobilier (budget, type de bien, zone). Les données de navigation (adresse IP, cookies techniques)
              peuvent être enregistrées pour le bon fonctionnement du site.
            </p>
          </section>

          <section>
            <h2 className="text-[#D4A843] font-heading text-xl font-semibold">Finalités</h2>
            <p className="text-[#EFEFEF]">
              Vos données sont utilisées exclusivement pour : répondre à vos demandes de contact, gérer les leads
              et les dossiers d&apos;accompagnement, vous envoyer la newsletter si vous y avez souscrit, et améliorer
              nos services. Elles ne sont jamais cédées à des tiers à des fins commerciales.
            </p>
          </section>

          <section>
            <h2 className="text-[#D4A843] font-heading text-xl font-semibold">Durée de conservation</h2>
            <p className="text-[#EFEFEF]">
              Les données de contact et les échanges sont conservés pendant la durée de la relation commerciale
              puis pendant la durée légale applicable. Les données de newsletter sont conservées jusqu&apos;à désinscription.
              Vous pouvez à tout moment demander l&apos;accès, la rectification ou la suppression de vos données.
            </p>
          </section>

          <section>
            <h2 className="text-[#D4A843] font-heading text-xl font-semibold">Vos droits</h2>
            <p className="text-[#EFEFEF]">
              Conformément à la réglementation en vigueur, vous disposez d&apos;un droit d&apos;accès, de rectification,
              d&apos;effacement et de portabilité de vos données, ainsi que du droit de vous opposer au traitement ou
              de demander sa limitation. Pour exercer ces droits, contactez-nous à : contact@foncierfacileafrique.fr.
            </p>
          </section>

          <section>
            <h2 className="text-[#D4A843] font-heading text-xl font-semibold">Cookies</h2>
            <p className="text-[#EFEFEF]">
              Ce site utilise des cookies techniques nécessaires à son fonctionnement. Aucun cookie de tracking
              tiers n&apos;est utilisé sans votre consentement. Vous pouvez configurer votre navigateur pour refuser
              les cookies non essentiels.
            </p>
          </section>

          <section>
            <h2 className="text-[#D4A843] font-heading text-xl font-semibold">Modifications</h2>
            <p className="text-[#EFEFEF]">
              Cette politique peut être mise à jour. La date de dernière mise à jour sera indiquée en bas de page.
              Nous vous invitons à la consulter régulièrement.
            </p>
            <p className="text-[#636366] text-sm mt-4">Dernière mise à jour : mars 2025</p>
          </section>
        </div>
      </div>
    </div>
  )
}
