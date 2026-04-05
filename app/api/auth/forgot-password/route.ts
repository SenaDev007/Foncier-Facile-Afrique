import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ForgotPasswordSchema } from '@/lib/validations'
import { createPasswordResetToken } from '@/lib/password-reset'
import { sendAdminPasswordResetEmail } from '@/lib/mail'
import { getServerBaseUrl } from '@/lib/app-url'
import { rateLimit } from '@/lib/utils'

const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? req.headers.get('x-real-ip') ?? 'unknown'
  if (!rateLimit(rateLimitMap, ip, 8, 60_000)) {
    return NextResponse.json({ error: 'Trop de tentatives. Réessayez dans une minute.' }, { status: 429 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Requête invalide' }, { status: 400 })
  }

  const parsed = ForgotPasswordSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors.email?.[0] ?? 'Email invalide' }, { status: 400 })
  }

  const email = parsed.data.email.trim().toLowerCase()

  const user = await prisma.user.findUnique({ where: { email } })
  const generic =
    'Si un compte actif est associé à cette adresse, vous recevrez un e-mail avec un lien pour réinitialiser votre mot de passe.'

  if (!user || !user.active) {
    return NextResponse.json({ ok: true, message: generic })
  }

  try {
    const raw = await createPasswordResetToken(user.id)
    const base = getServerBaseUrl()
    const resetUrl = `${base}/admin/reinitialiser-mot-de-passe?token=${encodeURIComponent(raw)}`
    await sendAdminPasswordResetEmail({ to: user.email, resetUrl })
  } catch (e) {
    console.error('[forgot-password] envoi e-mail', e)
    return NextResponse.json(
      {
        error:
          'Impossible d’envoyer l’e-mail pour le moment. Vérifiez la configuration SMTP (OVH/Brevo) ou réessayez plus tard.',
      },
      { status: 503 },
    )
  }

  return NextResponse.json({ ok: true, message: generic })
}
