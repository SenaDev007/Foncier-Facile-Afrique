import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'
import { publicPageMetadata } from '@/lib/seo'
import { SejourPaiementButton } from '@/components/public/SejourPaiementButton'

interface PageProps {
  params: { token: string }
  searchParams: { retour?: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return publicPageMetadata({
    title: 'Paiement réservation',
    description:
      'Page sécurisée de paiement pour votre réservation séjour — Foncier Facile Afrique.',
    pathname: `/sejour/paiement/${params.token}`,
    noindex: true,
  })
}

export default async function SejourPaiementPage({ params, searchParams }: PageProps) {
  const reservation = await prisma.reservation.findFirst({
    where: { paymentToken: params.token },
    include: { logement: { select: { nom: true, reference: true, ville: true } } },
  })

  if (!reservation) notFound()

  const paye = reservation.paymentStatut === 'PAYE'
  const peutPayer =
    !paye && (reservation.statut === 'EN_ATTENTE' || reservation.statut === 'CONFIRMEE')

  return (
    <div className="bg-[#1C1C1E] min-h-screen">
      <div className="container-site py-10 md:py-14 max-w-lg mx-auto space-y-6">
        <Link href="/sejour" className="text-sm text-[#D4A843] hover:underline inline-block">
          ← Séjour & tourisme
        </Link>

        <h1 className="font-heading text-2xl font-bold text-[#EFEFEF]">Paiement sécurisé</h1>

        {searchParams.retour === '1' && !paye && (
          <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
            Si vous venez de payer sur FedaPay, le statut se met à jour sous quelques instants. Actualisez cette page
            dans une minute ou vérifiez votre boîte mail.
          </div>
        )}

        {paye ? (
          <div className="rounded-2xl border border-[#D4A843]/40 bg-[#D4A843]/10 p-6 text-center space-y-3">
            <p className="text-[#E8B84B] font-semibold">Paiement enregistré</p>
            <p className="text-sm text-[#8E8E93]">
              Référence <span className="text-[#EFEFEF] font-mono">{reservation.reference}</span> — merci ! L’équipe
              vous confirme le séjour si besoin.
            </p>
            <Link
              href="/sejour"
              className="inline-block mt-2 text-sm text-[#D4A843] hover:underline"
            >
              Retour aux logements
            </Link>
          </div>
        ) : (
          <>
            <div className="rounded-2xl border border-[#3A3A3C] bg-[#2C2C2E] p-6 space-y-3 text-sm">
              <p className="text-[#8E8E93]">Réservation</p>
              <p className="font-mono text-[#D4A843]">{reservation.reference}</p>
              <p className="text-[#EFEFEF] font-medium">{reservation.logement.nom}</p>
              <p className="text-[#8E8E93]">{reservation.logement.ville}</p>
              <hr className="border-[#3A3A3C]" />
              <p className="text-[#8E8E93]">
                Arrivée : {reservation.dateArrivee.toLocaleDateString('fr-FR')} — Départ :{' '}
                {reservation.dateDepart.toLocaleDateString('fr-FR')}
              </p>
              <p className="text-[#8E8E93]">
                {reservation.nbNuits} nuit{reservation.nbNuits > 1 ? 's' : ''} · {reservation.nbVoyageurs}{' '}
                voyageur(s)
              </p>
              <p className="text-xl font-heading font-bold text-[#D4A843] pt-2">
                {formatPrice(reservation.montantTotal)}
              </p>
            </div>

            {peutPayer ? (
              <div className="space-y-3">
                <SejourPaiementButton paymentToken={params.token} />
                <p className="text-xs text-[#636366] text-center">
                  Paiement via FedaPay (sandbox ou live selon votre configuration). Commission et moyens de paiement
                  gérés par FedaPay.
                </p>
              </div>
            ) : (
              <p className="text-sm text-amber-200/90">
                Cette réservation n’est plus éligible au paiement en ligne (statut : {reservation.statut}). Contactez
                l’équipe au +229 96 90 12 04.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  )
}
