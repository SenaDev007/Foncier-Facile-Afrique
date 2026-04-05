import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin, ROLES_CRM, ROLES_MANAGERS } from '@/lib/api-admin-auth'
import { executeAdminLeadPatch, adminLeadDetailInclude } from '@/lib/execute-admin-lead-patch'
import { AdminInteractionCreateSchema } from '@/lib/validations'

interface RouteParams {
  params: { id: string }
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
  const gate = await requireAdmin(ROLES_CRM)
  if (!gate.ok) return gate.response
  try {
    const lead = await prisma.lead.findUnique({
      where: { id: params.id },
      include: adminLeadDetailInclude,
    })

    if (!lead) return NextResponse.json({ error: 'Lead introuvable' }, { status: 404 })
    return NextResponse.json({ success: true, data: lead })
  } catch (error) {
    console.error('GET /api/leads/[id] error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const gate = await requireAdmin(ROLES_CRM)
  if (!gate.ok) return gate.response
  try {
    let body: Record<string, unknown>
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ error: 'JSON invalide' }, { status: 400 })
    }
    const { interaction, ...patchBody } = body
    const hasPatch = Object.keys(patchBody).length > 0

    if (hasPatch) {
      const r = await executeAdminLeadPatch(params.id, patchBody, gate.session.user.role)
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
        data: {
          leadId: params.id,
          type: p.data.type,
          contenu: p.data.contenu,
        },
      })
    }

    if (!hasPatch && !interaction) {
      return NextResponse.json({ error: 'Aucune modification' }, { status: 400 })
    }

    const lead = await prisma.lead.findUnique({
      where: { id: params.id },
      include: adminLeadDetailInclude,
    })
    if (!lead) return NextResponse.json({ error: 'Lead introuvable' }, { status: 404 })
    return NextResponse.json({ success: true, data: lead })
  } catch (error) {
    console.error('PATCH /api/leads/[id] error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const gate = await requireAdmin(ROLES_MANAGERS)
  if (!gate.ok) return gate.response
  try {
    await prisma.lead.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/leads/[id] error:', error)
    return NextResponse.json({ error: 'Lead introuvable ou erreur serveur' }, { status: 404 })
  }
}
