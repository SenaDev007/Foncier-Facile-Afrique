import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PUT - Mettre à jour un témoignage
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()
    const { id } = params

    const temoignage = await prisma.temoignage.update({
      where: { id },
      data: {
        nom: data.nom,
        photo: data.photo,
        texte: data.texte,
        note: data.note,
        actif: data.actif,
        ordre: data.ordre
      }
    })

    return NextResponse.json(temoignage)
  } catch (error) {
    console.error('Erreur lors de la mise à jour du témoignage:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// DELETE - Supprimer un témoignage
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    await prisma.temoignage.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur lors de la suppression du témoignage:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
