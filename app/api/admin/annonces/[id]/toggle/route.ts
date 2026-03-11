import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PATCH - Activer/désactiver une annonce
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { actif } = await request.json()
    const { id } = params

    // On utilise le statut pour activer/désactiver
    const nouveauStatut = actif ? 'EN_LIGNE' : 'BROUILLON'

    const annonce = await prisma.annonce.update({
      where: { id },
      data: { statut: nouveauStatut },
      include: {
        photos: true,
        auteur: { select: { name: true } }
      }
    })

    return NextResponse.json(annonce)
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
