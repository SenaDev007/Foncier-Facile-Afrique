import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PATCH - Changer le statut d'un article
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { statut } = await request.json()
    const { id } = params

    const post = await prisma.blogPost.update({
      where: { id },
      data: { 
        statut,
        publishedAt: statut === 'PUBLIE' ? new Date() : null
      },
      include: {
        auteur: { select: { name: true } }
      }
    })

    return NextResponse.json(post)
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
