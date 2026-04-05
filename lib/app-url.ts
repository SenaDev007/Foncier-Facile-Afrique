/**
 * URL de base absolue du site (sans slash final), pour liens serveur : e-mails, redirections, webhooks.
 * En production, définir NEXT_PUBLIC_SITE_URL et NEXTAUTH_URL sur https://www.foncierfacileafrique.fr (ou l’apex si vous l’utilisez partout).
 */
export function getServerBaseUrl(): string {
  const explicit = process.env.NEXTAUTH_URL ?? process.env.NEXT_PUBLIC_SITE_URL
  if (explicit) return explicit.replace(/\/$/, '')
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`.replace(/\/$/, '')
  if (process.env.NODE_ENV === 'production') return 'https://www.foncierfacileafrique.fr'
  return 'http://localhost:3000'
}
