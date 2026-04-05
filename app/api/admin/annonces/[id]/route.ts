import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin, ROLES_ANNONCES } from '@/lib/api-admin-auth'

// PUT - Mettre à jour une annonce
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const gate = await requireAdmin(ROLES_ANNONCES)
  if (!gate.ok) return gate.response
  try {
    const data = await request.json()
    const { id } = params

    const annonce = await prisma.annonce.update({
      where: { id },
      data: {
        titre: data.titre,
        description: data.description,
        type: data.type,
        statut: data.statut,
        prix: data.prix,
        surface: data.surface,
        localisation: data.localisation,
      },
      include: {
        photos: true,
        auteur: { select: { name: true } }
      }
    })

    return NextResponse.json(annonce)
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'annonce:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// DELETE - Supprimer une annonce
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const gate = await requireAdmin(ROLES_ANNONCES)
  if (!gate.ok) return gate.response
  try {
    const { id } = params

    // Supprimer d'abord les photos associées
    await prisma.photo.deleteMany({
      where: { annonceId: id }
    })

    // Supprimer l'annonce
    await prisma.annonce.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'annonce:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
