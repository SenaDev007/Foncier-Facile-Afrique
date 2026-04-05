import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin, ROLES_TEMOIGNAGES } from '@/lib/api-admin-auth'

// PATCH - Activer/désactiver un témoignage
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const gate = await requireAdmin(ROLES_TEMOIGNAGES)
  if (!gate.ok) return gate.response
  try {
    const { actif } = await request.json()
    const { id } = params

    const temoignage = await prisma.temoignage.update({
      where: { id },
      data: { actif }
    })

    return NextResponse.json(temoignage)
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
