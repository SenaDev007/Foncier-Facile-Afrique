import { prisma } from '@/lib/prisma'

export async function getEbooksPublic() {
  return prisma.ebook.findMany({
    where: { publie: true },
    orderBy: [{ vedette: 'desc' }, { createdAt: 'desc' }],
  })
}

export async function getEbookBySlug(slug: string) {
  return prisma.ebook.findUnique({
    where: { slug, publie: true },
  })
}

export async function getEbookById(id: string) {
  return prisma.ebook.findUnique({
    where: { id },
  })
}

export function generateEbookSlug(titre: string): string {
  return titre
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}
