import type { Metadata } from 'next'
import { publicPageMetadata } from '@/lib/seo'
import Link from 'next/link'
import { DiagnosticFoncierForm } from '@/components/public/DiagnosticFoncierForm'

export const metadata: Metadata = publicPageMetadata({
  title: 'Régularisation foncière — Diagnostic & accompagnement',
  description:
    'PH vers TF, premier titre, mutations, litiges : faites le point sur votre situation foncière au Bénin avec Foncier Facile Afrique.',
  pathname: '/regularisation',
  keywords: ['permis d’habiter titre foncier Bénin', 'régularisation foncière Parakou'],
})

const SERVICES = [
  {
    titre: 'PH → Titre foncier',
    desc: 'Accompagnement pour passer du permis d’habiter au titre foncier sécurisé.',
    prix: 'Sur devis',
  },
  {
    titre: 'Premier TF',
    desc: 'Immatriculation et constitution de dossier pour une première formalisation.',
    prix: 'Sur devis',
  },
  {
    titre: 'Mutation & transmission',
    desc: 'Vente, donation, succession : cadre juridique et démarches administratives.',
    prix: 'Sur devis',
  },
  {
    titre: 'Litiges & médiation',
    desc: 'Analyse de conflit, stratégie et orientation vers les instances compétentes.',
    prix: 'Sur devis',
  },
  {
    titre: 'Morcellement',
    desc: 'Division de parcelle, bornage et dossiers techniques associés.',
    prix: 'Sur devis',
  },
  {
    titre: 'Audit documentaire',
    desc: 'Revue de vos titres et attestations avant achat ou investissement.',
    prix: 'Sur devis',
  },
]

const ETAPES = [
  { titre: 'Diagnostic', desc: 'Compréhension de votre situation et des pièces disponibles.' },
  { titre: 'Stratégie', desc: 'Feuille de route et estimation des délais.' },
  { titre: 'Constitution du dossier', desc: 'Rassemblement et conformité des documents.' },
  { titre: 'Dépôt & suivi', desc: 'Accompagnement auprès des administrations concernées.' },
  { titre: 'Finalisation', desc: 'Remise des actes et sécurisation de la propriété.' },
]

export default function RegularisationPage() {
  return (
    <div className="bg-[#1C1C1E] min-h-screen">
      <section className="relative border-b border-[#D4A843]/25 overflow-hidden">
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#D4A843]/12 via-[#1C1C1E] to-[#161618]"
          aria-hidden="true"
        />
        <div className="relative container-site py-14 md:py-20">
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div>
              <p className="text-[#D4A843] text-xs font-semibold uppercase tracking-[0.2em] mb-3">
                Juridique foncier — Régularisation
              </p>
              <h1 className="font-heading text-4xl md:text-5xl font-bold text-[#EFEFEF]">
                Régularisation foncière
              </h1>
              <p className="mt-4 text-[#8E8E93] text-lg max-w-xl">
                Un diagnostic gratuit pour orienter votre dossier : titre, mutation, litige ou audit avant achat.
              </p>
              <dl className="mt-8 grid grid-cols-3 gap-4 text-center sm:text-left">
                <div>
                  <dt className="text-2xl font-heading font-bold text-[#D4A843]">+200</dt>
                  <dd className="text-xs text-[#8E8E93]">Dossiers suivis</dd>
                </div>
                <div>
                  <dt className="text-2xl font-heading font-bold text-[#D4A843]">90 j.</dt>
                  <dd className="text-xs text-[#8E8E93]">Délai moyen indicatif</dd>
                </div>
                <div>
                  <dt className="text-2xl font-heading font-bold text-[#D4A843]">Haute</dt>
                  <dd className="text-xs text-[#8E8E93]">Exigence qualité</dd>
                </div>
              </dl>
            </div>
            <div className="rounded-2xl border border-[#3A3A3C] bg-[#2C2C2E]/95 backdrop-blur p-6 md:p-8">
              <h2 className="font-heading text-lg font-semibold text-[#EFEFEF] mb-1">Diagnostic gratuit</h2>
              <p className="text-sm text-[#8E8E93] mb-5">
                Décrivez votre situation : un juriste ou un gestionnaire de dossier vous recontacte rapidement.
              </p>
              <DiagnosticFoncierForm />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#161618] border-y border-[#2C2C2E] py-14 md:py-16">
        <div className="container-site">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-[#EFEFEF] text-center mb-10">
            Nos prestations régularisation
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES.map((s) => (
              <div
                key={s.titre}
                className="rounded-xl border border-[#3A3A3C] border-l-4 border-l-[#D4A843] bg-[#2C2C2E] p-5"
              >
                <h3 className="font-heading font-semibold text-lg mb-2 text-[#EFEFEF]">{s.titre}</h3>
                <p className="text-sm text-[#8E8E93] mb-3">{s.desc}</p>
                <p className="text-xs font-semibold text-[#D4A843]">{s.prix}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-site py-14 md:py-16">
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-[#EFEFEF] text-center mb-10">
          Processus en 5 étapes
        </h2>
        <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-2">
          {ETAPES.map((e, i) => (
            <div key={e.titre} className="flex-1 flex md:flex-col gap-3 items-start md:items-center text-left md:text-center">
              <div className="flex md:flex-col items-center gap-2 w-full md:w-auto">
                <span className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-[#D4A843] to-[#B8912E] text-[#1C1C1E] font-heading font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                {i < ETAPES.length - 1 && (
                  <div className="hidden md:block flex-1 w-px h-8 bg-[#3A3A3C] mx-auto" aria-hidden="true" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-[#D4A843] text-sm md:text-base">{e.titre}</h3>
                <p className="text-sm text-[#8E8E93] mt-1">{e.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-center mt-10">
          <Link href="/contact" className="text-[#D4A843] hover:underline text-sm font-medium">
            Une question avant de déposer un dossier ? Contactez-nous
          </Link>
        </p>
      </section>
    </div>
  )
}
