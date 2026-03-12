import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const tx = req.nextUrl.searchParams.get('tx') ?? req.nextUrl.searchParams.get('transaction_id') ?? req.nextUrl.searchParams.get('id')
  if (!tx) {
    return NextResponse.json({ ok: false, error: 'Paramètre tx manquant' }, { status: 400 })
  }

  const commande = await prisma.commandeEbook.findUnique({
    where: { fedapayTxId: String(tx) },
    include: { ebook: { select: { titre: true } } },
  })

  if (!commande) {
    return NextResponse.json({ ok: false, paid: false })
  }

  if (commande.statut !== 'PAYEE') {
    return NextResponse.json({ ok: true, paid: false, statut: commande.statut })
  }

  const baseUrl = process.env.NEXTAUTH_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? ''
  const downloadUrl = baseUrl ? `${baseUrl}/ebooks/telecharger/${commande.tokenDownload}` : null

  return NextResponse.json({
    ok: true,
    paid: true,
    downloadUrl,
    titre: commande.ebook?.titre ?? 'Votre ebook',
  })
}
