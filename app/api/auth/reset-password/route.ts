import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { ResetPasswordSchema } from '@/lib/validations'
import { consumePasswordResetToken } from '@/lib/password-reset'
import { prisma } from '@/lib/prisma'
import { rateLimit } from '@/lib/utils'

const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? req.headers.get('x-real-ip') ?? 'unknown'
  if (!rateLimit(rateLimitMap, ip, 15, 60_000)) {
    return NextResponse.json({ error: 'Trop de tentatives. Réessayez dans une minute.' }, { status: 429 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Requête invalide' }, { status: 400 })
  }

  const parsed = ResetPasswordSchema.safeParse(body)
  if (!parsed.success) {
    const msg =
      parsed.error.flatten().fieldErrors.token?.[0] ??
      parsed.error.flatten().fieldErrors.password?.[0] ??
      parsed.error.flatten().fieldErrors.confirmPassword?.[0] ??
      'Données invalides'
    return NextResponse.json({ error: msg }, { status: 400 })
  }

  const { token, password } = parsed.data
  const consumed = await consumePasswordResetToken(token)
  if (!consumed) {
    return NextResponse.json(
      { error: 'Ce lien est invalide ou a expiré. Demandez un nouveau lien depuis la page mot de passe oublié.' },
      { status: 400 },
    )
  }

  const hashed = await bcrypt.hash(password, 12)
  await prisma.user.update({
    where: { id: consumed.userId },
    data: { password: hashed },
  })

  return NextResponse.json({ ok: true, message: 'Votre mot de passe a été mis à jour. Vous pouvez vous connecter.' })
}
