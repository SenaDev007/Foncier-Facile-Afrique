import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/** Liste publique des logements disponibles (séjour & tourisme). */
export async function GET() {
  try {
    const logements = await prisma.logement.findMany({
      where: { statut: 'DISPONIBLE', deletedAt: null },
      include: { photos: { orderBy: { ordre: 'asc' } } },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ data: logements })
  } catch (e) {
    console.error('GET /api/logements', e)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
