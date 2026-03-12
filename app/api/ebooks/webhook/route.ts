import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendMail } from '@/lib/mail'

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json()
    if (payload.name !== 'transaction.approved') {
      return NextResponse.json({ ok: true })
    }

    const txId = String(payload.data?.id ?? payload.entity?.id ?? payload.id)
    if (!txId) return NextResponse.json({ ok: true })

    const commande = await prisma.commandeEbook.findUnique({
      where: { fedapayTxId: txId },
      include: { ebook: true },
    })
    if (!commande) return NextResponse.json({ ok: true })

    await prisma.commandeEbook.update({
      where: { id: commande.id },
      data: { statut: 'PAYEE' },
    })

    if (commande.codePromoUsed) {
      await prisma.ebook.update({
        where: { id: commande.ebookId },
        data: { codePromoUsages: { increment: 1 } },
      })
    }

    const baseUrl = process.env.NEXTAUTH_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
    const lienDownload = `${baseUrl}/ebooks/telecharger/${commande.tokenDownload}`

    try {
      await sendMail({
        to: commande.acheteurEmail,
        subject: `Votre ebook : ${commande.ebook.titre} — Foncier Facile Afrique`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <p>Bonjour ${commande.acheteurNom},</p>
            <p>Votre paiement a bien été reçu. Vous pouvez télécharger votre ebook via le lien ci-dessous (valide 24h, 3 téléchargements max) :</p>
            <p><a href="${lienDownload}" style="color: #D4A843; font-weight: bold;">Télécharger "${commande.ebook.titre}"</a></p>
            <p>Lien direct : ${lienDownload}</p>
            <p>— L'équipe Foncier Facile Afrique</p>
          </div>
        `,
      })
    } catch (mailErr) {
      console.error('[ebooks/webhook] sendMail:', mailErr)
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[ebooks/webhook]', error)
    return NextResponse.json({ ok: true })
  }
}
