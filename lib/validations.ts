import { z } from 'zod'

export const LoginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Mot de passe requis'),
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
  auteurId: z.string().min(1, 'Agent requis'),
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

export type LoginInput = z.infer<typeof LoginSchema>
export type ContactInput = z.infer<typeof ContactSchema>
export type LeadInput = z.infer<typeof LeadSchema>
export type AnnonceInput = z.infer<typeof AnnonceSchema>
export type BlogPostInput = z.infer<typeof BlogPostSchema>
export type TemoignageInput = z.infer<typeof TemoignageSchema>
export type NewsletterInput = z.infer<typeof NewsletterSchema>
export type UserInput = z.infer<typeof UserSchema>
