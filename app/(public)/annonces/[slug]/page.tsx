import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { prisma } from '@/lib/prisma'
import { formatPrice, getStatutLabel, getStatutColor, getWhatsAppUrl } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { MapPin, Maximize2, FileCheck, Eye, Calendar, Phone } from 'lucide-react'
import AnnonceGallery from '@/components/public/AnnonceGallery'
import LeadFormAnnonce from '@/components/public/LeadFormAnnonce'
import AnnonceCard from '@/components/public/AnnonceCard'
import ShareButtons from '@/components/public/ShareButtons'
import type { AnnonceCard as AnnonceCardType } from '@/types'

const MapViewClient = dynamic(() => import('@/components/public/MapView'), { ssr: false })

interface PageProps {
  params: { slug: string }
}

export async function generateStaticParams() {
  const annonces = await prisma.annonce.findMany({
    where: { statut: 'EN_LIGNE' },
    select: { slug: true },
    orderBy: { createdAt: 'desc' },
    take: 20,
  })
  return annonces.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const annonce = await prisma.annonce.findUnique({
    where: { slug: params.slug },
    select: { titre: true, localisation: true, description: true, photos: { take: 1, select: { url: true } } },
  })
  if (!annonce) return { title: 'Annonce introuvable' }
  return {
    title: `${annonce.titre} — Foncier Facile Afrique`,
    description: annonce.description?.slice(0, 155) ?? `${annonce.titre} à ${annonce.localisation}`,
    openGraph: { images: annonce.photos[0]?.url ? [annonce.photos[0].url] : [] },
  }
}

export default async function AnnonceDetailPage({ params }: PageProps) {
  const annonce = await prisma.annonce.findUnique({
    where: { slug: params.slug },
    include: { photos: { orderBy: { ordre: 'asc' } } },
  })

  if (!annonce || annonce.statut !== 'EN_LIGNE') notFound()

  await prisma.annonce.update({ where: { id: annonce.id }, data: { vues: { increment: 1 } } })

  const similarAnnonces = await prisma.annonce.findMany({
    where: { statut: 'EN_LIGNE', id: { not: annonce.id }, type: annonce.type },
    include: { photos: true },
    orderBy: { createdAt: 'desc' },
    take: 3,
  })

  const whatsappMsg = `Bonjour, je suis intéressé(e) par l'annonce "${annonce.titre}" (Réf. ${annonce.reference}). Pouvez-vous me contacter ?`
  const mapAnnonce: AnnonceCardType = {
    ...annonce,
    photos: annonce.photos,
    latitude: annonce.latitude,
    longitude: annonce.longitude,
  }

  return (
    <div className="bg-[#1C1C1E] min-h-screen py-10">
      <div className="container-site">
        <nav className="mb-6 text-sm text-[#8E8E93]" aria-label="Fil d'Ariane">
          <Link href="/" className="hover:text-[#D4A843]">Accueil</Link>
          {' / '}
          <Link href="/annonces" className="hover:text-[#D4A843]">Annonces</Link>
          {' / '}
          <span className="text-[#EFEFEF]">{annonce.titre}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <AnnonceGallery photos={annonce.photos} titre={annonce.titre} />

            <div className="bg-[#2C2C2E] border border-[#3A3A3C] rounded-2xl p-6">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <Badge className={getStatutColor(annonce.statut)}>{getStatutLabel(annonce.statut)}</Badge>
                    <Badge variant="outline">{annonce.type}</Badge>
                  </div>
                  <h1 className="font-heading text-2xl font-bold text-[#EFEFEF]">{annonce.titre}</h1>
                </div>
                <p className="font-heading text-2xl font-bold text-[#D4A843] whitespace-nowrap">{formatPrice(annonce.prix)}</p>
              </div>

              <div className="flex flex-wrap gap-4 text-[#8E8E93] text-sm mb-6">
                {annonce.localisation && (
                  <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-[#D4A843]" aria-hidden="true" />{annonce.localisation}</span>
                )}
                {annonce.surface && (
                  <span className="flex items-center gap-1.5"><Maximize2 className="h-4 w-4 text-[#D4A843]" aria-hidden="true" />{annonce.surface} m²</span>
                )}
                {annonce.documents.length > 0 && (
                  <span className="flex items-center gap-1.5"><FileCheck className="h-4 w-4 text-[#D4A843]" aria-hidden="true" />{annonce.documents.join(', ')}</span>
                )}
                <span className="flex items-center gap-1.5"><Eye className="h-4 w-4" aria-hidden="true" />{annonce.vues + 1} vue{annonce.vues > 0 ? 's' : ''}</span>
                <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" aria-hidden="true" />Réf. {annonce.reference}</span>
              </div>

              <div className="pt-4 border-t border-[#3A3A3C]">
                <ShareButtons
                  url={`/annonces/${annonce.slug}`}
                  title={`${annonce.titre} — ${formatPrice(annonce.prix)} — Foncier Facile Afrique`}
                  description={annonce.description?.slice(0, 120) ?? annonce.localisation}
                />
              </div>

              {annonce.description && (
                <div>
                  <h2 className="font-heading font-semibold text-[#EFEFEF] text-base mb-3">Description</h2>
                  <p className="text-[#8E8E93] leading-relaxed whitespace-pre-line">{annonce.description}</p>
                </div>
              )}
            </div>

            <div className="rounded-xl overflow-hidden border border-[#3A3A3C]">
              <h2 className="font-heading font-semibold text-[#EFEFEF] text-sm mb-3 px-1">Localisation</h2>
              <MapViewClient annonces={[mapAnnonce]} single />
            </div>

            {similarAnnonces.length > 0 && (
              <div>
                <h2 className="font-heading text-xl font-bold text-[#EFEFEF] mb-4">Biens similaires</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {similarAnnonces.map((a) => (
                    <AnnonceCard key={a.id} annonce={a as AnnonceCardType} />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="bg-[#2C2C2E] border border-[#3A3A3C] rounded-2xl p-6 sticky top-20">
              <h2 className="font-heading font-semibold text-[#EFEFEF] text-base mb-4">Demande d’information</h2>
              <LeadFormAnnonce
                annonceId={annonce.id}
                annonceReference={annonce.reference}
                annonceTitre={annonce.titre}
              />
              <div className="mt-4 pt-4 border-t border-[#3A3A3C] space-y-2">
                <a
                  href={getWhatsAppUrl('22996901204', whatsappMsg)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-[#25D366] text-white font-semibold py-3 rounded-xl hover:bg-[#1DA851] transition-colors"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  WhatsApp
                </a>
                <a
                  href="tel:+22996901204"
                  className="flex items-center justify-center gap-2 w-full border border-[#D4A843] text-[#D4A843] font-semibold py-3 rounded-xl hover:bg-[rgba(212,168,67,0.12)] transition-colors"
                >
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  +229 96 90 12 04
                </a>
              </div>
              <p className="text-xs text-[#8E8E93] text-center mt-3">Réponse sous 24h garantie</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
