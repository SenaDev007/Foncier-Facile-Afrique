import type { Metadata } from 'next'
import { publicPageMetadata } from '@/lib/seo'
import Link from 'next/link'
import Image from 'next/image'
import { Plane, CalendarCheck, Sparkles, Building2 } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { libelleStatutLogementPublic, ORDRE_STATUT_LOGEMENT } from '@/lib/sejour-utils'

/** Toujours lire la base à la requête (évite une page figée vide si le build n’avait aucun logement). */
export const dynamic = 'force-dynamic'

export const metadata: Metadata = publicPageMetadata({
  title: 'Séjour & tourisme — Réservation de logements',
  description:
    'Réservez villas, appartements et hébergements au Bénin : logements vérifiés, confirmation avant arrivée, options transfert.',
  pathname: '/sejour',
  keywords: ['location vacances Bénin', 'hébergement tourisme Parakou'],
})

export default async function SejourPage() {
  const logementsRaw = await prisma.logement.findMany({
    where: { deletedAt: null },
    include: { photos: { orderBy: { ordre: 'asc' }, take: 1 } },
    orderBy: { createdAt: 'desc' },
  })
  const logements = [...logementsRaw].sort((a, b) => {
    const d = ORDRE_STATUT_LOGEMENT[a.statut] - ORDRE_STATUT_LOGEMENT[b.statut]
    if (d !== 0) return d
    return b.createdAt.getTime() - a.createdAt.getTime()
  })

  return (
    <div className="bg-[#1C1C1E] min-h-screen">
      <section className="relative overflow-hidden border-b border-[#D4A843]/25">
        <div
          className="absolute inset-0 opacity-90"
          style={{
            background: 'linear-gradient(135deg, rgba(212,168,67,0.18) 0%, #1C1C1E 50%, #161618 100%)',
          }}
          aria-hidden="true"
        />
        <div className="relative container-site py-16 md:py-24">
          <p className="text-[#D4A843] text-xs font-semibold uppercase tracking-[0.2em] mb-3">
            Séjour & tourisme
          </p>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-[#EFEFEF] max-w-2xl">
            Séjour & tourisme
          </h1>
          <p className="mt-4 text-[#8E8E93] text-lg max-w-xl">
            Logements sélectionnés, tarif par nuit affiché. Les biens marqués comme non disponibles restent visibles pour
            référence ; la réservation en ligne (FedaPay) est réservée aux logements disponibles.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-[#D4A843] text-[#1C1C1E] font-semibold px-5 py-3 rounded-xl hover:bg-[#E8B84B] transition-colors text-sm"
            >
              Nous contacter
            </Link>
            <Link
              href="/catalogue"
              className="inline-flex items-center gap-2 border border-[#EFEFEF]/30 text-[#EFEFEF] font-medium px-5 py-3 rounded-xl hover:bg-white/5 text-sm"
            >
              Voir aussi le catalogue achat
            </Link>
          </div>
        </div>
      </section>

      <section className="container-site py-14 md:py-16">
        <div className="grid md:grid-cols-3 gap-6 mb-14">
          <div className="rounded-2xl border border-[#3A3A3C] bg-[#2C2C2E] p-6">
            <CalendarCheck className="h-8 w-8 text-[#D4A843] mb-3" aria-hidden="true" />
            <h2 className="font-heading font-semibold text-[#EFEFEF] mb-2">Confirmation avant arrivée</h2>
            <p className="text-sm text-[#8E8E93]">
              Chaque demande passe par validation équipe FFA avant confirmation définitive.
            </p>
          </div>
          <div className="rounded-2xl border border-[#3A3A3C] bg-[#2C2C2E] p-6">
            <Plane className="h-8 w-8 text-[#D4A843] mb-3" aria-hidden="true" />
            <h2 className="font-heading font-semibold text-[#EFEFEF] mb-2">Transfert aéroport</h2>
            <p className="text-sm text-[#8E8E93]">Option transfert : à préciser lors de la réservation.</p>
          </div>
          <div className="rounded-2xl border border-[#3A3A3C] bg-[#2C2C2E] p-6">
            <Sparkles className="h-8 w-8 text-[#D4A843] mb-3" aria-hidden="true" />
            <h2 className="font-heading font-semibold text-[#EFEFEF] mb-2">Types d&apos;hébergement</h2>
            <p className="text-sm text-[#8E8E93]">Villas, appartements, guest houses — offre enrichie au fil du temps.</p>
          </div>
        </div>

        <h2 className="font-heading text-2xl font-bold text-[#EFEFEF] mb-6">Nos logements</h2>
        {logements.length === 0 ? (
          <div className="rounded-2xl border border-[#3A3A3C] bg-[#2C2C2E] p-8 md:p-10 max-w-2xl">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-[#D4A843]/12 border border-[#D4A843]/25 flex-shrink-0">
                <Building2 className="h-8 w-8 text-[#D4A843]" aria-hidden />
              </div>
              <div className="space-y-3">
                <h3 className="font-heading text-lg font-semibold text-[#EFEFEF]">
                  Aucun logement affiché pour le moment
                </h3>
                <p className="text-sm text-[#8E8E93] leading-relaxed">
                  Cette liste se remplit automatiquement lorsque des hébergements sont créés dans le back-office
                  (statut publié, non supprimés). Si vous venez d’ajouter des biens, actualisez la page.
                </p>
                <ul className="text-sm text-[#8E8E93] list-disc pl-5 space-y-1">
                  <li>
                    <strong className="text-[#EFEFEF] font-medium">Équipe FFA :</strong>{' '}
                    <Link href="/admin/logements" className="text-[#D4A843] hover:underline">
                      Gérer les logements
                    </Link>
                  </li>
                  <li>
                    <strong className="text-[#EFEFEF] font-medium">Voyageurs :</strong>{' '}
                    <Link href="/contact" className="text-[#D4A843] hover:underline">
                      nous contacter
                    </Link>{' '}
                    pour un séjour sur mesure.
                  </li>
                </ul>
                {process.env.NODE_ENV === 'development' && (
                  <p className="text-xs text-[#636366] pt-2 border-t border-[#3A3A3C]">
                    Environnement local : la commande <code className="text-[#8E8E93]">npm run db:seed</code> insère
                    deux logements démo (Parakou et Cotonou).
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {logements.map((l) => {
              const ph = l.photos[0]
              const dispo = l.statut === 'DISPONIBLE'
              const badgeIndispo = dispo ? null : libelleStatutLogementPublic(l.statut)
              return (
                <Link
                  key={l.id}
                  href={`/sejour/${l.id}`}
                  className={`group rounded-2xl border bg-[#2C2C2E] overflow-hidden transition-colors ${
                    dispo
                      ? 'border-[#3A3A3C] hover:border-[#D4A843]/45'
                      : 'border-[#3A3A3C] opacity-90 hover:border-[#636366]'
                  }`}
                >
                  <div className="relative h-44 bg-[#3A3A3C]">
                    {ph ? (
                      <Image
                        src={ph.url}
                        alt={ph.alt ?? l.nom}
                        fill
                        className={`object-cover transition-transform ${dispo ? 'group-hover:scale-[1.02]' : 'grayscale-[35%]'}`}
                        sizes="(max-width:640px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-[#D4A843]/60 font-heading">
                        FFA
                      </div>
                    )}
                    {!dispo && (
                      <div
                        className="absolute inset-0 bg-[#1C1C1E]/45 pointer-events-none"
                        aria-hidden
                      />
                    )}
                    {badgeIndispo && (
                      <span className="absolute top-2 right-2 z-[1] rounded-full px-2.5 py-0.5 text-xs font-semibold border bg-[#2C2C2E]/95 text-[#8E8E93] border-[#3A3A3C]">
                        {badgeIndispo}
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3
                      className={`font-heading font-semibold transition-colors ${
                        dispo ? 'text-[#EFEFEF] group-hover:text-[#D4A843]' : 'text-[#EFEFEF]/90'
                      }`}
                    >
                      {l.nom}
                    </h3>
                    <p className="text-xs text-[#8E8E93] mt-1">
                      {l.ville} · {l.capacite} pers. · min. {l.minNuits} nuit(s)
                    </p>
                    <p className={`font-heading font-bold mt-2 ${dispo ? 'text-[#D4A843]' : 'text-[#8E8E93]'}`}>
                      {new Intl.NumberFormat('fr-FR').format(l.prixNuit)} FCFA{' '}
                      <span className="text-xs font-normal text-[#8E8E93]">/ nuit</span>
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
