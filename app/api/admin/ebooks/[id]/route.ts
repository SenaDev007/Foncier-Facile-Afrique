import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    const ebook = await prisma.ebook.findUnique({ where: { id: params.id } })
    if (!ebook) return NextResponse.json({ error: 'Ebook introuvable' }, { status: 404 })
    return NextResponse.json(ebook)
  } catch (e) {
    console.error('[admin/ebooks/[id] GET]', e)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const body = await req.json()
    const ebook = await prisma.ebook.update({
      where: { id: params.id },
      data: {
        titre: body.titre,
        slug: body.slug,
        description: body.description ?? '',
        contenu: body.contenu ?? null,
        prixCFA: Number(body.prixCFA) ?? 0,
        prixPromo: body.prixPromo != null ? Number(body.prixPromo) : null,
        codePromo: body.codePromo || null,
        codePromoType: body.codePromoType || null,
        codePromoValeur: body.codePromoValeur != null ? Number(body.codePromoValeur) : null,
        codePromoExpire: body.codePromoExpire ? new Date(body.codePromoExpire) : null,
        codePromoMax: body.codePromoMax != null ? Number(body.codePromoMax) : null,
        couverture: body.couverture ?? '',
        fichierPdf: body.fichierPdf ?? '',
        apercuPdf: body.apercuPdf || null,
        pages: body.pages != null ? Number(body.pages) : null,
        categorie: body.categorie ?? 'Guide foncier',
        auteur: body.auteur ?? 'Foncier Facile Afrique',
        publie: Boolean(body.publie),
        vedette: Boolean(body.vedette),
      },
    })
    return NextResponse.json(ebook)
  } catch (e) {
    console.error('[admin/ebooks/[id] PUT]', e)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
