import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { ebookId, code } = await req.json()
    const ebook = await prisma.ebook.findUnique({ where: { id: ebookId } })
    if (!ebook || ebook.codePromo !== code) {
      return NextResponse.json({ valide: false })
    }

    const now = new Date()
    const expireOk = !ebook.codePromoExpire || ebook.codePromoExpire > now
    const usageOk = !ebook.codePromoMax || ebook.codePromoUsages < ebook.codePromoMax
    if (!expireOk || !usageOk) {
      return NextResponse.json({ valide: false, raison: 'Code expiré ou épuisé' })
    }

    let nouveauPrix = ebook.prixPromo ?? ebook.prixCFA
    if (ebook.codePromoType === 'FIXE') {
      nouveauPrix = Math.max(0, nouveauPrix - (ebook.codePromoValeur ?? 0))
    }
    if (ebook.codePromoType === 'POURCENTAGE') {
      nouveauPrix = Math.round(nouveauPrix * (1 - (ebook.codePromoValeur ?? 0) / 100))
    }

    return NextResponse.json({
      valide: true,
      nouveauPrix,
      remise: ebook.codePromoType,
      valeur: ebook.codePromoValeur,
    })
  } catch (error) {
    console.error('[ebooks/promo/verify]', error)
    return NextResponse.json({ valide: false })
  }
}
