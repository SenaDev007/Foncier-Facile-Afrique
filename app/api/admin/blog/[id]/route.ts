import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PUT - Mettre à jour un article
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()
    const { id } = params

    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        titre: data.titre,
        resume: data.resume,
        contenu: data.contenu,
        imageUne: data.imageUne,
        statut: data.statut,
        metaTitle: data.metaTitle,
        metaDesc: data.metaDesc,
        tags: data.tags,
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : null,
      },
      include: {
        auteur: { select: { name: true } }
      }
    })

    return NextResponse.json(post)
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'article:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// DELETE - Supprimer un article
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    await prisma.blogPost.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'article:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
