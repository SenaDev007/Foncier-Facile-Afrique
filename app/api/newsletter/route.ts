import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { NewsletterSchema } from '@/lib/validations'
import { sendNewsletterConfirmation } from '@/lib/mail'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = NewsletterSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0]?.message ?? 'Email invalide' },
        { status: 400 }
      )
    }

    const { email } = parsed.data

    const existing = await prisma.newsletter.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ success: true, message: 'Vous êtes déjà inscrit(e).' })
    }

    await prisma.newsletter.create({ data: { email } })

    try {
      await sendNewsletterConfirmation(email)
    } catch (mailError) {
      console.error('Newsletter email error:', mailError)
    }

    return NextResponse.json({ success: true, message: 'Inscription confirmée !' }, { status: 201 })
  } catch (error) {
    console.error('POST /api/newsletter error:', error)
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 })
  }
}
