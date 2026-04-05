import { prisma } from '@/lib/prisma'

/**
 * Supprime une annonce : détache les leads (FK optionnelle sans cascade), puis suppression.
 * Les photos sont supprimées en cascade côté schéma Prisma.
 */
export async function deleteAnnonceById(id: string): Promise<void> {
  await prisma.lead.updateMany({ where: { annonceId: id }, data: { annonceId: null } })
  await prisma.annonce.delete({ where: { id } })
}
