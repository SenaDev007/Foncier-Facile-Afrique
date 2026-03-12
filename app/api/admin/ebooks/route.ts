import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

function slugify(titre: string): string {
  return titre
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    const ebooks = await prisma.ebook.findMany({
      include: { _count: { select: { commandes: true } } },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(ebooks)
  } catch (e) {
    console.error('[admin/ebooks GET]', e)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const body = await req.json()
    const slug = body.slug || slugify(body.titre) + '-' + Date.now().toString(36)
    const existing = await prisma.ebook.findUnique({ where: { slug } })
    const finalSlug = existing ? slug + '-' + Date.now().toString(36) : slug

    const ebook = await prisma.ebook.create({
      data: {
        titre: body.titre,
        slug: finalSlug,
        description: body.description ?? '',
        contenu: body.contenu ?? null,
        prixCFA: Number(body.prixCFA) || 0,
        prixPromo: body.prixPromo != null ? Number(body.prixPromo) : null,
        codePromo: body.codePromo || null,
        codePromoType: body.codePromoType || null,
        codePromoValeur: body.codePromoValeur != null ? Number(body.codePromoValeur) : null,
        codePromoExpire: body.codePromoExpire ? new Date(body.codePromoExpire) : null,
        codePromoMax: body.codePromoMax != null ? Number(body.codePromoMax) : null,
        couverture: body.couverture || '',
        fichierPdf: body.fichierPdf || '',
        apercuPdf: body.apercuPdf || null,
        pages: body.pages != null ? Number(body.pages) : null,
        categorie: body.categorie || 'Guide foncier',
        auteur: body.auteur || 'Foncier Facile Afrique',
        publie: Boolean(body.publie),
        vedette: Boolean(body.vedette),
      },
    })
    return NextResponse.json(ebook, { status: 201 })
  } catch (e) {
    console.error('[admin/ebooks POST]', e)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
