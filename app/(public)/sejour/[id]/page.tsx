import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'

interface PageProps {
  params: { id: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const logement = await prisma.logement.findFirst({
    where: { id: params.id, deletedAt: null, statut: 'DISPONIBLE' },
    select: { nom: true, ville: true, description: true },
  })
  if (!logement) return { title: 'Logement' }
  return {
    title: `${logement.nom} — Séjour ${logement.ville}`,
    description: logement.description.slice(0, 155),
  }
}

export default async function SejourDetailPage({ params }: PageProps) {
  const logement = await prisma.logement.findFirst({
    where: { id: params.id, deletedAt: null, statut: 'DISPONIBLE' },
    include: { photos: { orderBy: { ordre: 'asc' } } },
  })
  if (!logement) notFound()

  const main = logement.photos[0]

  return (
    <div className="bg-[#1C1C1E] min-h-screen">
      <div className="border-b border-[#5B2C6F]/40 bg-gradient-to-r from-[#5B2C6F]/25 to-transparent">
        <div className="container-site py-10 md:py-14">
          <Link href="/sejour" className="text-sm text-[#C9A0DC] hover:underline mb-4 inline-block">
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
              <div className="absolute inset-0 flex items-center justify-center text-[#5B2C6F] font-heading text-xl">
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
                  <li key={e} className="text-xs px-2 py-1 rounded-full bg-[#5B2C6F]/25 text-[#C9A0DC] border border-[#5B2C6F]/40">
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
              <p className="text-sm text-[#C9A0DC]">
                Note {logement.note.toFixed(1)} / 5 ({logement.nbAvis} avis)
              </p>
            )}
            <p className="text-xs text-[#636366]">
              Vous recevez un e-mail de confirmation de demande ; l’équipe valide puis confirme la réservation
              (paiement en ligne à venir).
            </p>
            <Link
              href="/contact"
              className="block text-center w-full py-3 rounded-xl bg-[#D4A843] text-[#1C1C1E] font-semibold text-sm hover:bg-[#E8B84B]"
            >
              Demander une réservation
            </Link>
          </div>
        </aside>
      </div>
    </div>
  )
}
