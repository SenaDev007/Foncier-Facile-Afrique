import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { DiagnosticFoncierSchema } from '@/lib/validations'
import {
  sendRegularisationDiagnosticAckToClient,
  sendRegularisationDiagnosticNotification,
} from '@/lib/mail'
import { rateLimit } from '@/lib/utils'
import { diagnosticSituationToTypeRegul, generateUniqueDossierReference } from '@/lib/dossier-utils'

const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

const SITUATION_LABELS: Record<string, string> = {
  ph_vers_tf: 'Je possède une parcelle avec PH, je veux le TF',
  premier_tf: 'Première immatriculation / premier TF',
  mutation: 'Mutation / vente / succession',
  litige: 'Litige ou contestation',
  morcellement: 'Morcellement / division',
  audit: 'Audit / vérification de dossier',
  autre: 'Autre situation',
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
    const parsed = DiagnosticFoncierSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0]?.message ?? 'Données invalides' },
        { status: 400 }
      )
    }

    const d = parsed.data
    const typeRegul = diagnosticSituationToTypeRegul(d.situation)
    const situationLabel = SITUATION_LABELS[d.situation] ?? d.situation
    const situationInit = [
      `[Formulaire web — Diagnostic gratuit]`,
      `Situation déclarée : ${situationLabel}`,
      `Ville / localisation : ${d.ville}`,
      '',
      d.description,
    ].join('\n')

    const reference = await generateUniqueDossierReference(prisma)
    const nomClient = `${d.prenom} ${d.nom}`.trim()

    const { dossier } = await prisma.$transaction(async (tx) => {
      const dossierRow = await tx.dossierFoncier.create({
        data: {
          reference,
          nomClient,
          emailClient: d.email,
          telephoneClient: d.telephone,
          pays: 'Bénin',
          typeRegul,
          situationInit,
          ville: d.ville,
          statut: 'DIAGNOSTIC',
        },
      })

      await tx.lead.create({
        data: {
          nom: d.nom,
          prenom: d.prenom,
          telephone: d.telephone,
          email: d.email,
          canal: 'FORMULAIRE',
          statut: 'NOUVEAU',
          pole: 'REGULARISATION',
          priorite: 'NORMALE',
          notes: [
            `[Pôle Régularisation — suite au diagnostic web]`,
            `Réf. dossier : ${reference}`,
            `Lien back-office : dossiers / ${dossierRow.id}`,
            '',
            situationInit,
          ].join('\n'),
        },
      })

      return { dossier: dossierRow }
    })

    try {
      await sendRegularisationDiagnosticNotification({
        dossierRef: reference,
        nomClient,
        email: d.email,
        telephone: d.telephone,
        ville: d.ville,
        typeRegulLabel: situationLabel,
        situationInit,
        dossierId: dossier.id,
      })
    } catch (e) {
      console.error('Diagnostic email admin error:', e)
    }

    try {
      await sendRegularisationDiagnosticAckToClient({
        email: d.email,
        prenom: d.prenom,
        dossierRef: reference,
      })
    } catch (e) {
      console.error('Diagnostic email client error:', e)
    }

    return NextResponse.json(
      {
        success: true,
        dossierReference: reference,
        message: `Demande enregistrée sous la référence ${reference}. Un conseiller vous recontacte rapidement.`,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('POST /api/regularisation/diagnostic error:', error)
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 })
  }
}
