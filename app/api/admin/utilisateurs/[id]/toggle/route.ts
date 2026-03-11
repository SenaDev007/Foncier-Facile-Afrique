import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PATCH - Activer/désactiver un utilisateur
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { active } = await request.json()
    const { id } = params

    const utilisateur = await prisma.user.update({
      where: { id },
      data: { active },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return NextResponse.json(utilisateur)
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
