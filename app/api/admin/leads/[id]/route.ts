import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, ROLES_CRM } from '@/lib/api-admin-auth'
import { executeAdminLeadPatch } from '@/lib/execute-admin-lead-patch'

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const gate = await requireAdmin(ROLES_CRM)
  if (!gate.ok) return gate.response

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON invalide' }, { status: 400 })
  }

  const result = await executeAdminLeadPatch(params.id, body, gate.session.user.role)
  if (result instanceof NextResponse) return result
  return NextResponse.json(result.lead)
}
