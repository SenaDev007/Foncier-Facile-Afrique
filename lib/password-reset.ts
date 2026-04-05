import { createHash, randomBytes } from 'crypto'
import { prisma } from '@/lib/prisma'

const TOKEN_BYTES = 32
/** Durée de validité du lien (recommandation OWASP : court). */
const EXPIRES_MINUTES = 60

export function hashResetToken(rawToken: string): string {
  return createHash('sha256').update(rawToken, 'utf8').digest('hex')
}

/** Génère un jeton opaque, l’enregistre en base et renvoie le secret à mettre dans l’URL (une seule fois). */
export async function createPasswordResetToken(userId: string): Promise<string> {
  const raw = randomBytes(TOKEN_BYTES).toString('hex')
  const tokenHash = hashResetToken(raw)
  const expiresAt = new Date(Date.now() + EXPIRES_MINUTES * 60 * 1000)

  await prisma.$transaction([
    prisma.passwordResetToken.deleteMany({ where: { userId } }),
    prisma.passwordResetToken.create({
      data: { userId, tokenHash, expiresAt },
    }),
  ])

  return raw
}

export async function consumePasswordResetToken(rawToken: string): Promise<{ userId: string } | null> {
  const tokenHash = hashResetToken(rawToken)
  const row = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
  })
  if (!row || row.expiresAt < new Date()) {
    if (row) await prisma.passwordResetToken.delete({ where: { id: row.id } }).catch(() => {})
    return null
  }
  await prisma.passwordResetToken.delete({ where: { id: row.id } })
  return { userId: row.userId }
}
