import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const ALLOWED_ROLES = ['SUPER_ADMIN', 'ADMIN'] as const

// PUT - Mettre à jour un utilisateur
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth()
    if (!session?.user || !ALLOWED_ROLES.includes(session.user.role as typeof ALLOWED_ROLES[number])) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
    }
    const data = await request.json()
    const { id } = params

    const utilisateur = await prisma.user.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email,
        role: data.role,
        active: data.active
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return NextResponse.json(utilisateur)
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// DELETE - Supprimer un utilisateur
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth()
    if (!session?.user || !ALLOWED_ROLES.includes(session.user.role as typeof ALLOWED_ROLES[number])) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
    }
    const { id } = params

    await prisma.user.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
