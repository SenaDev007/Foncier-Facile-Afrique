import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ROLES_MANAGERS } from '@/lib/api-admin-auth'
import { AdminLeadPatchSchema } from '@/lib/validations'

export const adminLeadDetailInclude = {
  annonce: { select: { id: true, reference: true, titre: true, slug: true } },
  agent: { select: { id: true, name: true } },
  interactions: { orderBy: { createdAt: 'desc' as const } },
} as const

export async function executeAdminLeadPatch(
  id: string,
  rawBody: unknown,
  userRole: string
): Promise<NextResponse | { ok: true; lead: unknown }> {
  const parsed = AdminLeadPatchSchema.safeParse(rawBody)
  if (!parsed.success) {
    const msg = parsed.error.errors[0]?.message ?? 'Données invalides'
    return NextResponse.json({ error: msg }, { status: 400 })
  }

  const data = parsed.data

  if (data.agentId !== undefined && !(ROLES_MANAGERS as readonly string[]).includes(userRole)) {
    return NextResponse.json(
      { error: 'Seuls les administrateurs peuvent assigner ou retirer un agent.' },
      { status: 403 }
    )
  }

  if (data.agentId) {
    const user = await prisma.user.findUnique({ where: { id: data.agentId }, select: { id: true } })
    if (!user) {
      return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 400 })
    }
  }

  const updatePayload: {
    statut?: (typeof data)['statut']
    notes?: string | null
    prochainRappel?: Date | null
    agentId?: string | null
  } = {}

  if (data.statut !== undefined) updatePayload.statut = data.statut
  if (data.notes !== undefined) updatePayload.notes = data.notes
  if (data.prochainRappel !== undefined) {
    if (data.prochainRappel === null || data.prochainRappel === '') {
      updatePayload.prochainRappel = null
    } else {
      const d = new Date(data.prochainRappel)
      if (Number.isNaN(d.getTime())) {
        return NextResponse.json({ error: 'Date de rappel invalide' }, { status: 400 })
      }
      updatePayload.prochainRappel = d
    }
  }
  if (data.agentId !== undefined) updatePayload.agentId = data.agentId

  try {
    const lead = await prisma.lead.update({
      where: { id },
      data: updatePayload,
      include: adminLeadDetailInclude,
    })
    return { ok: true, lead }
  } catch {
    return NextResponse.json({ error: 'Lead introuvable' }, { status: 404 })
  }
}
