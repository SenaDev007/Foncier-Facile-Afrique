import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin, ROLES_CRM } from '@/lib/api-admin-auth'

// GET - Récupérer tous les messages
export async function GET() {
  const gate = await requireAdmin(ROLES_CRM)
  if (!gate.ok) return gate.response
  try {
    const messages = await prisma.message.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(messages)
  } catch (error) {
    console.error('Erreur lors de la récupération des messages:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// POST - Créer un nouveau message
export async function POST(request: NextRequest) {
  const gate = await requireAdmin(ROLES_CRM)
  if (!gate.ok) return gate.response
  try {
    const data = await request.json()
    
    const message = await prisma.message.create({
      data: {
        nom: data.nom,
        email: data.email,
        telephone: data.telephone,
        sujet: data.sujet,
        contenu: data.contenu
      }
    })

    return NextResponse.json(message, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de la création du message:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
