import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { createFedaPayTransaction, getFedaPayTransactionToken } from '@/lib/fedapay-ebooks'
import { getServerBaseUrl } from '@/lib/app-url'
import { rateLimit } from '@/lib/utils'

const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

const BodySchema = z.object({
  paymentToken: z.string().min(16, 'Jeton invalide'),
})

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
    if (!rateLimit(rateLimitMap, ip, 10, 60_000)) {
      return NextResponse.json({ error: 'Trop de requêtes' }, { status: 429 })
    }

    const json = await req.json()
    const parsed = BodySchema.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0]?.message ?? 'Données invalides' }, { status: 400 })
    }

    if (!process.env.FEDAPAY_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Paiement en ligne indisponible (configuration FedaPay manquante).' },
        { status: 503 }
      )
    }

    const reservation = await prisma.reservation.findFirst({
      where: {
        paymentToken: parsed.data.paymentToken,
        paymentStatut: 'NON_PAYE',
        statut: { in: ['EN_ATTENTE', 'CONFIRMEE'] },
      },
      include: { logement: { select: { nom: true } } },
    })

    if (!reservation) {
      return NextResponse.json(
        { error: 'Réservation introuvable, déjà payée ou non éligible au paiement en ligne.' },
        { status: 404 }
      )
    }

    const baseUrl = getServerBaseUrl()
    const callbackUrl = `${baseUrl}/sejour/paiement/${parsed.data.paymentToken}?retour=1`

    const montant = Math.max(1, Math.round(reservation.montantTotal))
    const parts = reservation.nomVoyageur.trim().split(/\s+/)
    const firstname = parts[0] ?? 'Client'
    const lastname = parts.slice(1).join(' ') || undefined
    const telDigits = reservation.telephone.replace(/\D/g, '').slice(-8) || '00000000'

    const transaction = await createFedaPayTransaction({
      description: `Séjour FFA — ${reservation.logement.nom} (${reservation.reference})`,
      amount: montant,
      callback_url: callbackUrl,
      customer: {
        firstname,
        lastname,
        email: reservation.email,
        phone_number: { number: telDigits, country: 'BJ' },
      },
    })

    if (!transaction) {
      return NextResponse.json({ error: 'Impossible de créer la transaction de paiement' }, { status: 500 })
    }

    const tokenResult = await getFedaPayTransactionToken(transaction.id)
    if (!tokenResult?.url) {
      return NextResponse.json({ error: "Impossible d'obtenir l'URL de paiement FedaPay" }, { status: 500 })
    }

    await prisma.reservation.update({
      where: { id: reservation.id },
      data: { fedapayTxId: String(transaction.id) },
    })

    return NextResponse.json({ checkoutUrl: tokenResult.url })
  } catch (e) {
    console.error('[reservations/checkout]', e)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
