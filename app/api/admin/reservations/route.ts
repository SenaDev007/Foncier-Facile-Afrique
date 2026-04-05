import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin, ROLES_SEJOUR } from '@/lib/api-admin-auth'

export async function GET() {
  const gate = await requireAdmin(ROLES_SEJOUR)
  if (!gate.ok) return gate.response
  try {
    const reservations = await prisma.reservation.findMany({
      include: {
        logement: { select: { id: true, nom: true, reference: true, ville: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 200,
    })
    return NextResponse.json({ data: reservations })
  } catch (e) {
    console.error('GET /api/admin/reservations', e)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
