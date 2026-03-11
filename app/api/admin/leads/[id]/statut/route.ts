import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PATCH - Mettre à jour le statut d'un lead
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { statut } = await request.json()
    const { id } = params

    const lead = await prisma.lead.update({
      where: { id },
      data: { statut },
      include: {
        auteur: { select: { name: true } },
        annonce: { select: { titre: true } }
      }
    })

    return NextResponse.json(lead)
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
