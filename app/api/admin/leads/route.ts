import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Récupérer tous les leads
export async function GET() {
  try {
    const leads = await prisma.lead.findMany({
      include: {
        agent: { select: { name: true } },
        annonce: { select: { titre: true } }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(leads)
  } catch (error) {
    console.error('Erreur lors de la récupération des leads:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// POST - Créer un nouveau lead
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    const lead = await prisma.lead.create({
      data: {
        nom: data.nom,
        prenom: data.prenom,
        telephone: data.telephone,
        email: data.email,
        canal: data.canal,
        budget: data.budget,
        notes: data.notes,
        annonceId: data.annonceId,
        agentId: data.agentId,
      },
      include: {
        agent: { select: { name: true } },
        annonce: { select: { titre: true } }
      }
    })

    return NextResponse.json(lead, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de la création du lead:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
