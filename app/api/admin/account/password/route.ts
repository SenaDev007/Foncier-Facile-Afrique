import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { requireAdmin, ROLES_STAFF } from '@/lib/api-admin-auth'
import { ChangePasswordSchema } from '@/lib/validations'

/** Changement de mot de passe pour l’utilisateur connecté (tous rôles staff). */
export async function POST(request: NextRequest) {
  const gate = await requireAdmin(ROLES_STAFF)
  if (!gate.ok) return gate.response

  const userId = gate.session.user.id
  if (!userId) {
    return NextResponse.json({ error: 'Session invalide' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Corps JSON invalide' }, { status: 400 })
  }

  const parsed = ChangePasswordSchema.safeParse(body)
  if (!parsed.success) {
    const first = parsed.error.flatten().fieldErrors
    const msg =
      first.currentPassword?.[0] ??
      first.newPassword?.[0] ??
      first.confirmPassword?.[0] ??
      'Données invalides'
    return NextResponse.json({ error: msg }, { status: 400 })
  }

  const { currentPassword, newPassword } = parsed.data

  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) {
    return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 })
  }

  const valid = await bcrypt.compare(currentPassword, user.password)
  if (!valid) {
    return NextResponse.json({ error: 'Mot de passe actuel incorrect' }, { status: 400 })
  }

  const sameAsOld = await bcrypt.compare(newPassword, user.password)
  if (sameAsOld) {
    return NextResponse.json({ error: 'Le nouveau mot de passe doit être différent de l’ancien' }, { status: 400 })
  }

  const hashed = await bcrypt.hash(newPassword, 12)
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashed },
  })

  return NextResponse.json({ success: true })
}
