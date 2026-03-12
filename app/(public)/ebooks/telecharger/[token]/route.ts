import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

export async function GET(
  _req: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const token = params.token
    const commande = await prisma.commandeEbook.findUnique({
      where: { tokenDownload: token },
      include: { ebook: true },
    })

    if (!commande) {
      return NextResponse.json({ error: 'Lien invalide' }, { status: 404 })
    }
    if (commande.statut !== 'PAYEE') {
      return NextResponse.json({ error: 'Paiement non confirmé' }, { status: 403 })
    }
    if (commande.tokenExpire < new Date()) {
      return NextResponse.json({ error: 'Lien expiré' }, { status: 410 })
    }
    if (commande.downloadCount >= commande.maxDownloads) {
      return NextResponse.json(
        { error: 'Limite de téléchargements atteinte' },
        { status: 403 }
      )
    }

    await prisma.commandeEbook.update({
      where: { id: commande.id },
      data: { downloadCount: { increment: 1 } },
    })

    const filePath = join(process.cwd(), 'private', 'ebooks', commande.ebook.fichierPdf)
    if (!existsSync(filePath)) {
      console.error('[ebooks/telecharger] Fichier introuvable:', filePath)
      return NextResponse.json({ error: 'Fichier introuvable' }, { status: 404 })
    }

    const fileBuffer = readFileSync(filePath)
    const fileName = encodeURIComponent(commande.ebook.titre.replace(/\.pdf$/i, '')) + '.pdf'

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    })
  } catch (error) {
    console.error('[ebooks/telecharger]', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
