import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { PublicAvisSchema } from '@/lib/validations'

/**
 * Soumission publique d’un témoignage : enregistré avec `actif: false` jusqu’à validation admin.
 */
export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Requête invalide' }, { status: 400 })
  }

  const parsed = PublicAvisSchema.safeParse(body)
  if (!parsed.success) {
    const msg = parsed.error.flatten().fieldErrors.nom?.[0]
      ?? parsed.error.flatten().fieldErrors.texte?.[0]
      ?? parsed.error.flatten().fieldErrors.note?.[0]
      ?? 'Données invalides'
    return NextResponse.json({ error: msg }, { status: 400 })
  }

  const { nom, texte, note } = parsed.data

  try {
    await prisma.temoignage.create({
      data: {
        nom: nom.trim(),
        texte: texte.trim(),
        note,
        actif: false,
        ordre: 999,
      },
    })
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('[POST /api/public/avis]', e)
    return NextResponse.json({ error: 'Enregistrement impossible pour le moment' }, { status: 500 })
  }
}
