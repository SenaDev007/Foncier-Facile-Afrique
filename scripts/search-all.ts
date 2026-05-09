import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const oldName = 'Isdiné Iddi Soulé'
  const oldName2 = 'Isdiné'
  
  // Search in all text fields of all models
  const users = await prisma.user.findMany({ where: { name: { contains: oldName2, mode: 'insensitive' } } })
  const posts = await prisma.blogPost.findMany({ where: { contenu: { contains: oldName2, mode: 'insensitive' } } })
  const sections = await prisma.pageSection.findMany({ where: { OR: [
    { titre: { contains: oldName2, mode: 'insensitive' } },
    { sousTitre: { contains: oldName2, mode: 'insensitive' } },
    { bodyHtml: { contains: oldName2, mode: 'insensitive' } }
  ] } })
  const leads = await prisma.lead.findMany({ where: { OR: [
    { nom: { contains: oldName2, mode: 'insensitive' } },
    { prenom: { contains: oldName2, mode: 'insensitive' } }
  ] } })

  console.log('Results for "Isdiné":')
  console.log('Users:', users.map(u => ({ id: u.id, name: u.name, email: u.email })))
  console.log('Posts:', posts.map(p => p.titre))
  console.log('Sections:', sections.map(s => s.titre))
  console.log('Leads:', leads.map(l => l.nom))
}
main().catch(console.error).finally(() => prisma.$disconnect())
