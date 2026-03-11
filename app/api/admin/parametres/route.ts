import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Récupérer tous les paramètres
export async function GET() {
  try {
    const parametres = await prisma.parametre.findMany({
      orderBy: { cle: 'asc' }
    })

    return NextResponse.json(parametres)
  } catch (error) {
    console.error('Erreur lors de la récupération des paramètres:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// PUT - Mettre à jour les paramètres
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Mettre à jour tous les paramètres
    const updates = Object.entries(data).map(([cle, valeur]) => 
      prisma.parametre.upsert({
        where: { cle },
        update: { valeur: valeur as string },
        create: { cle, valeur: valeur as string }
      })
    )

    await Promise.all(updates)

    return NextResponse.json({ success: true, message: 'Paramètres sauvegardés' })
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des paramètres:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
