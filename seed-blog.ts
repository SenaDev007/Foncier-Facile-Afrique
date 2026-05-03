import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Creating blog posts...')

  // Get an existing user or create a temporary one
  let user = await prisma.user.findFirst()
  if (!user) {
    user = await prisma.user.create({
      data: {
        name: 'Admin Foncier',
        email: 'admin@foncierfacileafrique.fr',
        password: 'hashed_password_placeholder', // Just for seeding
        role: 'SUPER_ADMIN',
      }
    })
  }

  const post1 = await prisma.blogPost.create({
    data: {
      titre: 'Comment vérifier l’authenticité d’un titre foncier au Bénin ?',
      slug: 'comment-verifier-authenticite-titre-foncier-benin',
      resume: 'La vérification d’un titre foncier est l’étape la plus cruciale avant tout achat immobilier. Découvrez les 5 points à contrôler absolument.',
      contenu: '<h2>L’importance de la vérification</h2><p>Le marché immobilier béninois est en plein essor, mais il attire aussi des individus mal intentionnés. Vérifier un titre foncier n’est pas une option, c’est une nécessité absolue.</p><h3>1. Vérifier au domaine</h3><p>La première démarche consiste à se rendre au service des domaines...</p>',
      imageUne: '/images/hero/hero-blog.jpg',
      statut: 'PUBLIE',
      tags: ['Conseil', 'Juridique', 'Bénin'],
      auteurId: user.id,
      publishedAt: new Date(),
    },
  })
  console.log('Created Blog Post 1:', post1.titre)

  const post2 = await prisma.blogPost.create({
    data: {
      titre: 'Les nouvelles tendances de l’investissement immobilier à Parakou',
      slug: 'tendances-investissement-immobilier-parakou',
      resume: 'Parakou, ville carrefour, attire de plus en plus d’investisseurs. Pourquoi cette ville du nord du Bénin est-elle le nouvel eldorado immobilier ?',
      contenu: '<h2>Parakou : un potentiel énorme</h2><p>Avec son développement d’infrastructures, Parakou devient un hub incontournable.</p><h3>Les quartiers qui montent</h3><p>Certains quartiers comme Gah et Titirou voient la valeur de leurs terres doubler tous les 3 ans...</p>',
      imageUne: '/images/hero/hero-services.jpg',
      statut: 'PUBLIE',
      tags: ['Investissement', 'Parakou', 'Marché'],
      auteurId: user.id,
      publishedAt: new Date(),
    },
  })
  console.log('Created Blog Post 2:', post2.titre)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
