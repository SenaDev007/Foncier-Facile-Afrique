import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const sections = await prisma.pageSection.findMany({
    where: {
      OR: [
        { titre: { contains: 'Isdin', mode: 'insensitive' } },
        { sousTitre: { contains: 'Isdin', mode: 'insensitive' } },
        { bodyHtml: { contains: 'Isdin', mode: 'insensitive' } },
      ]
    }
  })
  console.log(JSON.stringify(sections, null, 2))
}
main().catch(console.error).finally(() => prisma.$disconnect())
