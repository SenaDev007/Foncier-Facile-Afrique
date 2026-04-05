import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin, ROLES_CRM } from '@/lib/api-admin-auth'
import { AdminInteractionCreateSchema } from '@/lib/validations'

// GET - Récupérer les interactions d'un lead
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const gate = await requireAdmin(ROLES_CRM)
  if (!gate.ok) return gate.response
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
  const gate = await requireAdmin(ROLES_CRM)
  if (!gate.ok) return gate.response
  try {
    let raw: unknown
    try {
      raw = await request.json()
    } catch {
      return NextResponse.json({ error: 'JSON invalide' }, { status: 400 })
    }
    const parsed = AdminInteractionCreateSchema.safeParse(raw)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? 'Données invalides' },
        { status: 400 }
      )
    }
    const { id } = params

    const interaction = await prisma.interaction.create({
      data: {
        type: parsed.data.type,
        contenu: parsed.data.contenu,
        leadId: id,
      },
    })

    return NextResponse.json(interaction, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'interaction:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
