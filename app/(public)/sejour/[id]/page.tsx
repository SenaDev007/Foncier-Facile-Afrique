import type { Metadata } from 'next'
import { publicPageMetadata, truncateMetaDescription } from '@/lib/seo'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { SejourBookingForm } from '@/components/public/SejourBookingForm'
import { PhotoGallery } from '@/components/public/SejourComponents'
import { messageIndisponibiliteLogement } from '@/lib/sejour-utils'
import { Star, Users, BedDouble, MapPin } from 'lucide-react'

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
  const photos = JSON.parse(JSON.stringify(logement.photos))

  return (
    <div className="bg-[#1C1C1E] min-h-screen">
      <div className="border-b border-[#D4A843]/20 bg-[#161618]">
        <div className="container-site py-8 md:py-12">
          <Link href="/sejour" className="inline-flex items-center gap-1.5 text-sm text-[#8E8E93] hover:text-[#D4A843] mb-5 transition-colors">
            ← Séjour & tourisme
          </Link>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="font-heading text-3xl md:text-4xl font-bold text-[#EFEFEF]">{logement.nom}</h1>
              <p className="flex items-center gap-1.5 text-[#8E8E93] mt-2 text-sm">
                <MapPin className="h-4 w-4 text-[#D4A843]" aria-hidden />
                {logement.ville}{logement.quartier ? ` · ${logement.quartier}` : ''}
                <span className="text-[#636366] ml-2">Réf. {logement.reference}</span>
              </p>
              <div className="flex flex-wrap gap-4 mt-3">
                <span className="flex items-center gap-1.5 text-sm text-[#8E8E93]">
                  <Users className="h-4 w-4 text-[#D4A843]" aria-hidden />
                  {logement.capacite} voyageur{logement.capacite > 1 ? 's' : ''} max.
                </span>
                <span className="flex items-center gap-1.5 text-sm text-[#8E8E93]">
                  <BedDouble className="h-4 w-4 text-[#D4A843]" aria-hidden />
                  Minimum {logement.minNuits} nuit{logement.minNuits > 1 ? 's' : ''}
                </span>
                {logement.note && logement.note > 0 && (
                  <span className="flex items-center gap-1 text-sm text-[#D4A843]">
                    <Star className="h-4 w-4 fill-[#D4A843]" aria-hidden />
                    {logement.note.toFixed(1)}/5 ({logement.nbAvis} avis)
                  </span>
                )}
              </div>
            </div>
            <span className={`text-sm font-semibold px-3 py-1.5 rounded-full border ${
              reservable
                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                : 'bg-[#3A3A3C] text-[#636366] border-[#3A3A3C]'
            }`}>
              {reservable ? 'Disponible' : 'Non disponible'}
            </span>
          </div>
        </div>
      </div>

      <div className="container-site py-8 lg:py-12 grid lg:grid-cols-3 gap-8 lg:gap-12">
        <div className="lg:col-span-2 space-y-8">
          {/* Galerie photos */}
          <PhotoGallery photos={photos} nom={logement.nom} />

          {/* Description */}
          {logement.description && (
            <div>
              <h2 className="font-heading text-xl font-semibold text-[#EFEFEF] mb-3">Description</h2>
              <div className="text-[#EFEFEF]/85 text-sm leading-relaxed whitespace-pre-wrap">
                {logement.description}
              </div>
            </div>
          )}
          {/* Équipements */}
          {logement.equipements.length > 0 && (
            <div>
              <h2 className="font-heading text-xl font-semibold text-[#EFEFEF] mb-3">Équipements</h2>
              <ul className="flex flex-wrap gap-2">
                {logement.equipements.map((e: string) => (
                  <li key={e} className="text-xs px-3 py-1.5 rounded-full bg-[#D4A843]/10 text-[#D4A843] border border-[#D4A843]/25">
                    {e}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Services */}
          {logement.services && logement.services.length > 0 && (
            <div>
              <h2 className="font-heading text-xl font-semibold text-[#EFEFEF] mb-3">Services inclus</h2>
              <ul className="grid sm:grid-cols-2 gap-2">
                {logement.services.map((s: string) => (
                  <li key={s} className="flex items-center gap-2 text-sm text-[#8E8E93]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4A843] flex-shrink-0" aria-hidden />
                    {s}
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
