import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendReservationPaymentReceivedEmail } from '@/lib/mail'

/**
 * Webhook FedaPay — à configurer dans le dashboard FedaPay (même principe que /api/ebooks/webhook).
 * Événement attendu : transaction.approved
 */
export async function POST(req: NextRequest) {
  try {
    const payload = await req.json()
    if (payload.name !== 'transaction.approved') {
      return NextResponse.json({ ok: true })
    }

    const txId = String(payload.data?.id ?? payload.entity?.id ?? payload.id ?? '')
    if (!txId) return NextResponse.json({ ok: true })

    const reservation = await prisma.reservation.findFirst({
      where: { fedapayTxId: txId },
      include: { logement: { select: { nom: true } } },
    })
    if (!reservation) return NextResponse.json({ ok: true })

    if (reservation.paymentStatut === 'PAYE') {
      return NextResponse.json({ ok: true })
    }

    const paymentRef =
      typeof payload.data?.reference === 'string'
        ? payload.data.reference
        : typeof payload.entity?.reference === 'string'
          ? payload.entity.reference
          : txId

    await prisma.reservation.update({
      where: { id: reservation.id },
      data: {
        paymentStatut: 'PAYE',
        paymentRef,
      },
    })

    try {
      await sendReservationPaymentReceivedEmail({
        email: reservation.email,
        nomVoyageur: reservation.nomVoyageur,
        reference: reservation.reference,
        logementNom: reservation.logement.nom,
        montantTotal: reservation.montantTotal,
      })
    } catch (mailErr) {
      console.error('[reservations/webhook] sendMail:', mailErr)
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[reservations/webhook]', error)
    return NextResponse.json({ ok: true })
  }
}
