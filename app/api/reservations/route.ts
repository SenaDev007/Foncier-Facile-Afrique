import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ReservationPublicSchema } from '@/lib/validations'
import { rateLimit } from '@/lib/utils'
import { computeNights, generateReservationReference } from '@/lib/booking'
import { sendReservationRequestAdminEmail, sendReservationRequestTravelerEmail } from '@/lib/mail'

const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function splitNomVoyageur(full: string): { prenom: string; nom: string } {
  const p = full.trim().split(/\s+/).filter(Boolean)
  if (p.length === 0) return { prenom: 'Client', nom: 'Séjour' }
  if (p.length === 1) return { prenom: p[0], nom: 'Réservation' }
  return { prenom: p[0], nom: p.slice(1).join(' ') }
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') ?? 'unknown'
    if (!rateLimit(rateLimitMap, ip, 8, 60_000)) {
      return NextResponse.json({ error: 'Trop de requêtes' }, { status: 429 })
    }

    const body = await request.json()
    const parsed = ReservationPublicSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? 'Données invalides' },
        { status: 400 }
      )
    }

    const d = parsed.data
    const dateArrivee = new Date(d.dateArrivee)
    const dateDepart = new Date(d.dateDepart)
    if (Number.isNaN(dateArrivee.getTime()) || Number.isNaN(dateDepart.getTime())) {
      return NextResponse.json({ error: 'Dates invalides' }, { status: 400 })
    }
    if (dateDepart <= dateArrivee) {
      return NextResponse.json({ error: 'La date de départ doit être après l’arrivée' }, { status: 400 })
    }

    const logement = await prisma.logement.findFirst({
      where: { id: d.logementId, deletedAt: null, statut: 'DISPONIBLE' },
    })
    if (!logement) {
      return NextResponse.json({ error: 'Logement indisponible' }, { status: 404 })
    }

    const nbNuits = computeNights(dateArrivee, dateDepart)
    if (nbNuits < logement.minNuits) {
      return NextResponse.json(
        { error: `Durée minimum : ${logement.minNuits} nuit(s)` },
        { status: 400 }
      )
    }
    if (d.nbVoyageurs > logement.capacite) {
      return NextResponse.json(
        { error: `Capacité max : ${logement.capacite} voyageur(s)` },
        { status: 400 }
      )
    }

    const fraisService = 10_000
    const montantTotal = logement.prixNuit * nbNuits + fraisService
    const reference = generateReservationReference()
    const { prenom, nom } = splitNomVoyageur(d.nomVoyageur)

    const reservation = await prisma.$transaction(async (tx) => {
      const resa = await tx.reservation.create({
        data: {
          reference,
          logementId: logement.id,
          nomVoyageur: d.nomVoyageur,
          email: d.email,
          telephone: d.telephone,
          pays: d.pays,
          nbVoyageurs: d.nbVoyageurs,
          dateArrivee,
          dateDepart,
          nbNuits,
          montantTotal,
          fraisService,
          statut: 'EN_ATTENTE',
          demandeSpeciale: d.demandeSpeciale ?? null,
          transfertAero: d.transfertAero ?? false,
        },
      })

      await tx.lead.create({
        data: {
          nom,
          prenom,
          telephone: d.telephone,
          email: d.email,
          canal: 'FORMULAIRE',
          statut: 'NOUVEAU',
          pole: 'SEJOUR',
          priorite: 'NORMALE',
          notes: [
            `[Pôle Séjour — demande de réservation web]`,
            `Réf. réservation : ${resa.reference}`,
            `Logement : ${logement.nom} (${logement.reference})`,
            `Arrivée : ${dateArrivee.toISOString().slice(0, 10)} — Départ : ${dateDepart.toISOString().slice(0, 10)}`,
            `Voyageurs : ${d.nbVoyageurs} — Pays : ${d.pays}`,
            d.demandeSpeciale ? `Demande spéciale : ${d.demandeSpeciale}` : null,
            d.transfertAero ? 'Transfert aéroport : oui' : null,
            '',
            `Lien back-office réservation : /admin/reservations/${resa.id}`,
          ]
            .filter(Boolean)
            .join('\n'),
        },
      })

      return resa
    })

    try {
      await sendReservationRequestAdminEmail({
        reservationRef: reservation.reference,
        nomVoyageur: d.nomVoyageur,
        email: d.email,
        telephone: d.telephone,
        logementNom: logement.nom,
        montantTotal: reservation.montantTotal,
        nbNuits: reservation.nbNuits,
        reservationId: reservation.id,
      })
    } catch (e) {
      console.error('Réservation email admin:', e)
    }

    try {
      await sendReservationRequestTravelerEmail({
        email: d.email,
        nomVoyageur: d.nomVoyageur,
        reference: reservation.reference,
        logementNom: logement.nom,
        montantTotal: reservation.montantTotal,
        nbNuits: reservation.nbNuits,
      })
    } catch (e) {
      console.error('Réservation email voyageur:', e)
    }

    return NextResponse.json(
      {
        data: reservation,
        message:
          'Demande enregistrée. Notre équipe confirme la disponibilité et vous envoie le lien de paiement sous peu.',
      },
      { status: 201 }
    )
  } catch (e) {
    console.error('POST /api/reservations', e)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
