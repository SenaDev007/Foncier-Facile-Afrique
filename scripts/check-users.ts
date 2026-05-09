import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const users = await prisma.user.findMany({ select: { id: true, name: true, email: true, role: true } })
  console.log('Utilisateurs en BDD:')
  users.forEach(u => console.log(`  [${u.role}] ${u.name} — ${u.email}`))
}
main().catch(console.error).finally(() => prisma.$disconnect())
