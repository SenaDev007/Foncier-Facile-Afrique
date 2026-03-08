import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { BlogPostSchema } from '@/lib/validations'
import { slugify } from '@/lib/utils'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const statut = searchParams.get('statut') ?? 'PUBLIE'
    const tag = searchParams.get('tag')
    const page = Number(searchParams.get('page') ?? '1')
    const limit = Number(searchParams.get('limit') ?? '9')

    const where: Record<string, unknown> = {}
    if (statut && statut !== 'ALL') where.statut = statut
    if (tag) where.tags = { has: tag }

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        include: { auteur: { select: { id: true, name: true } } },
        orderBy: { publishedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.blogPost.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: { posts, total, page, totalPages: Math.ceil(total / limit) },
    })
  } catch (error) {
    console.error('GET /api/blog error:', error)
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
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
    const slug = slugify(data.titre) + '-' + Date.now()

    const post = await prisma.blogPost.create({
      data: {
        ...data,
        slug,
        auteurId: session.user.id,
        publishedAt: data.statut === 'PUBLIE' ? (data.publishedAt ? new Date(data.publishedAt) : new Date()) : data.publishedAt ? new Date(data.publishedAt) : null,
      },
      include: { auteur: { select: { id: true, name: true } } },
    })

    return NextResponse.json({ success: true, data: post }, { status: 201 })
  } catch (error) {
    console.error('POST /api/blog error:', error)
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 })
  }
}
