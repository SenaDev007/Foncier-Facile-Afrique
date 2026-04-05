import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, ROLES_CRM } from '@/lib/api-admin-auth'
import { executeAdminLeadPatch } from '@/lib/execute-admin-lead-patch'

/** PATCH — mise à jour du statut uniquement (rétrocompatibilité). */
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const gate = await requireAdmin(ROLES_CRM)
  if (!gate.ok) return gate.response
  try {
    const body = await request.json()
    const result = await executeAdminLeadPatch(params.id, { statut: body?.statut }, gate.session.user.role)
    if (result instanceof NextResponse) return result
    return NextResponse.json(result.lead)
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
