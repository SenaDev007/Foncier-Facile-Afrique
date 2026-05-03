import type { Metadata } from 'next'
import { publicPageMetadata } from '@/lib/seo'
import Link from 'next/link'
import Image from 'next/image'
import { Plane, CalendarCheck, Sparkles, Building2, ShieldCheck, Star } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { ORDRE_STATUT_LOGEMENT } from '@/lib/sejour-utils'
import { SejourListClient } from '@/components/public/SejourComponents'

/** Toujours lire la base à la requête */
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
    include: { photos: { orderBy: { ordre: 'asc' }, take: 3 } },
    orderBy: { createdAt: 'desc' },
  })

  const logementsTriés = [...logementsRaw].sort((a, b) => {
    const d = ORDRE_STATUT_LOGEMENT[a.statut] - ORDRE_STATUT_LOGEMENT[b.statut]
    if (d !== 0) return d
    return b.createdAt.getTime() - a.createdAt.getTime()
  })

  const logements = JSON.parse(JSON.stringify(logementsTriés))
  const disponibles = logements.filter((l: { statut: string }) => l.statut === 'DISPONIBLE').length

  return (
    <div className="bg-[#1C1C1E] min-h-screen">
      {/* Hero avec image */}
      <section className="relative overflow-hidden border-b border-[#D4A843]/20" style={{ minHeight: '480px' }}>
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="/images/hero/hero-sejour.jpg"
            alt="Villa de luxe au Bénin"
            fill
            className="object-cover object-center scale-105"
            style={{ animation: 'slowZoom 20s ease-in-out infinite alternate' }}
            priority
            sizes="100vw"
          />
          {/* Overlay dégradé */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to right, rgba(22,22,24,0.92) 0%, rgba(22,22,24,0.70) 50%, rgba(22,22,24,0.40) 100%)',
            }}
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(28,28,30,0.95) 0%, transparent 60%)' }} />
        </div>
        <style>{`@keyframes slowZoom { from { transform: scale(1.05); } to { transform: scale(1.15); } }`}</style>
        <div className="relative container-site py-16 md:py-24">
          <p className="text-[#D4A843] text-xs font-semibold uppercase tracking-[0.2em] mb-3">
            Séjour &amp; tourisme
          </p>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-[#EFEFEF] max-w-2xl leading-tight">
            Séjournez au Bénin{' '}
            <span className="text-[#D4A843]">en toute sérénité</span>
          </h1>
          <p className="mt-4 text-[#8E8E93] text-lg max-w-xl leading-relaxed">
            Logements sélectionnés et vérifiés par notre équipe. Réservation en ligne sécurisée,
            confirmation personnalisée et options de transfert aéroport disponibles.
          </p>

          {/* Compteurs rapides */}
          <div className="mt-8 flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-[#D4A843]/15 flex items-center justify-center">
                <Building2 className="h-4 w-4 text-[#D4A843]" aria-hidden />
              </div>
              <div>
                <p className="text-[#EFEFEF] font-heading font-bold text-lg leading-none">{logements.length}</p>
                <p className="text-[#8E8E93] text-xs">logement{logements.length > 1 ? 's' : ''}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-emerald-500/15 flex items-center justify-center">
                <ShieldCheck className="h-4 w-4 text-emerald-400" aria-hidden />
              </div>
              <div>
                <p className="text-[#EFEFEF] font-heading font-bold text-lg leading-none">{disponibles}</p>
                <p className="text-[#8E8E93] text-xs">disponible{disponibles > 1 ? 's' : ''}</p>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#logements"
              className="inline-flex items-center gap-2 bg-[#D4A843] text-[#1C1C1E] font-semibold px-6 py-3 rounded-xl hover:bg-[#E8B84B] transition-colors text-sm shadow-lg shadow-[#D4A843]/20"
            >
              Voir les logements
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 border border-[#EFEFEF]/20 text-[#EFEFEF] font-medium px-6 py-3 rounded-xl hover:bg-white/5 text-sm"
            >
              Séjour sur mesure
            </Link>
          </div>
        </div>
      </section>

      {/* Garanties */}
      <section className="border-b border-[#2C2C2E] bg-[#161618]">
        <div className="container-site py-10">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
            {[
              {
                icon: CalendarCheck,
                title: 'Confirmation avant arrivée',
                desc: 'Chaque demande est validée par notre équipe avant confirmation définitive.',
              },
              {
                icon: Plane,
                title: 'Transfert aéroport',
                desc: 'Option transfert disponible à préciser lors de la réservation.',
              },
              {
                icon: ShieldCheck,
                title: 'Paiement sécurisé',
                desc: 'Paiement en ligne via FedaPay (Mobile Money ou carte bancaire).',
              },
              {
                icon: Sparkles,
                title: 'Hébergements vérifiés',
                desc: 'Villas, appartements, guest houses — chaque bien est inspecté.',
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#D4A843]/10 border border-[#D4A843]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <item.icon className="h-4 w-4 text-[#D4A843]" aria-hidden />
                </div>
                <div>
                  <h2 className="font-semibold text-[#EFEFEF] text-sm">{item.title}</h2>
                  <p className="text-xs text-[#8E8E93] mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Liste des logements */}
      <section id="logements" className="container-site py-12 md:py-16">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-[#EFEFEF]">Nos logements</h2>
            <p className="text-[#8E8E93] text-sm mt-1">Sélectionnez votre hébergement et réservez en ligne</p>
          </div>
        </div>

        {logements.length === 0 ? (
          <div className="rounded-2xl border border-[#3A3A3C] bg-[#2C2C2E] p-10 max-w-2xl">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-[#D4A843]/12 border border-[#D4A843]/25 flex-shrink-0">
                <Building2 className="h-8 w-8 text-[#D4A843]" aria-hidden />
              </div>
              <div className="space-y-3">
                <h3 className="font-heading text-lg font-semibold text-[#EFEFEF]">
                  Aucun logement affiché pour le moment
                </h3>
                <p className="text-sm text-[#8E8E93] leading-relaxed">
                  Notre offre de séjour est en cours de constitution. Contactez-nous pour un séjour sur mesure.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-[#D4A843] text-[#1C1C1E] text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#E8B84B] transition-colors"
                >
                  Nous contacter
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <SejourListClient logements={logements} />
        )}
      </section>

      {/* CTA bas de page */}
      <section className="border-t border-[#2C2C2E] bg-[#161618]">
        <div className="container-site py-12 text-center">
          <Star className="h-8 w-8 text-[#D4A843] mx-auto mb-4" aria-hidden />
          <h2 className="font-heading text-2xl font-bold text-[#EFEFEF] mb-3">
            Vous ne trouvez pas ce qu&apos;il vous faut ?
          </h2>
          <p className="text-[#8E8E93] max-w-lg mx-auto text-sm leading-relaxed mb-6">
            Notre équipe peut organiser un séjour sur mesure selon vos dates, votre budget et vos exigences.
            Contactez-nous directement.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-[#D4A843] text-[#1C1C1E] font-semibold px-6 py-3 rounded-xl hover:bg-[#E8B84B] transition-colors text-sm"
            >
              Demander un séjour personnalisé
            </Link>
            <Link
              href="/catalogue"
              className="inline-flex items-center gap-2 border border-[#3A3A3C] text-[#8E8E93] font-medium px-6 py-3 rounded-xl hover:border-[#D4A843]/50 hover:text-[#EFEFEF] transition-colors text-sm"
            >
              Voir aussi le catalogue immobilier
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
