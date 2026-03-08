import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET() {
  const params = await prisma.parametre.findMany({ orderBy: { cle: 'asc' } })
  return NextResponse.json(params)
}

export async function PUT(request: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const body: Record<string, string> = await request.json()

  const updates = Object.entries(body).map(([cle, valeur]) =>
    prisma.parametre.upsert({
      where: { cle },
      create: { cle, valeur },
      update: { valeur },
    })
  )

  await Promise.all(updates)
  return NextResponse.json({ success: true })
}
