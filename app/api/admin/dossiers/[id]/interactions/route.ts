import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin, ROLES_DOSSIERS } from '@/lib/api-admin-auth'
import { AdminInteractionDossierSchema } from '@/lib/validations'

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const gate = await requireAdmin(ROLES_DOSSIERS)
  if (!gate.ok) return gate.response
  try {
    const body = await request.json()
    const parsed = AdminInteractionDossierSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? 'Données invalides' },
        { status: 400 }
      )
    }

    const exists = await prisma.dossierFoncier.findFirst({
      where: { id: params.id, deletedAt: null },
    })
    if (!exists) {
      return NextResponse.json({ error: 'Dossier introuvable' }, { status: 404 })
    }

    const row = await prisma.interactionDossier.create({
      data: {
        dossierId: params.id,
        type: parsed.data.type,
        contenu: parsed.data.contenu,
        userId: gate.session.user.id,
      },
    })
    return NextResponse.json({ data: row }, { status: 201 })
  } catch (e) {
    console.error('POST interaction dossier', e)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
