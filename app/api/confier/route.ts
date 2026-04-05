import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ConfierBienSchema } from '@/lib/validations'
import { sendLeadNotification } from '@/lib/mail'
import { rateLimit } from '@/lib/utils'

const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

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
    const parsed = ConfierBienSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0]?.message ?? 'Données invalides' },
        { status: 400 }
      )
    }

    const d = parsed.data

    const prixParsed = d.prixSouhaite?.replace(/\s/g, '').replace(/[^\d.,]/g, '').replace(',', '.') ?? ''
    const prixNum = parseFloat(prixParsed)
    const prix = Number.isFinite(prixNum) && prixNum >= 1 ? prixNum : 1

    const surfaceRaw = d.surface?.replace(/\s/g, '').replace(',', '.') ?? ''
    const surfaceNum = parseFloat(surfaceRaw)
    const surface = Number.isFinite(surfaceNum) && surfaceNum > 0 ? surfaceNum : null

    const notesLines = [
      '[POLE:CONFIER — Confier mon bien]',
      `Type: ${d.typeBien}`,
      `Objectif: ${d.objectif}`,
      `Ville: ${d.ville}${d.quartier ? ` — ${d.quartier}` : ''}`,
      d.surface ? `Surface: ${d.surface}` : null,
      d.prixSouhaite ? `Prix souhaité: ${d.prixSouhaite}` : null,
      d.documentDisponible ? `Documents: ${d.documentDisponible}` : null,
      '',
      d.description,
    ].filter(Boolean) as string[]

    const { annonceRef, annonceTitre, annonceId } = await prisma.$transaction(async (tx) => {
      const auteur = await tx.user.findFirst({
        where: { role: { in: ['SUPER_ADMIN', 'ADMIN'] }, active: true },
        orderBy: { createdAt: 'asc' },
        select: { id: true },
      })

      let annonceIdInner: string | undefined
      let refOut: string | undefined
      let titreOut: string | undefined

      if (auteur) {
        const reference = `PART-${Date.now().toString(36).toUpperCase()}`
        const slug = `part-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
        const titre = `Particulier — ${d.typeBien} — ${d.ville}`
        const annonce = await tx.annonce.create({
          data: {
            reference,
            slug,
            titre,
            description: d.description,
            type: d.typeBien,
            statut: 'BROUILLON',
            prix,
            surface,
            localisation: [d.ville, d.quartier].filter(Boolean).join(' — '),
            quartier: d.quartier?.trim() || null,
            documents: [],
            auteurId: auteur.id,
          },
        })
        annonceIdInner = annonce.id
        refOut = annonce.reference
        titreOut = annonce.titre
        notesLines.unshift(`Fiche annonce brouillon : ${reference} (à valider dans le back-office)`)
      }

      await tx.lead.create({
        data: {
          nom: d.nom,
          prenom: d.prenom,
          telephone: d.telephone,
          email: d.email || null,
          canal: 'FORMULAIRE',
          statut: 'NOUVEAU',
          pole: 'CONFIER',
          priorite: 'NORMALE',
          budget: d.prixSouhaite ?? null,
          notes: notesLines.join('\n'),
          annonceId: annonceIdInner,
        },
      })

      return { annonceRef: refOut, annonceTitre: titreOut, annonceId: annonceIdInner }
    })

    const baseUrl = (process.env.NEXTAUTH_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '')
    const brouillonAdmin =
      annonceId && annonceRef
        ? `<p style="margin-top:12px;"><a href="${baseUrl}/admin/annonces/${annonceId}/edit" style="color:#1A6B3A;font-weight:600;">Ouvrir le brouillon ${escapeHtml(annonceRef)} dans le back-office</a></p>`
        : ''

    const extraHtml = `
      <div style="margin-top: 16px; padding: 16px; background: white; border-left: 4px solid #C9952A; border-radius: 4px;">
        <p style="font-weight: bold; margin: 0 0 8px;">Dépôt « Confier mon bien »</p>
        ${brouillonAdmin}
        <p style="margin: 0; white-space: pre-line; font-size: 14px;">${escapeHtml(notesLines.join('\n'))}</p>
      </div>`

    try {
      await sendLeadNotification({
        nom: d.nom,
        prenom: d.prenom,
        telephone: d.telephone,
        email: d.email || undefined,
        annonceRef,
        annonceTitre,
        subject: `[FFA] Confier mon bien — ${d.prenom} ${d.nom}`,
        extraHtml,
      })
    } catch (e) {
      console.error('Confier email error:', e)
    }

    return NextResponse.json(
      { success: true, message: 'Votre demande a bien été enregistrée. Notre équipe vous recontacte sous 24h.' },
      { status: 201 }
    )
  } catch (error) {
    console.error('POST /api/confier error:', error)
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 })
  }
}
