import { NextResponse } from 'next/server'
import { getAllPages } from '@/lib/pages'
import { requireAdmin, ROLES_CONTENT } from '@/lib/api-admin-auth'

export async function GET() {
  const gate = await requireAdmin(ROLES_CONTENT)
  if (!gate.ok) return gate.response
  try {
    const pages = await getAllPages()
    return NextResponse.json(pages)
  } catch (error) {
    console.error('[admin/pages]', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
