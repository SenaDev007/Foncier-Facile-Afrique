import nodemailer from 'nodemailer'

function escapeHtmlMail(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 465),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

interface MailOptions {
  to: string
  subject: string
  html: string
  replyTo?: string
}

export async function sendMail({ to, subject, html, replyTo }: MailOptions) {
  const transporter = createTransporter()
  await transporter.sendMail({
    from: process.env.EMAIL_FROM ?? 'Foncier Facile Afrique <contact@foncierfacileafrique.fr>',
    to,
    subject,
    html,
    replyTo,
  })
}

export async function sendContactNotification(data: {
  nom: string
  prenom: string
  email: string
  telephone?: string
  sujet?: string
  contenu: string
}) {
  const adminEmail = process.env.EMAIL_ADMIN ?? 'isdineidisoule@gmail.com'

  await sendMail({
    to: adminEmail,
    subject: `[FFA] Nouveau message de ${data.prenom} ${data.nom}`,
    replyTo: data.email,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1A6B3A; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Foncier Facile Afrique</h1>
          <p style="color: #E8F5EE; margin: 5px 0;">Nouveau message reçu</p>
        </div>
        <div style="padding: 24px; background: #f9f9f6; border: 1px solid #e5e7eb;">
          <h2 style="color: #1A6B3A;">Détails du message</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px; font-weight: bold; width: 130px;">Nom :</td><td style="padding: 8px;">${data.prenom} ${data.nom}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Email :</td><td style="padding: 8px;"><a href="mailto:${data.email}">${data.email}</a></td></tr>
            ${data.telephone ? `<tr><td style="padding: 8px; font-weight: bold;">Téléphone :</td><td style="padding: 8px;">${data.telephone}</td></tr>` : ''}
            ${data.sujet ? `<tr><td style="padding: 8px; font-weight: bold;">Sujet :</td><td style="padding: 8px;">${data.sujet}</td></tr>` : ''}
          </table>
          <div style="margin-top: 16px; padding: 16px; background: white; border-left: 4px solid #1A6B3A; border-radius: 4px;">
            <p style="font-weight: bold; margin: 0 0 8px;">Message :</p>
            <p style="margin: 0; white-space: pre-line;">${data.contenu}</p>
          </div>
        </div>
        <div style="padding: 16px; text-align: center; color: #6B7280; font-size: 12px;">
          <p>Foncier Facile Afrique — Parakou, Bénin</p>
        </div>
      </div>
    `,
  })

  await sendMail({
    to: data.email,
    subject: 'Confirmation de réception — Foncier Facile Afrique',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1A6B3A; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Foncier Facile Afrique</h1>
        </div>
        <div style="padding: 24px;">
          <p>Bonjour ${data.prenom},</p>
          <p>Nous avons bien reçu votre message et vous répondrons dans les plus brefs délais.</p>
          <p>Notre équipe est disponible du lundi au vendredi de 8h à 18h.</p>
          <p>Pour toute urgence, vous pouvez nous contacter directement au <strong>+229 96 90 12 04</strong>.</p>
          <p style="margin-top: 24px;">Cordialement,<br><strong>L'équipe Foncier Facile Afrique</strong></p>
        </div>
        <div style="padding: 16px; background: #1A6B3A; text-align: center;">
          <p style="color: #E8F5EE; margin: 0; font-size: 12px;">www.foncierfacileafrique.fr | +229 96 90 12 04</p>
        </div>
      </div>
    `,
  })
}

export async function sendLeadNotification(data: {
  nom: string
  prenom: string
  telephone: string
  email?: string
  annonceRef?: string
  annonceTitre?: string
  /** Bloc HTML additionnel (ex. détail « Confier mon bien »). */
  extraHtml?: string
  subject?: string
}) {
  const adminEmail = process.env.EMAIL_ADMIN ?? 'isdineidisoule@gmail.com'
  const subjectLine =
    data.subject ??
    `[FFA] Nouveau lead — ${data.prenom} ${data.nom}${data.annonceRef ? ` (${data.annonceRef})` : ''}`

  await sendMail({
    to: adminEmail,
    subject: subjectLine,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1A6B3A; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Foncier Facile Afrique</h1>
          <p style="color: #E8F5EE;">Nouveau lead entrant !</p>
        </div>
        <div style="padding: 24px; background: #f9f9f6;">
          <h2 style="color: #1A6B3A;">Informations du prospect</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px; font-weight: bold; width: 130px;">Nom :</td><td style="padding: 8px;">${data.prenom} ${data.nom}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Téléphone :</td><td style="padding: 8px;"><a href="tel:${data.telephone}">${data.telephone}</a></td></tr>
            ${data.email ? `<tr><td style="padding: 8px; font-weight: bold;">Email :</td><td style="padding: 8px;">${data.email}</td></tr>` : ''}
            ${data.annonceRef ? `<tr><td style="padding: 8px; font-weight: bold;">Annonce :</td><td style="padding: 8px;">${data.annonceRef} — ${data.annonceTitre ?? ''}</td></tr>` : ''}
          </table>
          ${data.extraHtml ?? ''}
          <div style="margin-top: 16px; text-align: center;">
            <a href="${process.env.NEXTAUTH_URL ?? 'http://localhost:3000'}/admin/leads" 
               style="background: #1A6B3A; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
              Voir le lead dans le back-office
            </a>
          </div>
        </div>
      </div>
    `,
  })
}

export async function sendRegularisationDiagnosticNotification(data: {
  dossierRef: string
  nomClient: string
  email: string
  telephone: string
  ville: string
  typeRegulLabel: string
  situationInit: string
  dossierId: string
}) {
  const adminEmail = process.env.EMAIL_ADMIN ?? 'isdineidisoule@gmail.com'
  const baseUrl = (process.env.NEXTAUTH_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '')

  await sendMail({
    to: adminEmail,
    subject: `[FFA] Diagnostic foncier — ${data.dossierRef}`,
    replyTo: data.email,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #7A3500; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Foncier Facile Afrique</h1>
          <p style="color: #F5E6D3; margin: 8px 0 0;">Nouveau diagnostic / dossier</p>
        </div>
        <div style="padding: 24px; background: #f9f9f6;">
          <p><strong>Référence dossier :</strong> ${data.dossierRef}</p>
          <p><strong>Client :</strong> ${data.nomClient}</p>
          <p><strong>Email :</strong> <a href="mailto:${data.email}">${data.email}</a></p>
          <p><strong>Téléphone / WhatsApp :</strong> ${data.telephone}</p>
          <p><strong>Ville :</strong> ${data.ville}</p>
          <p><strong>Type (indicatif) :</strong> ${data.typeRegulLabel}</p>
          <div style="margin-top: 16px; padding: 16px; background: white; border-left: 4px solid #7A3500; border-radius: 4px;">
            <p style="margin: 0; white-space: pre-line;">${escapeHtmlMail(data.situationInit)}</p>
          </div>
          <div style="margin-top: 20px; text-align: center;">
            <a href="${baseUrl}/admin/dossiers/${data.dossierId}" style="background: #7A3500; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
              Ouvrir la fiche dossier
            </a>
          </div>
        </div>
      </div>
    `,
  })
}

export async function sendRegularisationDiagnosticAckToClient(data: {
  email: string
  prenom: string
  dossierRef: string
}) {
  await sendMail({
    to: data.email,
    subject: `Demande enregistrée — ${data.dossierRef} — Foncier Facile Afrique`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #7A3500; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Foncier Facile Afrique</h1>
        </div>
        <div style="padding: 24px;">
          <p>Bonjour ${data.prenom},</p>
          <p>Nous avons bien reçu votre demande de <strong>diagnostic foncier</strong>.</p>
          <p><strong>Votre référence :</strong> ${data.dossierRef}</p>
          <p>Un conseiller vous recontacte rapidement pour la suite. Pour toute question : <strong>+229 96 90 12 04</strong>.</p>
          <p style="margin-top: 24px;">Cordialement,<br><strong>L'équipe Foncier Facile Afrique</strong></p>
        </div>
      </div>
    `,
  })
}

export async function sendReservationRequestAdminEmail(data: {
  reservationRef: string
  nomVoyageur: string
  email: string
  telephone: string
  logementNom: string
  montantTotal: number
  nbNuits: number
  reservationId: string
}) {
  const adminEmail = process.env.EMAIL_ADMIN ?? 'isdineidisoule@gmail.com'
  const baseUrl = (process.env.NEXTAUTH_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '')
  const montant = new Intl.NumberFormat('fr-FR').format(Math.round(data.montantTotal)) + ' FCFA'

  await sendMail({
    to: adminEmail,
    subject: `[FFA] Nouvelle réservation — ${data.reservationRef} — ${data.logementNom}`,
    replyTo: data.email,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #5B2C6F; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Foncier Facile Afrique</h1>
          <p style="color: #E8D4F0;">Demande de réservation (en attente)</p>
        </div>
        <div style="padding: 24px; background: #f9f9f6;">
          <p><strong>Référence :</strong> ${data.reservationRef}</p>
          <p><strong>Voyageur :</strong> ${data.nomVoyageur}</p>
          <p><strong>Email :</strong> <a href="mailto:${data.email}">${data.email}</a></p>
          <p><strong>Téléphone :</strong> ${data.telephone}</p>
          <p><strong>Logement :</strong> ${data.logementNom}</p>
          <p><strong>Nuits :</strong> ${data.nbNuits}</p>
          <p><strong>Montant estimé :</strong> ${montant}</p>
          <div style="margin-top: 20px; text-align: center;">
            <a href="${baseUrl}/admin/reservations/${data.reservationId}" style="background: #5B2C6F; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
              Traiter la réservation
            </a>
          </div>
        </div>
      </div>
    `,
  })
}

export async function sendReservationRequestTravelerEmail(data: {
  email: string
  nomVoyageur: string
  reference: string
  logementNom: string
  montantTotal: number
  nbNuits: number
}) {
  const montant = new Intl.NumberFormat('fr-FR').format(Math.round(data.montantTotal)) + ' FCFA'
  await sendMail({
    to: data.email,
    subject: `[FFA] Demande de réservation reçue — ${data.reference}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #5B2C6F; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Foncier Facile Afrique</h1>
          <p style="color: #E8D4F0;">Séjour & tourisme</p>
        </div>
        <div style="padding: 24px; background: #f9f9f6;">
          <p>Bonjour ${data.nomVoyageur},</p>
          <p>Nous avons bien enregistré votre demande de réservation <strong>${data.reference}</strong> pour <strong>${data.logementNom}</strong>.</p>
          <p><strong>Nuits :</strong> ${data.nbNuits} · <strong>Total estimé :</strong> ${montant}</p>
          <p>Notre équipe vérifie la disponibilité et vous confirme par e-mail ou téléphone. Vous recevrez ensuite les modalités de paiement si la réservation est confirmée.</p>
          <p style="font-size: 14px; color: #555;">Besoin d'aide ? <strong>+229 96 90 12 04</strong></p>
          <p style="margin-top: 24px;">Cordialement,<br><strong>L'équipe Foncier Facile Afrique</strong></p>
        </div>
      </div>
    `,
  })
}

export async function sendReservationConfirmationEmail(data: {
  email: string
  nomVoyageur: string
  reference: string
  logementNom: string
  dateArrivee: string
  dateDepart: string
  nbNuits: number
  montantTotal: number
}) {
  const montant = new Intl.NumberFormat('fr-FR').format(Math.round(data.montantTotal)) + ' FCFA'
  await sendMail({
    to: data.email,
    subject: `[FFA] Réservation confirmée — ${data.reference}`,
    replyTo: process.env.EMAIL_FROM,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #5B2C6F; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Foncier Facile Afrique</h1>
          <p style="color: #E8D4F0; margin: 8px 0 0;">Séjour & tourisme</p>
        </div>
        <div style="padding: 24px; background: #f9f9f6;">
          <p>Bonjour ${data.nomVoyageur},</p>
          <p>Votre demande de réservation <strong>${data.reference}</strong> a été <strong>confirmée</strong>.</p>
          <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
            <tr><td style="padding: 8px; font-weight: bold;">Logement</td><td style="padding: 8px;">${data.logementNom}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Arrivée</td><td style="padding: 8px;">${data.dateArrivee}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Départ</td><td style="padding: 8px;">${data.dateDepart}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Nuits</td><td style="padding: 8px;">${data.nbNuits}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Montant total</td><td style="padding: 8px;">${montant}</td></tr>
          </table>
          <p style="font-size: 14px; color: #555;">Vous recevrez prochainement le lien de paiement si ce n’est pas déjà fait. Pour toute question : <strong>+229 96 90 12 04</strong>.</p>
          <p style="margin-top: 24px;">Cordialement,<br><strong>L’équipe Foncier Facile Afrique</strong></p>
        </div>
      </div>
    `,
  })
}

export async function sendNewsletterConfirmation(email: string) {
  await sendMail({
    to: email,
    subject: 'Bienvenue dans la newsletter de Foncier Facile Afrique',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1A6B3A; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Foncier Facile Afrique</h1>
        </div>
        <div style="padding: 24px;">
          <h2>Inscription confirmée !</h2>
          <p>Vous êtes maintenant inscrit(e) à notre newsletter. Vous recevrez en exclusivité :</p>
          <ul>
            <li>Les nouvelles annonces disponibles</li>
            <li>Des conseils immobiliers pour l'Afrique de l'Ouest</li>
            <li>Les actualités du secteur foncier au Bénin</li>
          </ul>
          <p style="margin-top: 24px;">Cordialement,<br><strong>L'équipe Foncier Facile Afrique</strong></p>
        </div>
        <div style="padding: 16px; background: #1A6B3A; text-align: center;">
          <p style="color: #E8F5EE; margin: 0; font-size: 12px;">www.foncierfacileafrique.fr | +229 96 90 12 04</p>
        </div>
      </div>
    `,
  })
}
