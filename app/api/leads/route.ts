import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { LeadSchema } from '@/lib/validations'
import { sendLeadNotification } from '@/lib/mail'
import { rateLimit } from '@/lib/utils'

const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ success: false, error: 'Non autorisé' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const statut = searchParams.get('statut')
    const agentId = searchParams.get('agentId')
    const page = Number(searchParams.get('page') ?? '1')
    const limit = Number(searchParams.get('limit') ?? '20')

    const where: Record<string, unknown> = {}
    if (statut && statut !== 'ALL') where.statut = statut
    if (agentId) where.agentId = agentId

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        include: {
          annonce: { select: { id: true, reference: true, titre: true } },
          agent: { select: { id: true, name: true } },
          interactions: { orderBy: { createdAt: 'desc' } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.lead.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: { leads, total, page, totalPages: Math.ceil(total / limit) },
    })
  } catch (error) {
    console.error('GET /api/leads error:', error)
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
    if (!rateLimit(rateLimitMap, ip, 5, 60_000)) {
      return NextResponse.json({ success: false, error: 'Trop de requêtes' }, { status: 429 })
    }

    const body = await req.json()
    const parsed = LeadSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0]?.message ?? 'Données invalides' },
        { status: 400 }
      )
    }

    const data = parsed.data

    let annonceRef: string | undefined
    let annonceTitre: string | undefined

    if (data.annonceId) {
      const annonce = await prisma.annonce.findUnique({
        where: { id: data.annonceId },
        select: { reference: true, titre: true },
      })
      annonceRef = annonce?.reference
      annonceTitre = annonce?.titre
    }

    const lead = await prisma.lead.create({
      data: {
        nom: data.nom,
        prenom: data.prenom,
        telephone: data.telephone,
        email: data.email || null,
        canal: data.canal,
        budget: data.budget,
        annonceId: data.annonceId || null,
        notes: data.notes,
      },
    })

    try {
      await sendLeadNotification({
        nom: data.nom,
        prenom: data.prenom,
        telephone: data.telephone,
        email: data.email,
        annonceRef,
        annonceTitre,
      })
    } catch (mailError) {
      console.error('Email send error:', mailError)
    }

    return NextResponse.json({ success: true, data: lead }, { status: 201 })
  } catch (error) {
    console.error('POST /api/leads error:', error)
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ success: false, error: 'Non autorisé' }, { status: 401 })
    }

    const body = await req.json()
    const { id, statut, agentId, notes, prochainRappel, interaction } = body

    const updates: Record<string, unknown> = {}
    if (statut) updates.statut = statut
    if (agentId !== undefined) updates.agentId = agentId
    if (notes !== undefined) updates.notes = notes
    if (prochainRappel !== undefined) updates.prochainRappel = prochainRappel ? new Date(prochainRappel) : null

    const lead = await prisma.lead.update({
      where: { id },
      data: {
        ...updates,
        ...(interaction
          ? {
              interactions: {
                create: {
                  type: interaction.type,
                  contenu: interaction.contenu,
                },
              },
            }
          : {}),
      },
      include: {
        annonce: { select: { id: true, reference: true, titre: true } },
        agent: { select: { id: true, name: true } },
        interactions: { orderBy: { createdAt: 'desc' } },
      },
    })

    return NextResponse.json({ success: true, data: lead })
  } catch (error) {
    console.error('PUT /api/leads error:', error)
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 })
  }
}
