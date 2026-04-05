import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { requireAdmin, ROLES_SEJOUR } from '@/lib/api-admin-auth'
import { AdminLogementPatchSchema } from '@/lib/validations'

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const gate = await requireAdmin(ROLES_SEJOUR)
  if (!gate.ok) return gate.response
  try {
    const exists = await prisma.logement.findFirst({
      where: { id: params.id, deletedAt: null },
      select: { id: true },
    })
    if (!exists) {
      return NextResponse.json({ error: 'Logement introuvable' }, { status: 404 })
    }

    const body = await request.json()
    const parsed = AdminLogementPatchSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? 'Données invalides' },
        { status: 400 }
      )
    }
    const { photos, ...rest } = parsed.data
    const data = Object.fromEntries(
      Object.entries(rest).filter(([, v]) => v !== undefined)
    ) as Prisma.LogementUpdateInput
    const hasScalars = Object.keys(data).length > 0
    const hasPhotos = photos !== undefined

    if (!hasScalars && !hasPhotos) {
      return NextResponse.json({ error: 'Aucun champ' }, { status: 400 })
    }

    await prisma.$transaction(async (tx) => {
      if (hasScalars) {
        await tx.logement.update({
          where: { id: params.id },
          data,
        })
      }
      if (hasPhotos) {
        await tx.logementPhoto.deleteMany({ where: { logementId: params.id } })
        if (photos.length > 0) {
          await tx.logementPhoto.createMany({
            data: photos.map((p, i) => ({
              logementId: params.id,
              url: p.url,
              alt: p.alt ?? null,
              ordre: p.ordre ?? i,
            })),
          })
        }
      }
    })

    const logement = await prisma.logement.findUnique({
      where: { id: params.id },
      include: { photos: { orderBy: { ordre: 'asc' } } },
    })
    return NextResponse.json({ data: logement })
  } catch (e) {
    console.error('PATCH /api/admin/logements/[id]', e)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
