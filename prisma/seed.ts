import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // ─── CLEANUP ───────────────────────────────────────────────────────────────
  // Supprimer les données existantes dans le bon ordre (respect des clés étrangères)
  await prisma.interaction.deleteMany()
  await prisma.lead.deleteMany()
  await prisma.message.deleteMany()
  await prisma.photo.deleteMany()
  await prisma.annonce.deleteMany()
  await prisma.blogPost.deleteMany()
  await prisma.temoignage.deleteMany()
  await prisma.parametre.deleteMany()
  await prisma.user.deleteMany()

  console.log('✅ Database cleaned')

  // ─── Users ────────────────────────────────────────────────────────────────
  const hashedPassword = await bcrypt.hash('Admin@2024!', 12)

  const superAdmin = await prisma.user.upsert({
    where: { email: 'isdineidisoule@gmail.com' },
    update: {},
    create: {
      name: 'Isdiné Iddi Soulé',
      email: 'isdineidisoule@gmail.com',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      active: true,
    },
  })

  const agent = await prisma.user.upsert({
    where: { email: 'agent@foncierfacile.bj' },
    update: {},
    create: {
      name: 'Agent Commercial',
      email: 'agent@foncierfacile.bj',
      password: await bcrypt.hash('Agent@2024!', 12),
      role: 'AGENT',
      active: true,
    },
  })

  console.log('✅ Users created')

  // ─── Paramètres ────────────────────────────────────────────────────────────
  const parametres = [
    { cle: 'nom_site', valeur: 'Foncier Facile Afrique' },
    { cle: 'description_site', valeur: 'Votre partenaire de confiance pour tous vos projets immobiliers en Afrique de l\'Ouest.' },
    { cle: 'email_contact', valeur: 'isdineidisoule@gmail.com' },
    { cle: 'telephone', valeur: '+229 96 90 12 04' },
    { cle: 'adresse', valeur: 'Parakou, Bénin' },
    { cle: 'whatsapp_numero', valeur: '+22996901204' },
    { cle: 'facebook_url', valeur: 'https://facebook.com/foncierfacileafrique' },
    { cle: 'linkedin_url', valeur: 'https://linkedin.com/company/foncier-facile-afrique' },
  ]

  for (const param of parametres) {
    await prisma.parametre.upsert({
      where: { cle: param.cle },
      update: { valeur: param.valeur },
      create: param,
    })
  }

  console.log('✅ Paramètres created')

  // ─── Témoignages ───────────────────────────────────────────────────────────
  const temoignages = [
    {
      nom: 'Kofi Asante',
      texte: 'Foncier Facile Afrique m\'a aidé à sécuriser mon terrain à Parakou en un temps record. Professionnels et réactifs !',
      note: 5,
      actif: true,
      ordre: 1,
    },
    {
      nom: 'Aminata Diallo',
      texte: 'Une équipe à l\'écoute, des conseils précieux. Je recommande vivement pour tout projet immobilier au Bénin.',
      note: 5,
      actif: true,
      ordre: 2,
    },
    {
      nom: 'Jean-Pierre Houénou',
      texte: 'Grâce à eux, j\'ai pu acquérir une belle villa à Porto-Novo. Accompagnement du début à la fin, merci !',
      note: 4,
      actif: true,
      ordre: 3,
    },
    {
      nom: 'Fatou Ndiaye',
      texte: 'Service irréprochable. Le simulateur de budget m\'a vraiment aidé à planifier mon investissement.',
      note: 5,
      actif: true,
      ordre: 4,
    },
  ]

  for (const t of temoignages) {
    await prisma.temoignage.create({ data: t })
  }

  console.log('✅ Témoignages created')

  // ─── Annonces ──────────────────────────────────────────────────────────────
  const annonces = [
    {
      reference: 'FFA-001',
      slug: 'terrain-100m2-calavi-parakou',
      titre: 'Terrain de 100 m² à Calavi',
      description: 'Beau terrain plat et viabilisé dans un lotissement sécurisé à Abomey-Calavi. Accès bitumé, titre foncier disponible. Idéal pour construction résidentielle.',
      type: 'TERRAIN' as const,
      statut: 'EN_LIGNE' as const,
      prix: 5_000_000,
      surface: 100,
      localisation: 'Abomey-Calavi, Bénin',
      departement: 'Atlantique',
      commune: 'Abomey-Calavi',
      quartier: 'Gbèdjromèdé',
      auteurId: superAdmin.id,
    },
    {
      reference: 'FFA-002',
      slug: 'villa-4-chambres-fidjrosse-parakou',
      titre: 'Villa 4 chambres à Fidjrossè',
      description: 'Magnifique villa moderne de 4 chambres avec piscine privée, double garage et jardin paysager. Quartier résidentiel prisé.',
      type: 'VILLA' as const,
      statut: 'EN_LIGNE' as const,
      prix: 120_000_000,
      surface: 280,
      localisation: 'Fidjrossè, Parakou',
      departement: 'Littoral',
      commune: 'Parakou',
      quartier: 'Fidjrossè',
      auteurId: superAdmin.id,
    },
    {
      reference: 'FFA-003',
      slug: 'appartement-3-pieces-akpakpa-parakou',
      titre: 'Appartement 3 pièces à Akpakpa',
      description: 'Appartement lumineux au 2ème étage d\'une résidence sécurisée. 3 pièces, cuisine équipée, parking. Proche des commodités.',
      type: 'APPARTEMENT' as const,
      statut: 'EN_LIGNE' as const,
      prix: 25_000_000,
      surface: 85,
      localisation: 'Akpakpa, Parakou',
      departement: 'Littoral',
      commune: 'Parakou',
      quartier: 'Akpakpa',
      auteurId: agent.id,
    },
    {
      reference: 'FFA-004',
      slug: 'terrain-500m2-porto-novo-seme',
      titre: 'Terrain 500 m² à Sèmè-Kpodji',
      description: 'Grand terrain en bord de route nationale. Titre foncier établi, viabilisé. Excellent pour investissement commercial ou résidentiel.',
      type: 'TERRAIN' as const,
      statut: 'RESERVE' as const,
      prix: 18_000_000,
      surface: 500,
      localisation: 'Sèmè-Kpodji, Bénin',
      departement: 'Ouémé',
      commune: 'Sèmè-Kpodji',
      quartier: 'Centre',
      auteurId: agent.id,
    },
    {
      reference: 'FFA-005',
      slug: 'local-commercial-dantokpa-parakou',
      titre: 'Local commercial proche Dantokpa',
      description: 'Local commercial de 60 m² idéalement situé à 200m du marché Dantokpa. Fort passage piétonnier. Bail commercial possible.',
      type: 'COMMERCE' as const,
      statut: 'EN_LIGNE' as const,
      prix: 8_000_000,
      surface: 60,
      localisation: 'Dantokpa, Parakou',
      departement: 'Littoral',
      commune: 'Parakou',
      quartier: 'Dantokpa',
      auteurId: superAdmin.id,
    },
  ]

  for (const annonce of annonces) {
    await prisma.annonce.create({ data: annonce })
  }

  console.log('✅ Annonces created')

  // ─── Blog Posts ────────────────────────────────────────────────────────────
  const blogPosts = [
    {
      slug: 'comment-securiser-titre-foncier-benin',
      titre: 'Comment sécuriser votre titre foncier au Bénin',
      resume: 'Guide complet sur les démarches pour obtenir et sécuriser un titre foncier au Bénin.',
      contenu: `# Comment sécuriser votre titre foncier au Bénin\n\nL'acquisition d'un bien immobilier au Bénin passe inévitablement par la sécurisation du titre foncier. Voici les étapes clés pour vous protéger.\n\n## Étape 1 : Vérifier la situation juridique du terrain\n\nAvant tout achat, consultez le registre foncier pour vérifier que le vendeur est bien le propriétaire légitime...\n\n## Étape 2 : Procéder à une transaction notariée\n\nFaites appel à un notaire agréé pour rédiger l'acte de vente...\n\n## Conclusion\n\nLa sécurisation de votre titre foncier est une étape cruciale qui protège votre investissement sur le long terme.`,
      statut: 'PUBLIE' as const,
      tags: ['titre foncier', 'bénin', 'guide', 'immobilier'],
      metaTitle: 'Sécuriser votre titre foncier au Bénin — Guide complet',
      metaDesc: 'Apprenez comment sécuriser votre titre foncier au Bénin avec notre guide étape par étape.',
      auteurId: superAdmin.id,
      publishedAt: new Date('2024-03-15'),
    },
    {
      slug: 'investir-immobilier-parakou-2024',
      titre: 'Pourquoi investir dans l\'immobilier à Parakou en 2024',
      resume: 'Analyse du marché immobilier de Parakou et les meilleures opportunités pour les investisseurs.',
      contenu: `# Pourquoi investir dans l'immobilier à Cotonou en 2024\n\nCotonou, capitale économique du Bénin, offre des opportunités d'investissement immobilier uniques en Afrique de l'Ouest.\n\n## Une économie en pleine croissance\n\nLe Bénin connaît une croissance économique soutenue de 6% par an, portée par le développement du port de Cotonou...\n\n## Des quartiers en plein développement\n\nFidjrossè, Calavi, et Sèmè-Kpodji sont les zones les plus dynamiques du marché immobilier béninois...`,
      statut: 'PUBLIE' as const,
      tags: ['investissement', 'parakou', 'marché immobilier', '2024'],
      metaTitle: 'Investir dans l\'immobilier à Parakou en 2024',
      metaDesc: 'Découvrez pourquoi Parakou est une destination d\'investissement immobilier de choix en Afrique de l\'Ouest.',
      auteurId: superAdmin.id,
      publishedAt: new Date('2024-04-10'),
    },
    {
      slug: 'guide-achat-terrain-benin',
      titre: 'Guide pratique pour l\'achat d\'un terrain au Bénin',
      resume: 'Tout ce que vous devez savoir avant d\'acheter un terrain au Bénin.',
      contenu: `# Guide pratique pour l'achat d'un terrain au Bénin\n\nAcheter un terrain au Bénin requiert de la méthode et des précautions. Voici notre guide complet.\n\n## Les documents indispensables\n\n1. Le certificat de propriété foncière\n2. Le certificat d'urbanisme\n3. L'extrait du plan cadastral\n\n## Les pièges à éviter\n\nMéfiez-vous des vendeurs qui refusent de présenter un titre foncier clair...`,
      statut: 'BROUILLON' as const,
      tags: ['terrain', 'achat', 'guide', 'bénin'],
      auteurId: agent.id,
    },
  ]

  for (const post of blogPosts) {
    await prisma.blogPost.create({ data: post })
  }

  console.log('✅ Blog posts created')

  // ─── Messages ──────────────────────────────────────────────────────────────
  await prisma.message.createMany({
    data: [
      {
        nom: 'Paul Kougblenou',
        email: 'paul.k@gmail.com',
        telephone: '+22997112233',
        sujet: 'Demande d\'information sur un terrain',
        contenu: 'Bonjour, je suis intéressé par le terrain à Calavi (FFA-001). Pouvez-vous me donner plus d\'informations sur la disponibilité et les modalités de paiement ?',
        lu: false,
      },
      {
        nom: 'Marie Adjovi',
        email: 'marie.adjovi@yahoo.fr',
        sujet: 'Visite villa Fidjrossè',
        contenu: 'Je souhaiterais organiser une visite de la villa à Fidjrossè. Quels sont vos disponibilités cette semaine ?',
        lu: true,
      },
      {
        nom: 'Ibrahim Sow',
        email: 'ibrahimsow@hotmail.com',
        telephone: '+22967889900',
        contenu: 'Bonjour, je cherche un appartement en location à Parakou, budget 150 000 FCFA/mois. Avez-vous des biens disponibles ?',
        lu: false,
      },
    ],
  })

  console.log('✅ Messages created')

  // ─── Leads ─────────────────────────────────────────────────────────────────
  const annoncesDb = await prisma.annonce.findMany({ take: 2 })

  await prisma.lead.createMany({
    data: [
      {
        nom: 'Gérard',
        prenom: 'Houénou',
        telephone: '+22995445566',
        email: 'gerard.h@gmail.com',
        canal: 'FORMULAIRE',
        budget: '15 000 000 FCFA',
        statut: 'NOUVEAU',
        annonceId: annoncesDb[0]?.id,
        agentId: agent.id,
      },
      {
        nom: 'Clémence',
        prenom: 'Dossou',
        telephone: '+22991223344',
        email: 'clemence.d@gmail.com',
        canal: 'WHATSAPP',
        budget: '50 000 000 FCFA',
        statut: 'CONTACTE',
        agentId: agent.id,
      },
      {
        nom: 'Théodore',
        prenom: 'Amoussou',
        telephone: '+22996778899',
        canal: 'APPEL',
        statut: 'EN_NEGOCIATION',
        annonceId: annoncesDb[1]?.id,
        agentId: superAdmin.id,
      },
    ],
  })

  console.log('✅ Leads created')

  console.log('\n🎉 Seeding complete!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
