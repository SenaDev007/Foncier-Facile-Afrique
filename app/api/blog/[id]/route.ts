import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { BlogPostSchema } from '@/lib/validations'
import { slugify } from '@/lib/utils'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { id: params.id },
      include: { auteur: { select: { id: true, name: true } } },
    })

    if (!post) {
      return NextResponse.json({ success: false, error: 'Article introuvable' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: post })
  } catch (error) {
    console.error('GET /api/blog/[id] error:', error)
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth()
    if (!session || !['ADMIN', 'SUPER_ADMIN', 'EDITEUR'].includes(session.user.role)) {
      return NextResponse.json({ success: false, error: 'Non autorisé' }, { status: 401 })
    }

    const body = await req.json()
    const parsed = BlogPostSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0]?.message ?? 'Données invalides' },
        { status: 400 }
      )
    }

    const data = parsed.data
    const existing = await prisma.blogPost.findUnique({ where: { id: params.id }, select: { slug: true, titre: true } })
    const newSlug = existing && existing.titre !== data.titre
      ? slugify(data.titre) + '-' + Date.now()
      : existing?.slug

    const post = await prisma.blogPost.update({
      where: { id: params.id },
      data: {
        ...data,
        slug: newSlug,
        publishedAt: data.statut === 'PUBLIE' && !data.publishedAt ? new Date() : data.publishedAt ? new Date(data.publishedAt) : null,
      },
      include: { auteur: { select: { id: true, name: true } } },
    })

    return NextResponse.json({ success: true, data: post })
  } catch (error) {
    console.error('PUT /api/blog/[id] error:', error)
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth()
    if (!session || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ success: false, error: 'Non autorisé' }, { status: 401 })
    }

    await prisma.blogPost.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true, message: 'Article supprimé' })
  } catch (error) {
    console.error('DELETE /api/blog/[id] error:', error)
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 })
  }
}
