import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createFedaPayTransaction, getFedaPayTransactionToken } from '@/lib/fedapay-ebooks'

export async function POST(req: NextRequest) {
  try {
    const { ebookId, nom, email, tel, codePromo } = await req.json()

    const ebook = await prisma.ebook.findUnique({ where: { id: ebookId } })
    if (!ebook || !ebook.publie) {
      return NextResponse.json({ error: 'Ebook introuvable' }, { status: 404 })
    }

    let montant = ebook.prixPromo ?? ebook.prixCFA
    let codeUsed: string | null = null

    if (codePromo && ebook.codePromo === codePromo) {
      const now = new Date()
      const valide =
        (!ebook.codePromoExpire || ebook.codePromoExpire > now) &&
        (!ebook.codePromoMax || ebook.codePromoUsages < ebook.codePromoMax)
      if (valide) {
        if (ebook.codePromoType === 'FIXE') {
          montant = Math.max(0, montant - (ebook.codePromoValeur ?? 0))
        }
        if (ebook.codePromoType === 'POURCENTAGE') {
          montant = Math.round(montant * (1 - (ebook.codePromoValeur ?? 0) / 100))
        }
        codeUsed = codePromo
      }
    }

    const baseUrl = process.env.NEXTAUTH_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
    const transaction = await createFedaPayTransaction({
      description: `Achat ebook : ${ebook.titre}`,
      amount: montant,
      callback_url: `${baseUrl}/ebooks/merci`,
      customer: {
        firstname: nom.split(' ')[0] ?? nom,
        lastname: nom.split(' ').slice(1).join(' ') || undefined,
        email,
        phone_number: { number: (tel || '').replace(/\D/g, '').slice(-8) || '00000000', country: 'BJ' },
      },
    })

    if (!transaction) {
      return NextResponse.json({ error: 'Impossible de créer le paiement' }, { status: 500 })
    }

    const tokenResult = await getFedaPayTransactionToken(transaction.id)
    if (!tokenResult?.url) {
      return NextResponse.json({ error: 'Impossible d\'obtenir l\'URL de paiement' }, { status: 500 })
    }

    const tokenExpire = new Date(Date.now() + 24 * 60 * 60 * 1000)
    await prisma.commandeEbook.create({
      data: {
        ebookId: ebook.id,
        acheteurNom: nom,
        acheteurEmail: email,
        acheteurTel: tel ?? '',
        montantPaye: montant,
        codePromoUsed: codeUsed,
        fedapayTxId: String(transaction.id),
        statut: 'EN_ATTENTE',
        tokenExpire,
      },
    })

    return NextResponse.json({ checkoutUrl: tokenResult.url })
  } catch (error) {
    console.error('[ebooks/checkout]', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
