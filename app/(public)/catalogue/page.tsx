import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { MapPin, Maximize2, FileText, SlidersHorizontal, Search } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Catalogue des biens — Foncier Facile Afrique',
  description:
    'Découvrez notre catalogue de terrains et biens immobiliers sécurisés au Bénin. Transactions transparentes avec titre foncier vérifié.',
}

// ------------------------------------------------------------------
// Types locaux simples (pas d'import Prisma complexe)
// ------------------------------------------------------------------
interface SimplePhoto {
  id: string
  url: string
  alt: string | null
  ordre: number
}

interface SimpleAnnonce {
  id: string
  reference: string
  slug: string
  titre: string
  type: string
  statut: string
  prix: number
  surface: number | null
  localisation: string
  documents: string[]
  vues: number
  photos: SimplePhoto[]
}

// ------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------
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

const ITEMS_PER_PAGE = 12

// ------------------------------------------------------------------
// Composant carte annonce (Server Component, aucun state)
// ------------------------------------------------------------------
function AnnonceCardSimple({ annonce }: { annonce: SimpleAnnonce }) {
  const photo = annonce.photos[0]
  const imgSrc = photo?.url ?? TYPE_IMAGES[annonce.type] ?? '/images/annonces/maison.jpg'
  const hasTF = annonce.documents.includes('TF')

  return (
    <Link
      href={`/annonces/${annonce.slug}`}
      className="group flex flex-col rounded-2xl border border-[#3A3A3C] bg-[#2C2C2E] overflow-hidden hover:border-[#D4A843]/50 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#D4A843]/10 transition-all duration-300"
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-[#3A3A3C] flex-shrink-0">
        <Image
          src={imgSrc}
          alt={photo?.alt ?? annonce.titre}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
            En ligne
          </span>
          <span className="bg-[#1C1C1E]/80 text-[#EFEFEF] text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-sm border border-[#3A3A3C]">
            {TYPES[annonce.type] ?? annonce.type}
          </span>
        </div>

        {hasTF && (
          <div className="absolute top-3 right-3">
            <span className="bg-[#D4A843]/90 text-[#1C1C1E] text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
              <FileText className="h-3.5 w-3.5" />
              TF
            </span>
          </div>
        )}
      </div>

      {/* Contenu */}
      <div className="p-5 flex flex-col flex-1 gap-3">
        <h2 className="font-heading font-semibold text-base leading-tight text-[#EFEFEF] line-clamp-2 group-hover:text-[#D4A843] transition-colors">
          {annonce.titre}
        </h2>

        <p className="text-[#8E8E93] text-sm flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-[#D4A843]" />
          <span className="truncate">{annonce.localisation}</span>
        </p>

        {annonce.surface && (
          <p className="text-[#8E8E93] text-xs flex items-center gap-1.5">
            <Maximize2 className="h-3.5 w-3.5 text-[#D4A843]" />
            {annonce.surface} m²
          </p>
        )}

        <div className="mt-auto pt-4 border-t border-[#3A3A3C] flex items-center justify-between">
          <p className="font-heading font-bold text-lg text-[#D4A843]">
            {formatPrix(annonce.prix)}
          </p>
          <span className="text-[#8E8E93] text-xs">Réf. {annonce.reference}</span>
        </div>
      </div>
    </Link>
  )
}

// ------------------------------------------------------------------
// Page principale — Server Component pur
// ------------------------------------------------------------------
interface PageProps {
  searchParams: {
    type?: string
    localisation?: string
    prixMax?: string
    surfaceMin?: string
    sort?: string
    page?: string
  }
}

export default async function CataloguePage({ searchParams }: PageProps) {
  const currentPage = Math.max(1, parseInt(searchParams.page ?? '1'))
  const skip = (currentPage - 1) * ITEMS_PER_PAGE

  // Construction du filtre Prisma
  const where: any = { statut: 'EN_LIGNE' }
  if (searchParams.type && searchParams.type !== 'ALL') {
    where.type = searchParams.type
  }
  if (searchParams.localisation) {
    where.localisation = { contains: searchParams.localisation, mode: 'insensitive' }
  }
  if (searchParams.prixMax) {
    where.prix = { lte: parseInt(searchParams.prixMax) }
  }
  if (searchParams.surfaceMin) {
    where.surface = { gte: parseInt(searchParams.surfaceMin) }
  }

  // Tri
  const sortMap: Record<string, any> = {
    prix_asc: { prix: 'asc' },
    prix_desc: { prix: 'desc' },
    surface_desc: { surface: 'desc' },
  }
  const orderBy = sortMap[searchParams.sort ?? ''] ?? { createdAt: 'desc' }

  // Requête Prisma avec sélection stricte des champs
  let annonces: SimpleAnnonce[] = []
  let total = 0

  try {
    const [raw, count] = await Promise.all([
      prisma.annonce.findMany({
        where,
        orderBy,
        skip,
        take: ITEMS_PER_PAGE,
        select: {
          id: true,
          reference: true,
          slug: true,
          titre: true,
          type: true,
          statut: true,
          prix: true,
          surface: true,
          localisation: true,
          documents: true,
          vues: true,
          photos: {
            orderBy: { ordre: 'asc' },
            take: 1,
            select: { id: true, url: true, alt: true, ordre: true },
          },
        },
      }),
      prisma.annonce.count({ where }),
    ])

    total = count
    // Extraction champ par champ : aucun objet Prisma, que du JSON natif
    annonces = raw.map((a) => ({
      id: String(a.id),
      reference: String(a.reference),
      slug: String(a.slug),
      titre: String(a.titre),
      type: String(a.type),
      statut: String(a.statut),
      prix: Number(a.prix),
      surface: a.surface !== null ? Number(a.surface) : null,
      localisation: String(a.localisation),
      documents: Array.isArray(a.documents) ? a.documents.map(String) : [],
      vues: Number(a.vues),
      photos: a.photos.map((p) => ({
        id: String(p.id),
        url: String(p.url),
        alt: p.alt ? String(p.alt) : null,
        ordre: Number(p.ordre),
      })),
    }))
  } catch (err) {
    console.error('[CataloguePage] Erreur Prisma:', err)
  }

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE)

  // Helper pour les liens de pagination
  function paginationHref(p: number) {
    const params = new URLSearchParams()
    if (searchParams.type && searchParams.type !== 'ALL') params.set('type', searchParams.type)
    if (searchParams.localisation) params.set('localisation', searchParams.localisation)
    if (searchParams.prixMax) params.set('prixMax', searchParams.prixMax)
    if (searchParams.surfaceMin) params.set('surfaceMin', searchParams.surfaceMin)
    if (searchParams.sort) params.set('sort', searchParams.sort)
    params.set('page', String(p))
    return `/catalogue?${params.toString()}`
  }

  return (
    <div className="bg-[#1C1C1E] min-h-screen">
      {/* ── Hero ── */}
      <section className="relative min-h-[320px] flex items-end border-b border-[#D4A843]/20">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/images/hero/hero-catalogue.jpg"
            alt=""
            fill
            className="object-cover object-center opacity-40"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1E] via-[#1C1C1E]/80 to-transparent" />
        </div>

        <div className="relative z-10 container-site py-16 w-full">
          <p className="text-[#D4A843] text-xs font-semibold uppercase tracking-widest mb-3">
            Pôle achat · Vente
          </p>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-[#EFEFEF] leading-tight">
            Catalogue des biens
          </h1>
          <p className="mt-3 text-[#8E8E93] text-base max-w-xl">
            Terrains &amp; biens immobiliers sécurisés au Bénin — titre foncier vérifié, transactions transparentes.
          </p>
          <div className="mt-5">
            <span className="inline-flex items-center px-4 py-2 rounded-lg bg-[#D4A843]/10 border border-[#D4A843]/20 text-[#D4A843] font-semibold text-sm">
              {total} bien{total > 1 ? 's' : ''} disponible{total > 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </section>

      {/* ── Filtres (Server-rendered) ── */}
      <section className="border-b border-[#3A3A3C] bg-[#1C1C1E]/95 sticky top-0 z-20 backdrop-blur-md">
        <div className="container-site py-4">
          <form method="GET" action="/catalogue" className="flex flex-wrap items-end gap-3">
            {/* Localisation */}
            <div className="flex-1 min-w-[160px]">
              <label className="block text-[#8E8E93] text-xs mb-1.5">Ville / quartier</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8E8E93]" />
                <input
                  name="localisation"
                  defaultValue={searchParams.localisation ?? ''}
                  placeholder="Cotonou, Parakou…"
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#2C2C2E] border border-[#3A3A3C] text-[#EFEFEF] placeholder:text-[#636366] text-sm focus:outline-none focus:border-[#D4A843]"
                />
              </div>
            </div>

            {/* Type */}
            <div className="min-w-[140px]">
              <label className="block text-[#8E8E93] text-xs mb-1.5">Type de bien</label>
              <select
                name="type"
                defaultValue={searchParams.type ?? 'ALL'}
                className="w-full px-3 py-2 rounded-lg bg-[#2C2C2E] border border-[#3A3A3C] text-[#EFEFEF] text-sm focus:outline-none focus:border-[#D4A843]"
              >
                <option value="ALL">Tous les types</option>
                {Object.entries(TYPES).map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
            </div>

            {/* Prix max */}
            <div className="min-w-[140px]">
              <label className="block text-[#8E8E93] text-xs mb-1.5">Prix maximum</label>
              <select
                name="prixMax"
                defaultValue={searchParams.prixMax ?? ''}
                className="w-full px-3 py-2 rounded-lg bg-[#2C2C2E] border border-[#3A3A3C] text-[#EFEFEF] text-sm focus:outline-none focus:border-[#D4A843]"
              >
                <option value="">Sans limite</option>
                <option value="5000000">5 000 000 FCFA</option>
                <option value="10000000">10 000 000 FCFA</option>
                <option value="25000000">25 000 000 FCFA</option>
                <option value="50000000">50 000 000 FCFA</option>
                <option value="100000000">100 000 000 FCFA</option>
              </select>
            </div>

            {/* Surface min */}
            <div className="min-w-[130px]">
              <label className="block text-[#8E8E93] text-xs mb-1.5">Surface min (m²)</label>
              <select
                name="surfaceMin"
                defaultValue={searchParams.surfaceMin ?? ''}
                className="w-full px-3 py-2 rounded-lg bg-[#2C2C2E] border border-[#3A3A3C] text-[#EFEFEF] text-sm focus:outline-none focus:border-[#D4A843]"
              >
                <option value="">Sans limite</option>
                <option value="100">100 m²</option>
                <option value="250">250 m²</option>
                <option value="500">500 m²</option>
                <option value="1000">1 000 m²</option>
                <option value="5000">5 000 m²</option>
              </select>
            </div>

            {/* Tri */}
            <div className="min-w-[140px]">
              <label className="block text-[#8E8E93] text-xs mb-1.5">Trier par</label>
              <select
                name="sort"
                defaultValue={searchParams.sort ?? ''}
                className="w-full px-3 py-2 rounded-lg bg-[#2C2C2E] border border-[#3A3A3C] text-[#EFEFEF] text-sm focus:outline-none focus:border-[#D4A843]"
              >
                <option value="">Plus récent</option>
                <option value="prix_asc">Prix croissant</option>
                <option value="prix_desc">Prix décroissant</option>
                <option value="surface_desc">Surface décroissante</option>
              </select>
            </div>

            {/* Bouton */}
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[#D4A843] hover:bg-[#c2972e] text-[#1C1C1E] font-bold text-sm transition-colors"
            >
              <Search className="h-4 w-4" />
              Rechercher
            </button>

            {/* Reset si filtres actifs */}
            {(searchParams.type || searchParams.localisation || searchParams.prixMax || searchParams.surfaceMin) && (
              <Link
                href="/catalogue"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#3A3A3C] text-[#8E8E93] hover:text-[#EFEFEF] text-sm transition-colors"
              >
                ✕ Réinitialiser
              </Link>
            )}
          </form>
        </div>
      </section>

      {/* ── Grille ── */}
      <main className="container-site py-10">
        {annonces.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <SlidersHorizontal className="h-12 w-12 text-[#3A3A3C] mb-4" />
            <p className="text-[#8E8E93] text-lg mb-4">
              Aucune annonce ne correspond à vos critères.
            </p>
            <Link
              href="/catalogue"
              className="px-5 py-2.5 rounded-xl bg-[#D4A843] text-[#1C1C1E] font-semibold hover:bg-[#c2972e] transition-colors"
            >
              Voir toutes les annonces
            </Link>
          </div>
        ) : (
          <>
            <p className="text-[#8E8E93] text-sm mb-6">
              {total} résultat{total > 1 ? 's' : ''} — page {currentPage}/{totalPages}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {annonces.map((annonce) => (
                <AnnonceCardSimple key={annonce.id} annonce={annonce} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <nav className="flex justify-center items-center gap-2 mt-12" aria-label="Pagination">
                {currentPage > 1 && (
                  <Link
                    href={paginationHref(currentPage - 1)}
                    className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#2C2C2E] border border-[#3A3A3C] text-[#8E8E93] hover:text-[#EFEFEF] hover:border-[#D4A843] transition-colors text-sm"
                    aria-label="Page précédente"
                  >
                    ‹
                  </Link>
                )}

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2)
                  .map((p, idx, arr) => {
                    const prev = arr[idx - 1]
                    return (
                      <>
                        {prev && p - prev > 1 && (
                          <span key={`dots-${p}`} className="text-[#636366] px-1">…</span>
                        )}
                        <Link
                          key={p}
                          href={paginationHref(p)}
                          className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                            p === currentPage
                              ? 'bg-[#D4A843] text-[#1C1C1E] font-bold'
                              : 'bg-[#2C2C2E] border border-[#3A3A3C] text-[#8E8E93] hover:text-[#EFEFEF] hover:border-[#D4A843]'
                          }`}
                          aria-current={p === currentPage ? 'page' : undefined}
                        >
                          {p}
                        </Link>
                      </>
                    )
                  })}

                {currentPage < totalPages && (
                  <Link
                    href={paginationHref(currentPage + 1)}
                    className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#2C2C2E] border border-[#3A3A3C] text-[#8E8E93] hover:text-[#EFEFEF] hover:border-[#D4A843] transition-colors text-sm"
                    aria-label="Page suivante"
                  >
                    ›
                  </Link>
                )}
              </nav>
            )}
          </>
        )}
      </main>
    </div>
  )
}
