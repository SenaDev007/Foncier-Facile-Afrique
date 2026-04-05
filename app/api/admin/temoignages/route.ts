import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin, ROLES_TEMOIGNAGES } from '@/lib/api-admin-auth'

// GET - Récupérer tous les témoignages
export async function GET() {
  const gate = await requireAdmin(ROLES_TEMOIGNAGES)
  if (!gate.ok) return gate.response
  try {
    const temoignages = await prisma.temoignage.findMany({
      orderBy: { ordre: 'asc', createdAt: 'desc' }
    })

    return NextResponse.json(temoignages)
  } catch (error) {
    console.error('Erreur lors de la récupération des témoignages:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// POST - Créer un nouveau témoignage
export async function POST(request: NextRequest) {
  const gate = await requireAdmin(ROLES_TEMOIGNAGES)
  if (!gate.ok) return gate.response
  try {
    const data = await request.json()
    
    const temoignage = await prisma.temoignage.create({
      data: {
        nom: data.nom,
        photo: data.photo,
        texte: data.texte,
        note: data.note,
        actif: data.actif,
        ordre: data.ordre
      }
    })

    return NextResponse.json(temoignage, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de la création du témoignage:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
