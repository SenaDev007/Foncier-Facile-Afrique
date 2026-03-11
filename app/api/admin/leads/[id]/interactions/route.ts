import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Récupérer les interactions d'un lead
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const interactions = await prisma.interaction.findMany({
      where: { leadId: id },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(interactions)
  } catch (error) {
    console.error('Erreur lors de la récupération des interactions:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// POST - Ajouter une interaction à un lead
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { type, contenu } = await request.json()
    const { id } = params

    const interaction = await prisma.interaction.create({
      data: {
        type,
        contenu,
        leadId: id
      }
    })

    return NextResponse.json(interaction, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'interaction:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
