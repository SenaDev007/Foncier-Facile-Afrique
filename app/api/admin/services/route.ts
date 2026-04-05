import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { requireAdmin, ROLES_MANAGERS } from '@/lib/api-admin-auth'
import { prisma } from '@/lib/prisma'
import { getPublicServiceCards, SERVICES_CARDS_PARAM_KEY } from '@/lib/public-services'

// GET — mêmes cartes que le site public (BDD → fichier legacy → défauts)
export async function GET() {
  const gate = await requireAdmin(ROLES_MANAGERS)
  if (!gate.ok) return gate.response
  try {
    const services = await getPublicServiceCards()
    return NextResponse.json(services)
  } catch (error) {
    console.error('Erreur lors de la récupération des services:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// PUT — persistance en base (Parametre)
export async function PUT(request: NextRequest) {
  const gate = await requireAdmin(ROLES_MANAGERS)
  if (!gate.ok) return gate.response
  try {
    const body = await request.json()
    const { services } = body

    if (!Array.isArray(services)) {
      return NextResponse.json({ error: 'Services invalide' }, { status: 400 })
    }

    for (const s of services) {
      if (!s || typeof s !== 'object') {
        return NextResponse.json({ error: 'Format de service invalide' }, { status: 400 })
      }
      const o = s as Record<string, unknown>
      if (typeof o.id !== 'string' || typeof o.title !== 'string' || typeof o.description !== 'string') {
        return NextResponse.json({ error: 'Champs id, title, description requis' }, { status: 400 })
      }
      if (typeof o.image !== 'string' || typeof o.icon !== 'string') {
        return NextResponse.json({ error: 'Champs image et icon requis' }, { status: 400 })
      }
      if (
        o.points !== undefined &&
        (!Array.isArray(o.points) || o.points.some((p) => typeof p !== 'string'))
      ) {
        return NextResponse.json({ error: 'Le champ points doit être un tableau de textes' }, { status: 400 })
      }
    }

    await prisma.parametre.upsert({
      where: { cle: SERVICES_CARDS_PARAM_KEY },
      update: { valeur: JSON.stringify(services) },
      create: { cle: SERVICES_CARDS_PARAM_KEY, valeur: JSON.stringify(services) },
    })

    revalidatePath('/')
    revalidatePath('/services')

    return NextResponse.json({ success: true, message: 'Services enregistrés en base' })
  } catch (error) {
    console.error('Erreur lors de la mise à jour des services:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
