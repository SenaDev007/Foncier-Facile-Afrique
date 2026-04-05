import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { LeadSchema, AdminInteractionCreateSchema } from '@/lib/validations'
import { sendLeadNotification } from '@/lib/mail'
import { rateLimit } from '@/lib/utils'
import { requireAdmin, ROLES_CRM } from '@/lib/api-admin-auth'
import { executeAdminLeadPatch, adminLeadDetailInclude } from '@/lib/execute-admin-lead-patch'

const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

export async function GET(req: NextRequest) {
  const gate = await requireAdmin(ROLES_CRM)
  if (!gate.ok) return gate.response
  try {

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
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
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

/** Rétrocompatibilité : préférer PATCH /api/leads/[id]. */
export async function PUT(req: NextRequest) {
  const gate = await requireAdmin(ROLES_CRM)
  if (!gate.ok) return gate.response
  try {
    let body: Record<string, unknown>
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ error: 'JSON invalide' }, { status: 400 })
    }
    const id = body.id
    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'id requis' }, { status: 400 })
    }

    const { id: _id, interaction, ...rest } = body
    const patchBody: Record<string, unknown> = {}
    if (rest.statut !== undefined) patchBody.statut = rest.statut
    if (rest.agentId !== undefined) patchBody.agentId = rest.agentId
    if (rest.notes !== undefined) patchBody.notes = rest.notes
    if (rest.prochainRappel !== undefined) patchBody.prochainRappel = rest.prochainRappel

    const hasPatch = Object.keys(patchBody).length > 0
    if (hasPatch) {
      const r = await executeAdminLeadPatch(id, patchBody, gate.session.user.role)
      if (r instanceof NextResponse) return r
    }

    if (interaction && typeof interaction === 'object') {
      const p = AdminInteractionCreateSchema.safeParse(interaction)
      if (!p.success) {
        return NextResponse.json(
          { error: p.error.errors[0]?.message ?? 'Interaction invalide' },
          { status: 400 }
        )
      }
      await prisma.interaction.create({
        data: { leadId: id, type: p.data.type, contenu: p.data.contenu },
      })
    }

    if (!hasPatch && !interaction) {
      return NextResponse.json({ error: 'Aucune modification' }, { status: 400 })
    }

    const lead = await prisma.lead.findUnique({
      where: { id },
      include: adminLeadDetailInclude,
    })
    if (!lead) return NextResponse.json({ error: 'Lead introuvable' }, { status: 404 })
    return NextResponse.json({ success: true, data: lead })
  } catch (error) {
    console.error('PUT /api/leads error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
