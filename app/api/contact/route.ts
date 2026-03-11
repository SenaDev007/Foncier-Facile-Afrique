import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ContactSchema } from '@/lib/validations'
import { sendContactNotification } from '@/lib/mail'
import { rateLimit } from '@/lib/utils'

const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'unknown'
    if (!rateLimit(rateLimitMap, ip, 5, 60_000)) {
      return NextResponse.json(
        { success: false, error: 'Trop de requêtes. Veuillez patienter.' },
        { status: 429 }
      )
    }

    const body = await req.json()
    const parsed = ContactSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0]?.message ?? 'Données invalides' },
        { status: 400 }
      )
    }

    const { nom, prenom, email, telephone, sujet, contenu } = parsed.data

    await prisma.message.create({
      data: { nom, prenom, email, telephone, sujet, contenu },
    })

    try {
      await sendContactNotification({ nom, prenom, email, telephone, sujet, contenu })
    } catch (mailError) {
      console.error('Email send error:', mailError)
    }

    return NextResponse.json({ success: true, message: 'Message envoyé avec succès.' }, { status: 201 })
  } catch (error) {
    console.error('Contact API error:', error)
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 })
  }
}
