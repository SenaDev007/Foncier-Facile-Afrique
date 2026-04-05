import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { requireAdmin, ROLES_DOSSIERS, ROLES_MANAGERS } from '@/lib/api-admin-auth'
import { AdminDossierPatchSchema } from '@/lib/validations'

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const gate = await requireAdmin(ROLES_DOSSIERS)
  if (!gate.ok) return gate.response
  try {
    const body = await request.json()
    const parsed = AdminDossierPatchSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? 'Données invalides' },
        { status: 400 }
      )
    }
    const d = parsed.data
    if (Object.keys(d).length === 0) {
      return NextResponse.json({ error: 'Aucun champ' }, { status: 400 })
    }

    if (d.userId !== undefined && d.userId !== null) {
      if (!(ROLES_MANAGERS as readonly string[]).includes(gate.session.user.role)) {
        return NextResponse.json({ error: 'Assignation réservée aux administrateurs.' }, { status: 403 })
      }
    }

    const data = Object.fromEntries(
      Object.entries(d).filter(([, v]) => v !== undefined)
    ) as Prisma.DossierFoncierUpdateInput

    const dossier = await prisma.dossierFoncier.update({
      where: { id: params.id },
      data,
      include: { user: { select: { id: true, name: true } } },
    })
    return NextResponse.json({ data: dossier })
  } catch {
    return NextResponse.json({ error: 'Dossier introuvable' }, { status: 404 })
  }
}
