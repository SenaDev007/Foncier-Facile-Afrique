import { z } from 'zod'
import {
  StatutLead,
  TypeLogement,
  StatutLogement,
  TypeRegul,
  StatutDossier,
  TypeInteractionDossier,
  StatutResa,
  StatutPayment,
} from '@prisma/client'
import { INTERACTION_TYPES } from '@/lib/lead-constants'

export const LoginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Mot de passe requis'),
})

export const ForgotPasswordSchema = z.object({
  email: z.string().email('Email invalide'),
})

export const ResetPasswordSchema = z
  .object({
    token: z.string().min(64, 'Lien invalide ou expiré'),
    password: z.string().min(8, 'Le mot de passe doit faire au moins 8 caractères'),
    confirmPassword: z.string().min(1, 'Confirmation requise'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  })

export const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Mot de passe actuel requis'),
    newPassword: z.string().min(8, 'Le nouveau mot de passe doit faire au moins 8 caractères'),
    confirmPassword: z.string().min(1, 'Confirmation requise'),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  })

export const ContactSchema = z.object({
  nom: z.string().min(2, 'Nom requis'),
  prenom: z.string().min(2, 'Prénom requis'),
  email: z.string().email('Email invalide'),
  telephone: z.string().optional(),
  sujet: z.string().optional(),
  contenu: z.string().min(10, 'Message trop court (minimum 10 caractères)'),
})

export const LeadSchema = z.object({
  nom: z.string().min(2, 'Nom requis'),
  prenom: z.string().min(2, 'Prénom requis'),
  telephone: z.string().min(8, 'Téléphone requis'),
  email: z.string().email('Email invalide').optional().or(z.literal('')),
  canal: z.enum(['FORMULAIRE', 'WHATSAPP', 'APPEL', 'EMAIL', 'REFERENCE']).default('FORMULAIRE'),
  budget: z.string().optional(),
  annonceId: z.string().optional(),
  notes: z.string().optional(),
})

export const AnnonceSchema = z.object({
  titre: z.string().min(5, 'Titre requis (min 5 caractères)'),
  type: z.enum(['TERRAIN', 'APPARTEMENT', 'MAISON', 'VILLA', 'BUREAU', 'COMMERCE']),
  statut: z.enum(['BROUILLON', 'EN_LIGNE', 'RESERVE', 'VENDU', 'ARCHIVE']).default('BROUILLON'),
  prix: z.number().min(1, 'Prix requis'),
  surface: z.number().optional().nullable(),
  localisation: z.string().min(2, 'Localisation requise'),
  departement: z.string().optional(),
  commune: z.string().optional(),
  quartier: z.string().optional(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  description: z.string().min(20, 'Description requise (min 20 caractères)'),
  documents: z.array(z.string()).default([]),
  modalitesPrix: z.string().optional(),
  auteurId: z.string().min(1, 'Agent requis').optional(),
})

export const BlogPostSchema = z.object({
  titre: z.string().min(5, 'Titre requis'),
  resume: z.string().max(150, 'Résumé trop long (150 chars max)').optional(),
  contenu: z.string().min(50, 'Contenu requis'),
  imageUne: z.string().optional(),
  statut: z.enum(['BROUILLON', 'PLANIFIE', 'PUBLIE', 'ARCHIVE']).default('BROUILLON'),
  metaTitle: z.string().max(60, 'Meta title trop long (60 chars max)').optional(),
  metaDesc: z.string().max(160, 'Meta description trop longue (160 chars max)').optional(),
  tags: z.array(z.string()).default([]),
  publishedAt: z.string().datetime().optional().nullable(),
})

export const TemoignageSchema = z.object({
  nom: z.string().min(2, 'Nom requis'),
  photo: z.string().optional(),
  texte: z.string().min(10, 'Témoignage requis'),
  note: z.number().int().min(1).max(5).default(5),
  actif: z.boolean().default(true),
  ordre: z.number().int().default(0),
})

/** Soumission d’avis depuis le site public (modération avant publication). */
export const PublicAvisSchema = z.object({
  nom: z.string().min(2, 'Indiquez au moins 2 caractères').max(100),
  texte: z.string().min(30, 'Votre avis doit contenir au moins 30 caractères').max(2000),
  note: z.coerce.number().int().min(1).max(5),
})

export const NewsletterSchema = z.object({
  email: z.string().email('Email invalide'),
})

export const UserSchema = z.object({
  name: z.string().min(2, 'Nom requis'),
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Mot de passe trop court (minimum 8 caractères)'),
  role: z.enum(['SUPER_ADMIN', 'ADMIN', 'AGENT', 'EDITEUR']).default('AGENT'),
})

export const ParametreSchema = z.object({
  cle: z.string().min(1, 'Clé requise'),
  valeur: z.string().min(1, 'Valeur requise'),
})

export const MessageReplySchema = z.object({
  messageId: z.string(),
  reponse: z.string().min(10, 'Réponse trop courte'),
})

/** Mise à jour CRM (backoffice) : au moins un champ requis. */
export const AdminLeadPatchSchema = z
  .object({
    statut: z.nativeEnum(StatutLead).optional(),
    notes: z.string().max(20000).nullable().optional(),
    prochainRappel: z.union([z.string(), z.null()]).optional(),
    agentId: z.union([z.string().min(1), z.null()]).optional(),
  })
  .refine(
    (d) =>
      d.statut !== undefined ||
      d.notes !== undefined ||
      d.prochainRappel !== undefined ||
      d.agentId !== undefined,
    { message: 'Aucun champ à mettre à jour' }
  )

export const AdminInteractionCreateSchema = z.object({
  type: z.enum(INTERACTION_TYPES),
  contenu: z.string().min(1, 'Contenu requis').max(8000),
})

export type LoginInput = z.infer<typeof LoginSchema>
export type ContactInput = z.infer<typeof ContactSchema>
export type LeadInput = z.infer<typeof LeadSchema>
export type AnnonceInput = z.infer<typeof AnnonceSchema>
export type BlogPostInput = z.infer<typeof BlogPostSchema>
export type TemoignageInput = z.infer<typeof TemoignageSchema>
export type NewsletterInput = z.infer<typeof NewsletterSchema>
export const ConfierBienSchema = z.object({
  prenom: z.string().min(2, 'Prénom requis'),
  nom: z.string().min(2, 'Nom requis'),
  telephone: z.string().min(8, 'Téléphone requis'),
  email: z.string().email('Email invalide').optional().or(z.literal('')),
  typeBien: z.enum(['TERRAIN', 'APPARTEMENT', 'MAISON', 'VILLA', 'BUREAU', 'COMMERCE']),
  objectif: z.enum(['VENDRE', 'LOUER_LONG', 'LOUER_COURT']),
  ville: z.string().min(2, 'Ville requise'),
  quartier: z.string().optional(),
  surface: z.string().optional(),
  prixSouhaite: z.string().optional(),
  documentDisponible: z.string().optional(),
  description: z.string().min(20, 'Description trop courte (minimum 20 caractères)'),
})

export const DiagnosticFoncierSchema = z.object({
  situation: z.string().min(1, 'Précisez votre situation'),
  ville: z.string().min(2, 'Ville requise'),
  description: z.string().min(15, 'Description trop courte'),
  nom: z.string().min(2, 'Nom requis'),
  prenom: z.string().min(2, 'Prénom requis'),
  telephone: z.string().min(8, 'WhatsApp / téléphone requis'),
  email: z.string().email('Email valide requis'),
})

export type UserInput = z.infer<typeof UserSchema>
export type AdminLeadPatchInput = z.infer<typeof AdminLeadPatchSchema>
export type AdminInteractionCreateInput = z.infer<typeof AdminInteractionCreateSchema>
export type ConfierBienInput = z.infer<typeof ConfierBienSchema>
export type DiagnosticFoncierInput = z.infer<typeof DiagnosticFoncierSchema>

export const ReservationPublicSchema = z.object({
  logementId: z.string().min(1),
  nomVoyageur: z.string().min(2),
  email: z.string().email(),
  telephone: z.string().min(8),
  pays: z.string().min(2).default('Bénin'),
  nbVoyageurs: z.coerce.number().int().min(1),
  dateArrivee: z.string().min(1),
  dateDepart: z.string().min(1),
  demandeSpeciale: z.string().optional(),
  transfertAero: z.boolean().optional(),
})

export const AdminLogementCreateSchema = z.object({
  reference: z.string().min(3),
  nom: z.string().min(3),
  type: z.nativeEnum(TypeLogement),
  ville: z.string().min(2),
  quartier: z.string().optional(),
  description: z.string().min(20),
  prixNuit: z.coerce.number().positive(),
  capacite: z.coerce.number().int().min(1),
  minNuits: z.coerce.number().int().min(1).optional(),
  equipements: z.array(z.string()).default([]),
  services: z.array(z.string()).default([]),
  statut: z.nativeEnum(StatutLogement).optional(),
  latitude: z.coerce.number().optional().nullable(),
  longitude: z.coerce.number().optional().nullable(),
  photos: z
    .array(
      z.object({
        url: z.string().min(1),
        alt: z.string().optional(),
        ordre: z.coerce.number().int().optional(),
      })
    )
    .optional(),
})

export const AdminLogementPatchSchema = AdminLogementCreateSchema.partial()

export const AdminDossierCreateSchema = z.object({
  reference: z.string().min(3),
  nomClient: z.string().min(2),
  emailClient: z.string().email(),
  telephoneClient: z.string().min(8),
  pays: z.string().min(2),
  typeRegul: z.nativeEnum(TypeRegul),
  situationInit: z.string().min(20),
  ville: z.string().min(2),
  quartier: z.string().optional(),
  delaiEstime: z.string().optional(),
  montantDevis: z.coerce.number().optional().nullable(),
  userId: z.string().optional().nullable(),
})

export const AdminDossierPatchSchema = z.object({
  statut: z.nativeEnum(StatutDossier).optional(),
  etapeActuelle: z.coerce.number().int().min(1).optional(),
  etapeMax: z.coerce.number().int().min(1).optional(),
  notesInternes: z.string().nullable().optional(),
  delaiEstime: z.string().nullable().optional(),
  montantDevis: z.coerce.number().nullable().optional(),
  userId: z.string().nullable().optional(),
})

export const AdminInteractionDossierSchema = z.object({
  type: z.nativeEnum(TypeInteractionDossier),
  contenu: z.string().min(1).max(8000),
})

export const AdminReservationPatchSchema = z
  .object({
    statut: z.nativeEnum(StatutResa).optional(),
    notesAdmin: z.string().max(20000).nullable().optional(),
    paymentStatut: z.nativeEnum(StatutPayment).optional(),
    paymentRef: z.string().max(200).nullable().optional(),
  })
  .refine((d) => d.statut !== undefined || d.notesAdmin !== undefined || d.paymentStatut !== undefined || d.paymentRef !== undefined, {
    message: 'Aucun champ à mettre à jour',
  })
