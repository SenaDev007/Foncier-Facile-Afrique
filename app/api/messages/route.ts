import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { sendMail } from '@/lib/mail'

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ success: false, error: 'Non autorisé' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const lu = searchParams.get('lu')
    const page = Number(searchParams.get('page') ?? '1')
    const limit = Number(searchParams.get('limit') ?? '20')

    const where: Record<string, unknown> = {}
    if (lu === 'true') where.lu = true
    if (lu === 'false') where.lu = false

    const [messages, total] = await Promise.all([
      prisma.message.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.message.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: { messages, total, page, totalPages: Math.ceil(total / limit) },
    })
  } catch (error) {
    console.error('GET /api/messages error:', error)
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ success: false, error: 'Non autorisé' }, { status: 401 })
    }

    const body = await req.json()
    const { id, lu, reponse, emailDestinataire } = body

    if (reponse && emailDestinataire) {
      await sendMail({
        to: emailDestinataire,
        subject: 'Réponse de Foncier Facile Afrique',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #1A6B3A; padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">Foncier Facile Afrique</h1>
            </div>
            <div style="padding: 24px;">
              <p>Bonjour,</p>
              <div style="white-space: pre-line;">${reponse}</div>
              <p style="margin-top: 24px;">Cordialement,<br><strong>L'équipe Foncier Facile Afrique</strong></p>
            </div>
            <div style="padding: 16px; background: #1A6B3A; text-align: center;">
              <p style="color: #E8F5EE; margin: 0; font-size: 12px;">www.foncierfacileafrique.fr | +229 96 90 12 04</p>
            </div>
          </div>
        `,
      })
    }

    const message = await prisma.message.update({
      where: { id },
      data: { lu: lu ?? true },
    })

    return NextResponse.json({ success: true, data: message })
  } catch (error) {
    console.error('PUT /api/messages error:', error)
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth()
    if (!session || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ success: false, error: 'Non autorisé' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID requis' }, { status: 400 })
    }

    await prisma.message.delete({ where: { id } })
    return NextResponse.json({ success: true, message: 'Message supprimé' })
  } catch (error) {
    console.error('DELETE /api/messages error:', error)
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 })
  }
}
