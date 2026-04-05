import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin, ROLES_CRM } from '@/lib/api-admin-auth'

// PATCH - Marquer un message comme lu
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const gate = await requireAdmin(ROLES_CRM)
  if (!gate.ok) return gate.response
  try {
    const { id } = params

    const message = await prisma.message.update({
      where: { id },
      data: { lu: true }
    })

    return NextResponse.json(message)
  } catch (error) {
    console.error('Erreur lors de la mise à jour du message:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// DELETE - Supprimer un message
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const gate = await requireAdmin(ROLES_CRM)
  if (!gate.ok) return gate.response
  try {
    const { id } = params

    await prisma.message.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur lors de la suppression du message:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
