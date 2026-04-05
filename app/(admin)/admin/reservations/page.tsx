import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatPrice, formatDate } from '@/lib/utils'

export const metadata: Metadata = { title: 'Réservations — Admin FFA' }

const statutClass: Record<string, string> = {
  EN_ATTENTE: 'bg-amber-500/20 text-amber-300',
  CONFIRMEE: 'bg-emerald-500/20 text-emerald-300',
  EN_COURS: 'bg-blue-500/20 text-blue-300',
  TERMINEE: 'bg-[#3A3A3C] text-[#8E8E93]',
  ANNULEE: 'bg-red-500/20 text-red-300',
}

const statutLabel: Record<string, string> = {
  EN_ATTENTE: 'En attente',
  CONFIRMEE: 'Confirmée',
  EN_COURS: 'En cours',
  TERMINEE: 'Terminée',
  ANNULEE: 'Annulée',
}

export default async function AdminReservationsPage() {
  const reservations = await prisma.reservation.findMany({
    include: {
      logement: { select: { id: true, nom: true, reference: true, ville: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 200,
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-[#EFEFEF]">Réservations</h1>
        <p className="text-[#8E8E93] text-sm mt-1">{reservations.length} réservation{reservations.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="rounded-xl border border-[#3A3A3C] overflow-hidden bg-[#2C2C2E]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#3A3A3C] text-left text-[#8E8E93]">
                <th className="p-3 font-medium">Réf.</th>
                <th className="p-3 font-medium">Voyageur</th>
                <th className="p-3 font-medium">Logement</th>
                <th className="p-3 font-medium">Dates</th>
                <th className="p-3 font-medium">Montant</th>
                <th className="p-3 font-medium">Statut</th>
                <th className="p-3 font-medium w-24"></th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((r) => (
                <tr key={r.id} className="border-b border-[#3A3A3C]/80 hover:bg-[#1C1C1E]/40">
                  <td className="p-3 font-mono text-xs text-[#D4A843]">{r.reference}</td>
                  <td className="p-3">
                    <div className="text-[#EFEFEF] font-medium">{r.nomVoyageur}</div>
                    <div className="text-xs text-[#8E8E93]">{r.email}</div>
                  </td>
                  <td className="p-3 text-[#8E8E93]">
                    <div>{r.logement.nom}</div>
                    <div className="text-xs">{r.logement.ville}</div>
                  </td>
                  <td className="p-3 text-[#8E8E93] text-xs">
                    {formatDate(r.dateArrivee.toISOString())} → {formatDate(r.dateDepart.toISOString())}
                    <div className="text-[#636366]">{r.nbNuits} nuit{r.nbNuits !== 1 ? 's' : ''}</div>
                  </td>
                  <td className="p-3 text-[#EFEFEF]">{formatPrice(r.montantTotal)}</td>
                  <td className="p-3">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${statutClass[r.statut] ?? 'bg-[#3A3A3C]'}`}
                    >
                      {statutLabel[r.statut] ?? r.statut}
                    </span>
                  </td>
                  <td className="p-3">
                    <Link href={`/admin/reservations/${r.id}`} className="text-xs text-[#D4A843] hover:underline font-medium">
                      Détail
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {reservations.length === 0 && (
          <p className="p-8 text-center text-[#8E8E93] text-sm">Aucune réservation pour le moment.</p>
        )}
      </div>
    </div>
  )
}
