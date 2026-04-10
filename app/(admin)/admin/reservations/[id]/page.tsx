import type { Metadata } from 'next'
import { adminPageMetadata } from '@/lib/seo'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Mail, Phone, ExternalLink } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { getServerBaseUrl } from '@/lib/app-url'
import { formatPrice, formatDate } from '@/lib/utils'
import { ReservationAdminActions } from '@/components/admin/ReservationAdminActions'

interface PageProps {
  params: { id: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const r = await prisma.reservation.findUnique({
    where: { id: params.id },
    select: { reference: true, nomVoyageur: true },
  })
  const title = r
    ? `Réservation ${r.reference} — ${r.nomVoyageur} — Admin FFA`
    : 'Détail réservation — Admin FFA'
  return adminPageMetadata({
    title,
    pathname: `/admin/reservations/${params.id}`,
    description: r
      ? `Fiche réservation ${r.reference} — voyageur ${r.nomVoyageur}.`
      : 'Consultation d’une réservation séjour.',
  })
}

const payLabel: Record<string, string> = {
  NON_PAYE: 'Non payé',
  ACOMPTE: 'Acompte',
  PAYE: 'Payé',
}

export default async function AdminReservationDetailPage({ params }: PageProps) {
  const r = await prisma.reservation.findUnique({
    where: { id: params.id },
    include: { logement: true },
  })

  if (!r) notFound()

  const publicBase = getServerBaseUrl()
  const lienPaiementClient = r.paymentToken ? `${publicBase}/sejour/paiement/${r.paymentToken}` : null

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div>
        <Link
          href="/admin/reservations"
          className="inline-flex items-center gap-1 text-sm text-[#8E8E93] hover:text-[#D4A843] transition-colors mb-3"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" /> Retour aux réservations
        </Link>
        <h1 className="font-heading text-2xl font-bold text-[#EFEFEF]">Réservation {r.reference}</h1>
        <p className="text-[#8E8E93] text-sm mt-1">Créée le {formatDate(r.createdAt.toISOString())}</p>
      </div>

      <div className="bg-[#2C2C2E] border border-[#3A3A3C] rounded-xl p-6 space-y-4">
        <h2 className="font-heading font-semibold text-[#EFEFEF]">Logement</h2>
        <p className="text-[#EFEFEF] font-medium">{r.logement.nom}</p>
        <p className="text-sm text-[#8E8E93]">
          {r.logement.reference} · {r.logement.ville}
        </p>
        <a
          href={`/sejour/${r.logement.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm text-[#D4A843] hover:underline"
        >
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          Voir la fiche séjour
        </a>
      </div>

      <div className="bg-[#2C2C2E] border border-[#3A3A3C] rounded-xl p-6 space-y-3">
        <h2 className="font-heading font-semibold text-[#EFEFEF]">Voyageur</h2>
        <p className="text-[#EFEFEF] font-medium">{r.nomVoyageur}</p>
        <div className="flex items-center gap-2 text-sm">
          <Mail className="h-4 w-4 text-[#D4A843] flex-shrink-0" aria-hidden="true" />
          <a href={`mailto:${r.email}`} className="text-[#8E8E93] hover:text-[#D4A843]">
            {r.email}
          </a>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Phone className="h-4 w-4 text-[#D4A843] flex-shrink-0" aria-hidden="true" />
          <a href={`tel:${r.telephone}`} className="text-[#8E8E93] hover:text-[#D4A843]">
            {r.telephone}
          </a>
        </div>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm pt-2">
          <div>
            <dt className="text-[#8E8E93]">Pays</dt>
            <dd className="text-[#EFEFEF]">{r.pays}</dd>
          </div>
          <div>
            <dt className="text-[#8E8E93]">Voyageurs</dt>
            <dd className="text-[#EFEFEF]">{r.nbVoyageurs}</dd>
          </div>
          <div>
            <dt className="text-[#8E8E93]">Arrivée</dt>
            <dd className="text-[#EFEFEF]">{formatDate(r.dateArrivee.toISOString())}</dd>
          </div>
          <div>
            <dt className="text-[#8E8E93]">Départ</dt>
            <dd className="text-[#EFEFEF]">{formatDate(r.dateDepart.toISOString())}</dd>
          </div>
          <div>
            <dt className="text-[#8E8E93]">Nuits</dt>
            <dd className="text-[#EFEFEF]">{r.nbNuits}</dd>
          </div>
          <div>
            <dt className="text-[#8E8E93]">Montant total</dt>
            <dd className="text-[#EFEFEF] font-medium">{formatPrice(r.montantTotal)}</dd>
          </div>
          <div>
            <dt className="text-[#8E8E93]">Frais service</dt>
            <dd className="text-[#EFEFEF]">{formatPrice(r.fraisService)}</dd>
          </div>
          <div>
            <dt className="text-[#8E8E93]">Paiement</dt>
            <dd className="text-[#EFEFEF]">{payLabel[r.paymentStatut] ?? r.paymentStatut}</dd>
          </div>
        </dl>
        {r.demandeSpeciale && (
          <div className="pt-2">
            <dt className="text-[#8E8E93] text-sm">Demande spéciale</dt>
            <dd className="text-[#EFEFEF] text-sm mt-1 whitespace-pre-wrap">{r.demandeSpeciale}</dd>
          </div>
        )}
        {r.transfertAero && <p className="text-sm text-[#D4A843]">Transfert aéroport demandé</p>}
      </div>

      {lienPaiementClient && r.paymentStatut === 'NON_PAYE' && (
        <div className="bg-[#2C2C2E] border border-[#D4A843]/40 rounded-xl p-6 space-y-2">
          <h2 className="font-heading font-semibold text-[#EFEFEF] text-sm">Lien paiement client (FedaPay)</h2>
          <p className="text-xs text-[#8E8E93]">
            À communiquer au voyageur s’il n’a pas reçu l’e-mail. Ne pas partager publiquement.
          </p>
          <p className="text-xs font-mono text-[#D4A843] break-all">{lienPaiementClient}</p>
          {r.fedapayTxId && (
            <p className="text-[10px] text-[#636366]">Dernière transaction FedaPay (id) : {r.fedapayTxId}</p>
          )}
        </div>
      )}

      <ReservationAdminActions
        reservationId={r.id}
        initialStatut={r.statut}
        initialNotesAdmin={r.notesAdmin}
        initialPaymentStatut={r.paymentStatut}
        initialPaymentRef={r.paymentRef}
      />
    </div>
  )
}
