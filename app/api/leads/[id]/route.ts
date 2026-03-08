import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

interface RouteParams {
  params: { id: string }
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const lead = await prisma.lead.findUnique({
      where: { id: params.id },
      include: {
        annonce: { select: { id: true, reference: true, titre: true } },
        agent: { select: { id: true, name: true } },
        interactions: { orderBy: { createdAt: 'desc' } },
      },
    })

    if (!lead) return NextResponse.json({ error: 'Lead introuvable' }, { status: 404 })
    return NextResponse.json({ success: true, data: lead })
  } catch (error) {
    console.error('GET /api/leads/[id] error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const body = await req.json()
    const { statut, agentId, notes, prochainRappel, interaction } = body

    const updates: Record<string, unknown> = {}
    if (statut !== undefined) updates.statut = statut
    if (agentId !== undefined) updates.agentId = agentId
    if (notes !== undefined) updates.notes = notes
    if (prochainRappel !== undefined) {
      updates.prochainRappel = prochainRappel ? new Date(prochainRappel) : null
    }

    const lead = await prisma.lead.update({
      where: { id: params.id },
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
    console.error('PATCH /api/leads/[id] error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    await prisma.lead.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/leads/[id] error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
