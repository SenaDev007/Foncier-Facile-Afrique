import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { AnnonceSchema } from '@/lib/validations'
import { slugify, generateReference } from '@/lib/utils'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type')
    const statut = searchParams.get('statut') ?? 'EN_LIGNE'
    const localisation = searchParams.get('localisation')
    const prixMax = searchParams.get('prixMax')
    const surfaceMin = searchParams.get('surfaceMin')
    const documents = searchParams.getAll('documents')
    const page = Number(searchParams.get('page') ?? '1')
    const limit = Number(searchParams.get('limit') ?? '12')
    const sort = searchParams.get('sort') ?? 'createdAt_desc'

    const [sortField, sortDir] = sort.split('_')
    const orderBy: Record<string, string> = {}
    orderBy[sortField ?? 'createdAt'] = sortDir === 'asc' ? 'asc' : 'desc'

    const where: Record<string, unknown> = {}

    if (statut && statut !== 'ALL') {
      where.statut = statut
    }
    if (type && type !== 'ALL') {
      where.type = type
    }
    if (localisation) {
      where.localisation = { contains: localisation, mode: 'insensitive' }
    }
    if (prixMax) {
      where.prix = { lte: Number(prixMax) }
    }
    if (surfaceMin) {
      where.surface = { gte: Number(surfaceMin) }
    }
    if (documents.length > 0) {
      where.documents = { hasEvery: documents }
    }

    const skip = (page - 1) * limit

    const [annonces, total] = await Promise.all([
      prisma.annonce.findMany({
        where,
        include: { photos: { orderBy: { ordre: 'asc' } } },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.annonce.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: {
        annonces,
        total,
        page,
        totalPages: Math.ceil(total / limit),
        perPage: limit,
      },
    })
  } catch (error) {
    console.error('GET /api/annonces error:', error)
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
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
    const count = await prisma.annonce.count()
    const reference = generateReference(count)
    const slug = slugify(data.titre) + '-' + Date.now()

    const annonce = await prisma.annonce.create({
      data: {
        ...data,
        auteurId: session.user.id,
        reference,
        slug,
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

    return NextResponse.json({ success: true, data: annonce }, { status: 201 })
  } catch (error) {
    console.error('POST /api/annonces error:', error)
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 })
  }
}
