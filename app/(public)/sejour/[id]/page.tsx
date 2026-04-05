import type { Metadata } from 'next'
import { publicPageMetadata, truncateMetaDescription } from '@/lib/seo'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { SejourBookingForm } from '@/components/public/SejourBookingForm'
import { messageIndisponibiliteLogement } from '@/lib/sejour-utils'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: { id: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const logement = await prisma.logement.findFirst({
    where: { id: params.id, deletedAt: null },
    select: {
      nom: true,
      ville: true,
      description: true,
      statut: true,
      photos: { take: 1, orderBy: { ordre: 'asc' }, select: { url: true } },
    },
  })
  const pathname = `/sejour/${params.id}`
  if (!logement) {
    return publicPageMetadata({
      title: 'Logement introuvable',
      description: 'Ce logement n’existe plus ou n’est plus proposé à la réservation.',
      pathname,
      noindex: true,
    })
  }
  const descRaw =
    logement.description?.trim() ||
    `Réservez « ${logement.nom} » à ${logement.ville} : hébergement Foncier Facile Afrique.`
  return publicPageMetadata({
    title: `${logement.nom} — Séjour ${logement.ville}`,
    description: truncateMetaDescription(descRaw),
    pathname,
    ogImage: logement.photos[0]?.url ?? null,
    noindex: logement.statut !== 'DISPONIBLE',
    keywords: [logement.ville, 'location courte durée Bénin'],
  })
}

export default async function SejourDetailPage({ params }: PageProps) {
  const logement = await prisma.logement.findFirst({
    where: { id: params.id, deletedAt: null },
    include: { photos: { orderBy: { ordre: 'asc' } } },
  })
  if (!logement) notFound()

  const reservable = logement.statut === 'DISPONIBLE'
  const main = logement.photos[0]

  return (
    <div className="bg-[#1C1C1E] min-h-screen">
      <div className="border-b border-[#D4A843]/25 bg-gradient-to-r from-[#D4A843]/10 to-transparent">
        <div className="container-site py-10 md:py-14">
          <Link href="/sejour" className="text-sm text-[#D4A843] hover:underline mb-4 inline-block">
            ← Séjour & tourisme
          </Link>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-[#EFEFEF]">{logement.nom}</h1>
          <p className="text-[#8E8E93] mt-2">
            {logement.ville}
            {logement.quartier ? ` · ${logement.quartier}` : ''} · Réf. {logement.reference}
          </p>
        </div>
      </div>

      <div className="container-site py-10 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-[#2C2C2E] border border-[#3A3A3C]">
            {main ? (
              <Image src={main.url} alt={main.alt ?? logement.nom} fill className="object-cover" sizes="(max-width:1024px) 100vw, 66vw" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-[#D4A843]/70 font-heading text-xl">
                FFA Séjour
              </div>
            )}
          </div>
          <div className="prose prose-invert max-w-none text-[#EFEFEF]/90 text-sm leading-relaxed whitespace-pre-wrap">
            {logement.description}
          </div>
          {logement.equipements.length > 0 && (
            <div>
              <h2 className="font-heading text-lg text-[#EFEFEF] mb-2">Équipements</h2>
              <ul className="flex flex-wrap gap-2">
                {logement.equipements.map((e) => (
                  <li key={e} className="text-xs px-2 py-1 rounded-full bg-[#D4A843]/12 text-[#D4A843] border border-[#D4A843]/30">
                    {e}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <aside className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-[#3A3A3C] bg-[#2C2C2E] p-6 space-y-4">
            <p className="text-3xl font-heading font-bold text-[#D4A843]">
              {new Intl.NumberFormat('fr-FR').format(logement.prixNuit)} FCFA
              <span className="text-sm font-normal text-[#8E8E93]"> / nuit</span>
            </p>
            <p className="text-sm text-[#8E8E93]">
              {logement.capacite} voyageur(s) max · minimum {logement.minNuits} nuit(s)
            </p>
            {logement.note != null && logement.note > 0 && (
              <p className="text-sm text-[#D4A843]">
                Note {logement.note.toFixed(1)} / 5 ({logement.nbAvis} avis)
              </p>
            )}
            {reservable ? (
              <>
                <p className="text-xs text-[#636366]">
                  Demande en ligne, vérification des disponibilités, puis paiement sécurisé FedaPay (Mobile Money ou
                  carte).
                </p>
                <SejourBookingForm
                  logementId={logement.id}
                  logementNom={logement.nom}
                  prixNuit={logement.prixNuit}
                  minNuits={logement.minNuits}
                  capacite={logement.capacite}
                  fraisService={10_000}
                />
              </>
            ) : (
              <div className="rounded-xl border border-[#3A3A3C] bg-[#1C1C1E]/50 p-4 space-y-3">
                <p className="text-sm text-[#8E8E93] leading-relaxed">
                  {messageIndisponibiliteLogement(logement.statut)} Pour d’autres dates ou hébergements, écrivez-nous.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex w-full justify-center rounded-lg border border-[#D4A843]/50 bg-[#D4A843]/10 px-4 py-2.5 text-sm font-medium text-[#D4A843] hover:bg-[#D4A843]/20 transition-colors"
                >
                  Nous contacter
                </Link>
                <Link href="/sejour" className="block text-center text-xs text-[#8E8E93] hover:text-[#D4A843]">
                  ← Retour aux logements
                </Link>
              </div>
            )}
            {reservable && (
              <Link href="/contact" className="block text-center text-xs text-[#8E8E93] hover:text-[#D4A843] pt-2">
                Besoin d’aide ? Contact
              </Link>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}
