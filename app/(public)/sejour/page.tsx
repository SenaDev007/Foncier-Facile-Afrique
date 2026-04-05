import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Plane, CalendarCheck, Sparkles } from 'lucide-react'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = {
  title: 'Séjour & tourisme — Réservation de logements',
  description:
    'Réservez villas, appartements et hébergements au Bénin : logements vérifiés, confirmation avant arrivée, options transfert.',
  openGraph: { title: 'Séjour & tourisme — Foncier Facile Afrique' },
}

export default async function SejourPage() {
  const logements = await prisma.logement.findMany({
    where: { statut: 'DISPONIBLE', deletedAt: null },
    include: { photos: { orderBy: { ordre: 'asc' }, take: 1 } },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="bg-[#1C1C1E] min-h-screen">
      <section className="relative overflow-hidden border-b border-[#5B2C6F]/40">
        <div
          className="absolute inset-0 opacity-90"
          style={{
            background: 'linear-gradient(135deg, #5B2C6F 0%, #1C1C1E 55%, #2C2C2E 100%)',
          }}
          aria-hidden="true"
        />
        <div className="relative container-site py-16 md:py-24">
          <p className="text-[#E8B84B] text-xs font-semibold uppercase tracking-[0.2em] mb-3">
            Pôle violet — Tourisme
          </p>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-[#EFEFEF] max-w-2xl">
            Séjour & tourisme
          </h1>
          <p className="mt-4 text-[#C9A0DC]/95 text-lg max-w-xl">
            Logements sélectionnés, tarif par nuit affiché. Réservation : formulaire ou{' '}
            <code className="text-xs bg-black/30 px-1 rounded">POST /api/reservations</code> — confirmation par
            e-mail, suivi dans le back-office (paiement en ligne à brancher ultérieurement).
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
            <CalendarCheck className="h-8 w-8 text-[#C9A0DC] mb-3" aria-hidden="true" />
            <h2 className="font-heading font-semibold text-[#EFEFEF] mb-2">Confirmation avant arrivée</h2>
            <p className="text-sm text-[#8E8E93]">
              Chaque demande passe par validation équipe FFA avant confirmation définitive.
            </p>
          </div>
          <div className="rounded-2xl border border-[#3A3A3C] bg-[#2C2C2E] p-6">
            <Plane className="h-8 w-8 text-[#C9A0DC] mb-3" aria-hidden="true" />
            <h2 className="font-heading font-semibold text-[#EFEFEF] mb-2">Transfert aéroport</h2>
            <p className="text-sm text-[#8E8E93]">Option transfert : à préciser lors de la réservation.</p>
          </div>
          <div className="rounded-2xl border border-[#3A3A3C] bg-[#2C2C2E] p-6">
            <Sparkles className="h-8 w-8 text-[#C9A0DC] mb-3" aria-hidden="true" />
            <h2 className="font-heading font-semibold text-[#EFEFEF] mb-2">Types d&apos;hébergement</h2>
            <p className="text-sm text-[#8E8E93]">Villas, appartements, guest houses — offre enrichie au fil du temps.</p>
          </div>
        </div>

        <h2 className="font-heading text-2xl font-bold text-[#EFEFEF] mb-6">Nos logements</h2>
        {logements.length === 0 ? (
          <p className="text-[#8E8E93] text-sm">Aucun logement publié pour le moment.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {logements.map((l) => {
              const ph = l.photos[0]
              return (
                <Link
                  key={l.id}
                  href={`/sejour/${l.id}`}
                  className="group rounded-2xl border border-[#3A3A3C] bg-[#2C2C2E] overflow-hidden hover:border-[#5B2C6F]/60 transition-colors"
                >
                  <div className="relative h-44 bg-[#3A3A3C]">
                    {ph ? (
                      <Image
                        src={ph.url}
                        alt={ph.alt ?? l.nom}
                        fill
                        className="object-cover group-hover:scale-[1.02] transition-transform"
                        sizes="(max-width:640px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-[#5B2C6F] font-heading">
                        FFA
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-heading font-semibold text-[#EFEFEF] group-hover:text-[#D4A843] transition-colors">
                      {l.nom}
                    </h3>
                    <p className="text-xs text-[#8E8E93] mt-1">
                      {l.ville} · {l.capacite} pers. · min. {l.minNuits} nuit(s)
                    </p>
                    <p className="text-[#D4A843] font-heading font-bold mt-2">
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
