import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import SlugifyLib from 'slugify'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA'
}

export function slugify(text: string): string {
  return SlugifyLib(text, {
    lower: true,
    strict: true,
    locale: 'fr',
  })
}

export function generateReference(count: number): string {
  const year = new Date().getFullYear()
  const padded = String(count + 1).padStart(3, '0')
  return `FFA-${year}-${padded}`
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatDateShort(date: Date | string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date))
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trimEnd() + '...'
}

export function getWhatsAppUrl(phone: string, message?: string): string {
  const cleanPhone = phone.replace(/\D/g, '')
  const encodedMessage = message ? encodeURIComponent(message) : ''
  return `https://wa.me/${cleanPhone}${encodedMessage ? `?text=${encodedMessage}` : ''}`
}

export function getStatutColor(statut: string): string {
  const colors: Record<string, string> = {
    EN_LIGNE: 'bg-green-100 text-green-800',
    RESERVE: 'bg-orange-100 text-orange-800',
    VENDU: 'bg-red-100 text-red-800',
    BROUILLON: 'bg-gray-100 text-gray-800',
    ARCHIVE: 'bg-gray-100 text-gray-500',
    NOUVEAU: 'bg-blue-100 text-blue-800',
    CONTACTE: 'bg-yellow-100 text-yellow-800',
    EN_NEGOCIATION: 'bg-purple-100 text-purple-800',
    GAGNE: 'bg-green-100 text-green-800',
    PERDU: 'bg-red-100 text-red-800',
    PUBLIE: 'bg-green-100 text-green-800',
    PLANIFIE: 'bg-blue-100 text-blue-800',
  }
  return colors[statut] ?? 'bg-gray-100 text-gray-800'
}

export function getStatutLabel(statut: string): string {
  const labels: Record<string, string> = {
    EN_LIGNE: 'En ligne',
    RESERVE: 'Réservé',
    VENDU: 'Vendu',
    BROUILLON: 'Brouillon',
    ARCHIVE: 'Archivé',
    NOUVEAU: 'Nouveau',
    CONTACTE: 'Contacté',
    EN_NEGOCIATION: 'En négociation',
    GAGNE: 'Gagné',
    PERDU: 'Perdu',
    PUBLIE: 'Publié',
    PLANIFIE: 'Planifié',
    TERRAIN: 'Terrain',
    APPARTEMENT: 'Appartement',
    MAISON: 'Maison',
    VILLA: 'Villa',
    BUREAU: 'Bureau',
    COMMERCE: 'Commerce',
    FORMULAIRE: 'Formulaire',
    WHATSAPP: 'WhatsApp',
    APPEL: 'Appel',
    EMAIL: 'Email',
    REFERENCE: 'Référence',
  }
  return labels[statut] ?? statut
}

export function rateLimit(
  map: Map<string, { count: number; resetAt: number }>,
  key: string,
  limit: number,
  windowMs: number,
): boolean {
  const now = Date.now()
  const entry = map.get(key)

  if (!entry || now > entry.resetAt) {
    map.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }

  if (entry.count >= limit) return false

  entry.count++
  return true
}
