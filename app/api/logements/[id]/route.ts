import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const logement = await prisma.logement.findFirst({
      where: { id: params.id, deletedAt: null, statut: 'DISPONIBLE' },
      include: { photos: { orderBy: { ordre: 'asc' } } },
    })
    if (!logement) {
      return NextResponse.json({ error: 'Logement introuvable' }, { status: 404 })
    }
    return NextResponse.json({ data: logement })
  } catch (e) {
    console.error('GET /api/logements/[id]', e)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
