import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin, ROLES_SEJOUR } from '@/lib/api-admin-auth'
import { AdminReservationPatchSchema } from '@/lib/validations'
import { sendReservationConfirmationEmail } from '@/lib/mail'

function formatDateFr(d: Date) {
  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'long',
  }).format(d)
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const gate = await requireAdmin(ROLES_SEJOUR)
  if (!gate.ok) return gate.response
  try {
    const body = await request.json()
    const parsed = AdminReservationPatchSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? 'Données invalides' },
        { status: 400 }
      )
    }

    const prev = await prisma.reservation.findUnique({
      where: { id: params.id },
      include: { logement: { select: { nom: true } } },
    })
    if (!prev) {
      return NextResponse.json({ error: 'Réservation introuvable' }, { status: 404 })
    }

    const data = Object.fromEntries(
      Object.entries(parsed.data).filter(([, v]) => v !== undefined)
    )

    const reservation = await prisma.reservation.update({
      where: { id: params.id },
      data,
      include: { logement: { select: { nom: true, reference: true } } },
    })

    const becameConfirmed =
      parsed.data.statut === 'CONFIRMEE' && prev.statut !== 'CONFIRMEE'

    if (becameConfirmed) {
      try {
        await sendReservationConfirmationEmail({
          email: reservation.email,
          nomVoyageur: reservation.nomVoyageur,
          reference: reservation.reference,
          logementNom: reservation.logement.nom,
          dateArrivee: formatDateFr(reservation.dateArrivee),
          dateDepart: formatDateFr(reservation.dateDepart),
          nbNuits: reservation.nbNuits,
          montantTotal: reservation.montantTotal,
        })
      } catch (e) {
        console.error('Email réservation confirmée:', e)
      }
    }

    return NextResponse.json({ data: reservation })
  } catch (e) {
    console.error('PATCH /api/admin/reservations/[id]', e)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
