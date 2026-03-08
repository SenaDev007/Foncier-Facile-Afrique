import type { Annonce, Photo, BlogPost, Temoignage, Lead, Message, User, Interaction } from '@prisma/client'

export type AnnonceWithPhotos = Annonce & {
  photos: Photo[]
  auteur: Pick<User, 'id' | 'name' | 'email'>
}

export type AnnonceCard = Pick<
  Annonce,
  'id' | 'reference' | 'slug' | 'titre' | 'type' | 'statut' | 'prix' | 'surface' | 'localisation' | 'documents' | 'vues' | 'createdAt'
> & {
  photos: Pick<Photo, 'id' | 'url' | 'alt' | 'ordre'>[]
}

export type BlogPostWithAuthor = BlogPost & {
  auteur: Pick<User, 'id' | 'name'>
}

export type LeadWithRelations = Lead & {
  annonce: Pick<Annonce, 'id' | 'reference' | 'titre'> | null
  agent: Pick<User, 'id' | 'name'> | null
  interactions: Interaction[]
}

export type MessageItem = Message

export type TemoignageItem = Temoignage

export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  totalPages: number
  perPage: number
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface DashboardStats {
  annoncesActives: number
  leadsThisMonth: number
  messagesNonLus: number
  vuesTotalesWeek: number
  leadsParMois: { mois: string; count: number }[]
  derniersLeads: LeadWithRelations[]
  derniersMessages: MessageItem[]
  topAnnonces: Pick<Annonce, 'id' | 'reference' | 'titre' | 'vues'>[]
  leadsEnRetard: LeadWithRelations[]
}

export interface AnnonceFiltersParams {
  type?: string
  localisation?: string
  prixMax?: number
  surfaceMin?: number
  documents?: string[]
  page?: number
  limit?: number
  sort?: string
}

export interface UploadResponse {
  url: string
  filename: string
}
