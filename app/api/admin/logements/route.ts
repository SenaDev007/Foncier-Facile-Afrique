import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin, ROLES_SEJOUR } from '@/lib/api-admin-auth'
import { AdminLogementCreateSchema } from '@/lib/validations'

export async function GET() {
  const gate = await requireAdmin(ROLES_SEJOUR)
  if (!gate.ok) return gate.response
  try {
    const logements = await prisma.logement.findMany({
      where: { deletedAt: null },
      include: { photos: { orderBy: { ordre: 'asc' } } },
      orderBy: { updatedAt: 'desc' },
    })
    return NextResponse.json({ data: logements })
  } catch (e) {
    console.error('GET /api/admin/logements', e)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const gate = await requireAdmin(ROLES_SEJOUR)
  if (!gate.ok) return gate.response
  try {
    const body = await request.json()
    const parsed = AdminLogementCreateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? 'Données invalides' },
        { status: 400 }
      )
    }
    const d = parsed.data
    const logement = await prisma.logement.create({
      data: {
        reference: d.reference,
        nom: d.nom,
        type: d.type,
        ville: d.ville,
        quartier: d.quartier,
        description: d.description,
        prixNuit: d.prixNuit,
        capacite: d.capacite,
        minNuits: d.minNuits ?? 1,
        equipements: d.equipements,
        services: d.services,
        statut: d.statut ?? 'DISPONIBLE',
        latitude: d.latitude ?? undefined,
        longitude: d.longitude ?? undefined,
        photos: d.photos?.length
          ? {
              create: d.photos.map((p, i) => ({
                url: p.url,
                alt: p.alt,
                ordre: p.ordre ?? i,
              })),
            }
          : undefined,
      },
      include: { photos: true },
    })
    return NextResponse.json({ data: logement }, { status: 201 })
  } catch (e) {
    console.error('POST /api/admin/logements', e)
    return NextResponse.json({ error: 'Erreur serveur (référence déjà utilisée ?)' }, { status: 500 })
  }
}
