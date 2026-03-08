import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { AnnonceSchema } from '@/lib/validations'
import { slugify } from '@/lib/utils'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const annonce = await prisma.annonce.findUnique({
      where: { id: params.id },
      include: {
        photos: { orderBy: { ordre: 'asc' } },
        auteur: { select: { id: true, name: true, email: true } },
      },
    })

    if (!annonce) {
      return NextResponse.json({ success: false, error: 'Annonce introuvable' }, { status: 404 })
    }

    await prisma.annonce.update({
      where: { id: params.id },
      data: { vues: { increment: 1 } },
    })

    return NextResponse.json({ success: true, data: annonce })
  } catch (error) {
    console.error('GET /api/annonces/[id] error:', error)
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth()
    if (!session || !['ADMIN', 'SUPER_ADMIN', 'AGENT'].includes(session.user.role)) {
      return NextResponse.json({ success: false, error: 'Non autorisé' }, { status: 401 })
    }

    const body = await req.json()
    const parsed = AnnonceSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0]?.message ?? 'Données invalides' },
        { status: 400 }
      )
    }

    const data = parsed.data

    const existingSlug = await prisma.annonce.findUnique({ where: { id: params.id }, select: { slug: true, titre: true } })
    const newSlug = existingSlug && existingSlug.titre !== data.titre
      ? slugify(data.titre) + '-' + Date.now()
      : existingSlug?.slug

    await prisma.photo.deleteMany({ where: { annonceId: params.id } })

    const annonce = await prisma.annonce.update({
      where: { id: params.id },
      data: {
        ...data,
        slug: newSlug,
        photos: {
          create: (body.photos ?? []).map((p: { url: string; alt?: string; ordre?: number }, i: number) => ({
            url: p.url,
            alt: p.alt ?? data.titre,
            ordre: p.ordre ?? i,
          })),
        },
      },
      include: { photos: true },
    })

    return NextResponse.json({ success: true, data: annonce })
  } catch (error) {
    console.error('PUT /api/annonces/[id] error:', error)
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth()
    if (!session || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ success: false, error: 'Non autorisé' }, { status: 401 })
    }

    await prisma.annonce.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true, message: 'Annonce supprimée' })
  } catch (error) {
    console.error('DELETE /api/annonces/[id] error:', error)
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 })
  }
}
