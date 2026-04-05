import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isLogementAvailable } from '@/lib/booking'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = request.nextUrl
    const da = searchParams.get('dateArrivee')
    const dd = searchParams.get('dateDepart')
    if (!da || !dd) {
      return NextResponse.json(
        { error: 'Paramètres dateArrivee et dateDepart requis (ISO ou YYYY-MM-DD)' },
        { status: 400 }
      )
    }

    const dateArrivee = new Date(da)
    const dateDepart = new Date(dd)
    if (Number.isNaN(dateArrivee.getTime()) || Number.isNaN(dateDepart.getTime())) {
      return NextResponse.json({ error: 'Dates invalides' }, { status: 400 })
    }
    if (dateDepart <= dateArrivee) {
      return NextResponse.json({ error: 'La date de départ doit être après l’arrivée' }, { status: 400 })
    }

    const logement = await prisma.logement.findFirst({
      where: { id: params.id, deletedAt: null, statut: 'DISPONIBLE' },
      select: { id: true, minNuits: true, capacite: true },
    })
    if (!logement) {
      return NextResponse.json({ error: 'Logement introuvable' }, { status: 404 })
    }

    const available = await isLogementAvailable(prisma, logement.id, dateArrivee, dateDepart)

    return NextResponse.json({
      data: {
        disponible: available,
        logementId: logement.id,
        minNuits: logement.minNuits,
        capacite: logement.capacite,
      },
    })
  } catch (e) {
    console.error('GET /api/logements/[id]/disponibilite', e)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
