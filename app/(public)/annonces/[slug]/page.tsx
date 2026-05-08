import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { MapPin, Maximize2, FileCheck, Eye, Phone, ArrowLeft } from 'lucide-react'

// ─────────────────────────────────────────────────────────────────
// Types locaux simples (aucun import Prisma complexe)
// ─────────────────────────────────────────────────────────────────
interface SimplePhoto {
  id: string
  url: string
  alt: string | null
  ordre: number
}

interface DetailAnnonce {
  id: string
  reference: string
  slug: string
  titre: string
  description: string | null
  type: string
  statut: string
  prix: number
  surface: number | null
  localisation: string
  departement: string | null
  commune: string | null
  quartier: string | null
  documents: string[]
  modalitesPrix: string | null
  vues: number
  photos: SimplePhoto[]
}

interface SimilarAnnonce {
  id: string
  slug: string
  titre: string
  type: string
  prix: number
  surface: number | null
  localisation: string
  documents: string[]
  photo: SimplePhoto | null
}

// ─────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────
const TYPES: Record<string, string> = {
  TERRAIN: 'Terrain',
  APPARTEMENT: 'Appartement',
  MAISON: 'Maison',
  VILLA: 'Villa',
  BUREAU: 'Bureau',
  COMMERCE: 'Commerce',
}

const TYPE_IMAGES: Record<string, string> = {
  TERRAIN: '/images/annonces/terrain.jpg',
  MAISON: '/images/annonces/maison.jpg',
  APPARTEMENT: '/images/annonces/appartement.jpg',
  VILLA: '/images/annonces/villa.jpg',
  BUREAU: '/images/annonces/bureau.jpg',
  COMMERCE: '/images/annonces/commerce.jpg',
}

function formatPrix(prix: number) {
  return new Intl.NumberFormat('fr-FR').format(prix) + ' FCFA'
}

// ─────────────────────────────────────────────────────────────────
// Metadata
// ─────────────────────────────────────────────────────────────────
interface PageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const a = await prisma.annonce.findUnique({
      where: { slug: params.slug },
      select: { titre: true, description: true, localisation: true, photos: { take: 1, select: { url: true } } },
    })
    if (!a) return { title: 'Annonce introuvable' }
    return {
      title: `${a.titre} | Foncier Facile Afrique`,
      description: a.description?.slice(0, 160) ?? `${a.titre} — ${a.localisation}`,
      openGraph: a.photos[0] ? { images: [a.photos[0].url] } : undefined,
    }
  } catch {
    return { title: 'Annonce | Foncier Facile Afrique' }
  }
}

// ─────────────────────────────────────────────────────────────────
// Page principale — Server Component pur, aucun state
// ─────────────────────────────────────────────────────────────────
export default async function AnnonceDetailPage({ params }: PageProps) {
  let annonce: DetailAnnonce | null = null
  let similar: SimilarAnnonce[] = []

  try {
    const raw = await prisma.annonce.findUnique({
      where: { slug: params.slug },
      select: {
        id: true,
        reference: true,
        slug: true,
        titre: true,
        description: true,
        type: true,
        statut: true,
        prix: true,
        surface: true,
        localisation: true,
        departement: true,
        commune: true,
        quartier: true,
        documents: true,
        modalitesPrix: true,
        vues: true,
        photos: {
          orderBy: { ordre: 'asc' },
          select: { id: true, url: true, alt: true, ordre: true },
        },
      },
    })

    if (!raw || raw.statut !== 'EN_LIGNE') notFound()

    annonce = {
      id: String(raw.id),
      reference: String(raw.reference),
      slug: String(raw.slug),
      titre: String(raw.titre),
      description: raw.description ? String(raw.description) : null,
      type: String(raw.type),
      statut: String(raw.statut),
      prix: Number(raw.prix),
      surface: raw.surface !== null ? Number(raw.surface) : null,
      localisation: String(raw.localisation),
      departement: raw.departement ? String(raw.departement) : null,
      commune: raw.commune ? String(raw.commune) : null,
      quartier: raw.quartier ? String(raw.quartier) : null,
      documents: Array.isArray(raw.documents) ? raw.documents.map(String) : [],
      modalitesPrix: raw.modalitesPrix ? String(raw.modalitesPrix) : null,
      vues: Number(raw.vues),
      photos: raw.photos.map((p) => ({
        id: String(p.id),
        url: String(p.url),
        alt: p.alt ? String(p.alt) : null,
        ordre: Number(p.ordre),
      })),
    }

    const rawSimilar = await prisma.annonce.findMany({
      where: { statut: 'EN_LIGNE', id: { not: raw.id }, type: raw.type },
      orderBy: { createdAt: 'desc' },
      take: 3,
      select: {
        id: true,
        slug: true,
        titre: true,
        type: true,
        prix: true,
        surface: true,
        localisation: true,
        documents: true,
        photos: { take: 1, select: { id: true, url: true, alt: true, ordre: true } },
      },
    })

    similar = rawSimilar.map((a) => ({
      id: String(a.id),
      slug: String(a.slug),
      titre: String(a.titre),
      type: String(a.type),
      prix: Number(a.prix),
      surface: a.surface !== null ? Number(a.surface) : null,
      localisation: String(a.localisation),
      documents: Array.isArray(a.documents) ? a.documents.map(String) : [],
      photo: a.photos[0]
        ? {
            id: String(a.photos[0].id),
            url: String(a.photos[0].url),
            alt: a.photos[0].alt ? String(a.photos[0].alt) : null,
            ordre: Number(a.photos[0].ordre),
          }
        : null,
    }))
  } catch (err) {
    console.error('[AnnonceDetailPage]', err)
    notFound()
  }

  if (!annonce) notFound()

  const whatsappMsg = encodeURIComponent(
    `Bonjour, je suis intéressé(e) par l'annonce "${annonce.titre}" (Réf. ${annonce.reference}). Pouvez-vous me contacter ?`
  )

  return (
    <div className="bg-[#1C1C1E] min-h-screen pb-16">
      <div className="container-site pt-8">
        {/* Fil d'Ariane */}
        <nav className="flex items-center gap-2 text-sm text-[#8E8E93] mb-8">
          <Link href="/" className="hover:text-[#D4A843] transition-colors">Accueil</Link>
          <span>/</span>
          <Link href="/catalogue" className="hover:text-[#D4A843] transition-colors flex items-center gap-1">
            <ArrowLeft className="h-3.5 w-3.5" />
            Catalogue
          </Link>
          <span>/</span>
          <span className="text-[#EFEFEF] truncate max-w-[240px]">{annonce.titre}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Galerie photos */}
            <div className="rounded-2xl overflow-hidden bg-[#2C2C2E] border border-[#3A3A3C]">
              {annonce.photos.length === 0 ? (
                // Aucune photo backoffice → image par défaut selon le type
                <div className="col-span-2 relative h-80">
                  <Image
                    src={TYPE_IMAGES[annonce.type] ?? '/images/annonces/maison.jpg'}
                    alt={annonce.titre}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, 66vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <span className="absolute bottom-3 left-3 text-xs text-white/60 bg-black/40 px-2 py-1 rounded">Photo illustrative</span>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-1">
                  <div className="col-span-2 relative h-80">
                    <Image
                      src={annonce.photos[0].url}
                      alt={annonce.photos[0].alt ?? annonce.titre}
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 768px) 100vw, 66vw"
                    />
                  </div>
                  {annonce.photos.slice(1, 5).map((photo) => (
                    <div key={photo.id} className="relative h-36">
                      <Image
                        src={photo.url}
                        alt={photo.alt ?? annonce!.titre}
                        fill
                        className="object-cover"
                        sizes="33vw"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Informations */}
            <div className="bg-[#2C2C2E] border border-[#3A3A3C] rounded-2xl p-6">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold px-3 py-1 rounded-full">
                  En ligne
                </span>
                <span className="bg-[#3A3A3C] text-[#8E8E93] text-xs font-medium px-3 py-1 rounded-full">
                  {TYPES[annonce.type] ?? annonce.type}
                </span>
              </div>

              <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
                <h1 className="font-heading text-2xl font-bold text-[#EFEFEF] flex-1">{annonce.titre}</h1>
                <p className="font-heading text-2xl font-bold text-[#D4A843] whitespace-nowrap">
                  {formatPrix(annonce.prix)}
                </p>
              </div>

              <div className="flex flex-wrap gap-4 text-[#8E8E93] text-sm mb-6 pb-6 border-b border-[#3A3A3C]">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-[#D4A843]" />
                  {annonce.localisation}
                </span>
                {annonce.surface && (
                  <span className="flex items-center gap-1.5">
                    <Maximize2 className="h-4 w-4 text-[#D4A843]" />
                    {annonce.surface} m²
                  </span>
                )}
                {annonce.documents.length > 0 && (
                  <span className="flex items-center gap-1.5">
                    <FileCheck className="h-4 w-4 text-[#D4A843]" />
                    {annonce.documents.join(', ')}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Eye className="h-4 w-4" />
                  {annonce.vues} vue{annonce.vues > 1 ? 's' : ''}
                </span>
              </div>

              {/* ── Boutons de partage réseaux sociaux ── */}
              <div className="mb-6 pb-6 border-b border-[#3A3A3C]">
                <p className="text-[#8E8E93] text-xs font-semibold uppercase tracking-wider mb-3">
                  Partager cette annonce
                </p>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://www.foncierfacileafrique.fr/annonces/${annonce.slug}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1877F2]/15 border border-[#1877F2]/30 text-[#1877F2] hover:bg-[#1877F2] hover:text-white transition-all text-xs font-semibold"
                    aria-label="Partager sur Facebook"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Facebook
                  </a>

                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(`https://www.foncierfacileafrique.fr/annonces/${annonce.slug}`)}&text=${encodeURIComponent(annonce.titre)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#3A3A3C] border border-[#636366]/40 text-[#EFEFEF] hover:bg-[#D4A843] hover:text-[#1C1C1E] hover:border-[#D4A843] transition-all text-xs font-semibold"
                    aria-label="Partager sur Twitter / X"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.26 5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    Twitter / X
                  </a>

                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(`${annonce.titre} — ${formatPrix(annonce.prix)}\nhttps://www.foncierfacileafrique.fr/annonces/${annonce.slug}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#25D366]/15 border border-[#25D366]/30 text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all text-xs font-semibold"
                    aria-label="Partager sur WhatsApp"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    WhatsApp
                  </a>

                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://www.foncierfacileafrique.fr/annonces/${annonce.slug}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0A66C2]/15 border border-[#0A66C2]/30 text-[#0A66C2] hover:bg-[#0A66C2] hover:text-white transition-all text-xs font-semibold"
                    aria-label="Partager sur LinkedIn"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    LinkedIn
                  </a>
                </div>
              </div>

              {annonce.description && (
                <div>
                  <h2 className="font-heading font-semibold text-[#EFEFEF] text-base mb-3">Description</h2>
                  <p className="text-[#8E8E93] leading-relaxed whitespace-pre-line text-sm">{annonce.description}</p>
                </div>
              )}

              {annonce.modalitesPrix && (
                <div className="mt-5 p-4 rounded-xl bg-[#D4A843]/10 border border-[#D4A843]/20">
                  <p className="text-[#D4A843] text-sm font-medium">Modalités : {annonce.modalitesPrix}</p>
                </div>
              )}
            </div>

            {/* Annonces similaires */}
            {similar.length > 0 && (
              <div>
                <h2 className="font-heading text-xl font-bold text-[#EFEFEF] mb-4">Biens similaires</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {similar.map((a) => (
                    <Link
                      key={a.id}
                      href={`/annonces/${a.slug}`}
                      className="group flex flex-col rounded-xl border border-[#3A3A3C] bg-[#2C2C2E] overflow-hidden hover:border-[#D4A843]/50 transition-all duration-200"
                    >
                      <div className="relative h-36 bg-[#3A3A3C]">
                        <Image
                          src={a.photo?.url ?? TYPE_IMAGES[a.type] ?? '/images/annonces/maison.jpg'}
                          alt={a.photo?.alt ?? a.titre}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="33vw"
                        />
                      </div>
                      <div className="p-3">
                        <p className="text-[#EFEFEF] font-medium text-sm line-clamp-2 group-hover:text-[#D4A843] transition-colors">
                          {a.titre}
                        </p>
                        <p className="text-[#D4A843] font-bold text-sm mt-1">{formatPrix(a.prix)}</p>
                        <p className="text-[#8E8E93] text-xs mt-0.5">{a.localisation}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar contact */}
          <div className="space-y-4">
            <div className="bg-[#2C2C2E] border border-[#3A3A3C] rounded-2xl p-6 sticky top-20">
              <h2 className="font-heading font-semibold text-[#EFEFEF] text-base mb-5">
                Contacter l'agence
              </h2>

              <a
                href={`https://wa.me/22996901204?text=${whatsappMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-[#D4A843] text-[#1C1C1E] font-bold py-3 rounded-xl hover:bg-[#c2972e] transition-colors mb-3"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                WhatsApp
              </a>

              <a
                href="tel:+22996901204"
                className="flex items-center justify-center gap-2 w-full border border-[#D4A843] text-[#D4A843] font-semibold py-3 rounded-xl hover:bg-[#D4A843]/10 transition-colors mb-5"
              >
                <Phone className="h-4 w-4" />
                +229 96 90 12 04
              </a>

              <p className="text-xs text-[#8E8E93] text-center mb-5">Réponse sous 24h garantie</p>

              <div className="border-t border-[#3A3A3C] pt-5 space-y-3">
                <h3 className="text-[#8E8E93] text-xs font-semibold uppercase tracking-wider mb-3">Détails</h3>
                <div className="flex justify-between text-sm">
                  <span className="text-[#8E8E93]">Type</span>
                  <span className="text-[#EFEFEF] font-medium">{TYPES[annonce.type] ?? annonce.type}</span>
                </div>
                {annonce.surface && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[#8E8E93]">Surface</span>
                    <span className="text-[#EFEFEF] font-medium">{annonce.surface} m²</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-[#8E8E93]">Ville</span>
                  <span className="text-[#EFEFEF] font-medium text-right max-w-[160px]">{annonce.localisation}</span>
                </div>
                {annonce.documents.length > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[#8E8E93]">Documents</span>
                    <span className="text-[#D4A843] font-semibold">{annonce.documents.join(', ')}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm pt-2 border-t border-[#3A3A3C]">
                  <span className="text-[#8E8E93]">Prix</span>
                  <span className="text-[#D4A843] font-bold">{formatPrix(annonce.prix)}</span>
                </div>
                <div className="flex justify-between text-xs text-[#636366]">
                  <span>Référence</span>
                  <span>{annonce.reference}</span>
                </div>
              </div>

              <div className="border-t border-[#3A3A3C] pt-5 mt-5">
                <p className="text-[#8E8E93] text-xs font-semibold uppercase tracking-wider mb-3">Partager</p>
                <div className="flex gap-2">
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://www.foncierfacileafrique.fr/annonces/${annonce.slug}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center py-2 rounded-lg bg-[#3A3A3C] text-[#8E8E93] hover:bg-[#D4A843] hover:text-[#1C1C1E] transition-colors text-xs font-medium"
                  >
                    Facebook
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(`https://www.foncierfacileafrique.fr/annonces/${annonce.slug}`)}&text=${encodeURIComponent(annonce.titre)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center py-2 rounded-lg bg-[#3A3A3C] text-[#8E8E93] hover:bg-[#D4A843] hover:text-[#1C1C1E] transition-colors text-xs font-medium"
                  >
                    Twitter / X
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
