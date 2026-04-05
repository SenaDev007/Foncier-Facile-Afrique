import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin, ROLES_DOSSIERS, ROLES_MANAGERS } from '@/lib/api-admin-auth'
import { AdminDossierCreateSchema } from '@/lib/validations'

export async function GET() {
  const gate = await requireAdmin(ROLES_DOSSIERS)
  if (!gate.ok) return gate.response
  try {
    const dossiers = await prisma.dossierFoncier.findMany({
      where: { deletedAt: null },
      include: {
        user: { select: { id: true, name: true } },
        interactions: { orderBy: { createdAt: 'desc' }, take: 5 },
      },
      orderBy: { updatedAt: 'desc' },
      take: 200,
    })
    return NextResponse.json({ data: dossiers })
  } catch (e) {
    console.error('GET /api/admin/dossiers', e)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const gate = await requireAdmin(ROLES_DOSSIERS)
  if (!gate.ok) return gate.response
  try {
    const body = await request.json()
    const parsed = AdminDossierCreateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? 'Données invalides' },
        { status: 400 }
      )
    }
    const d = parsed.data

    if (d.userId && !(ROLES_MANAGERS as readonly string[]).includes(gate.session.user.role)) {
      if (d.userId !== gate.session.user.id) {
        return NextResponse.json({ error: 'Seuls les administrateurs assignent un autre agent.' }, { status: 403 })
      }
    }

    const dossier = await prisma.dossierFoncier.create({
      data: {
        reference: d.reference,
        nomClient: d.nomClient,
        emailClient: d.emailClient,
        telephoneClient: d.telephoneClient,
        pays: d.pays,
        typeRegul: d.typeRegul,
        situationInit: d.situationInit,
        ville: d.ville,
        quartier: d.quartier,
        delaiEstime: d.delaiEstime,
        montantDevis: d.montantDevis ?? undefined,
        userId: d.userId ?? undefined,
      },
      include: { user: { select: { id: true, name: true } } },
    })
    return NextResponse.json({ data: dossier }, { status: 201 })
  } catch (e) {
    console.error('POST /api/admin/dossiers', e)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
