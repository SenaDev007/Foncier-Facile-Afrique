import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Récupérer toutes les annonces
export async function GET() {
  try {
    const annonces = await prisma.annonce.findMany({
      include: {
        photos: true,
        auteur: { select: { name: true } }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(annonces)
  } catch (error) {
    console.error('Erreur lors de la récupération des annonces:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// POST - Créer une nouvelle annonce
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    const annonce = await prisma.annonce.create({
      data: {
        titre: data.titre,
        description: data.description,
        type: data.type,
        statut: data.statut,
        prix: data.prix,
        surface: data.surface,
        localisation: data.localisation,
        auteurId: 'default-user', // À adapter selon votre système d'authentification
        reference: generateReference(), // Générer une référence unique
        slug: generateSlug(data.titre), // Générer un slug unique
      },
      include: {
        photos: true,
        auteur: { select: { name: true } }
      }
    })

    return NextResponse.json(annonce, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de la création de l\'annonce:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// Fonctions utilitaires
function generateReference(): string {
  return 'FFA-' + Date.now().toString(36).toUpperCase()
}

function generateSlug(titre: string): string {
  return titre
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') + '-' + Date.now()
}
