import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { DEFAULT_PUBLIC_SERVICE_CARDS, SERVICES_CARDS_PARAM_KEY } from '../lib/public-services'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // ─── CLEANUP ───────────────────────────────────────────────────────────────
  // Supprimer les données existantes dans le bon ordre (respect des clés étrangères)
  await prisma.commandeEbook.deleteMany()
  await prisma.ebook.deleteMany()
  await prisma.interactionDossier.deleteMany()
  await prisma.dossierFoncier.deleteMany()
  await prisma.reservation.deleteMany()
  await prisma.logementPhoto.deleteMany()
  await prisma.logement.deleteMany()
  await prisma.pageSection.deleteMany()
  await prisma.page.deleteMany()
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
    // Chiffres clés (section « Notre impact » — lus par l’accueil via Paramètres)
    { cle: 'chiffre_clients', valeur: '500' },
    { cle: 'chiffre_satisfaction', valeur: '98' },
    { cle: 'chiffre_annees', valeur: '10' },
    { cle: 'chiffre_transactions', valeur: '1000' },
    { cle: 'chiffre_annees_texte', valeur: '5' },
  ]

  for (const param of parametres) {
    await prisma.parametre.upsert({
      where: { cle: param.cle },
      update: { valeur: param.valeur },
      create: param,
    })
  }

  await prisma.parametre.upsert({
    where: { cle: SERVICES_CARDS_PARAM_KEY },
    update: { valeur: JSON.stringify(DEFAULT_PUBLIC_SERVICE_CARDS) },
    create: { cle: SERVICES_CARDS_PARAM_KEY, valeur: JSON.stringify(DEFAULT_PUBLIC_SERVICE_CARDS) },
  })

  console.log('✅ Paramètres created')

  // ─── Pages & Sections (contenus pilotés par le backoffice) ─────────────────
  const pagesData: Array<{ slug: string; titre: string; sections: Array<Record<string, unknown>> }> = [
    {
      slug: 'home',
      titre: 'Page d\'accueil',
      sections: [
        { key: 'hero_badge', ordre: 0, actif: true, titre: 'Votre partenaire immobilier sécurisé en Afrique de l\'Ouest' },
        { key: 'hero_sous_titre', ordre: 1, actif: true, sousTitre: '200+ clients satisfaits · Documents vérifiés · 5 ans d\'expérience' },
        { key: 'hero_titre', ordre: 2, actif: true, titre: 'Achetez un terrain en toute sécurité au Bénin' },
        { key: 'hero_texte', ordre: 3, actif: true, bodyHtml: 'Foncier Facile Afrique vous accompagne dans l\'acquisition de terrains et biens immobiliers avec titre foncier vérifié, de Parakou à tout le Bénin.' },
        { key: 'hero_cta_annonces', ordre: 4, actif: true, boutonTexte: 'Voir les annonces', boutonUrl: '/annonces' },
        { key: 'hero_cta_contact', ordre: 5, actif: true, boutonTexte: 'Nous contacter', boutonUrl: '/contact' },
        { key: 'chiffres_intro', ordre: 10, actif: true, titre: 'Notre impact en quelques chiffres', sousTitre: 'Plus de 5 ans d\'expertise au service de votre patrimoine immobilier' },
        { key: 'services_intro', ordre: 20, actif: true, titre: 'Nos services', sousTitre: 'Ce que nous proposons', bodyHtml: 'Une gamme complète de services pour sécuriser votre patrimoine immobilier.' },
        { key: 'annonces_intro', ordre: 30, actif: true, titre: 'Dernières annonces', sousTitre: 'À la une', bodyHtml: 'Terrains et biens immobiliers sécurisés disponibles' },
        { key: 'avis_clients', ordre: 35, actif: true, titre: 'Ce que disent nos clients', sousTitre: 'Avis vérifiés', bodyHtml: 'Avis publiés par des clients ayant travaillé avec Foncier Facile Afrique. Chaque témoignage est validé en interne.' },
        { key: 'blog_intro', ordre: 40, actif: true, titre: 'Blog & Conseils', sousTitre: 'Ressources', bodyHtml: 'Expertise foncière et immobilière en Afrique' },
      ],
    },
    {
      slug: 'services',
      titre: 'Page Services',
      sections: [
        { key: 'hero', ordre: 0, actif: true, titre: 'Nos services', sousTitre: 'Nos expertises', bodyHtml: 'Des solutions complètes pour sécuriser et développer votre patrimoine immobilier en Afrique de l\'Ouest.', boutonTexte: 'Prendre rendez-vous', boutonUrl: '/contact' },
        { key: 'cta_bas', ordre: 100, actif: true, titre: 'Prêt à investir en toute sécurité ?', sousTitre: 'Contactez nos experts pour une consultation gratuite et sans engagement.', boutonTexte: 'Nous contacter', boutonUrl: '/contact' },
      ],
    },
    {
      slug: 'footer',
      titre: 'Pied de page',
      sections: [
        { key: 'tagline', ordre: 0, actif: true, titre: 'Foncier Facile Afrique · Expertise foncière & immobilière premium' },
        { key: 'sous_tagline', ordre: 1, actif: true, sousTitre: 'Sécurisation juridique · Vérification documentaire · Accompagnement clé en main' },
        { key: 'description', ordre: 2, actif: true, bodyHtml: 'Votre partenaire de confiance pour l\'acquisition de terrains et biens immobiliers juridiquement sécurisés en Afrique de l\'Ouest.' },
        { key: 'newsletter_intro', ordre: 3, actif: true, bodyHtml: 'Recevez nos nouvelles annonces, conseils fonciers et opportunités d\'investissement en Afrique de l\'Ouest.' },
        { key: 'links_services', ordre: 10, actif: true, contenuJson: JSON.stringify([{ href: '/services#conseil-foncier', label: 'Conseil foncier' }, { href: '/services#verification-docs', label: 'Vérification documentaire' }, { href: '/services#recherche-terrain', label: 'Recherche terrain' }, { href: '/services#diaspora', label: 'Accompagnement diaspora' }]) },
        { key: 'links_utiles', ordre: 11, actif: true, contenuJson: JSON.stringify([{ href: '/annonces', label: 'Nos annonces' }, { href: '/services', label: 'Nos services' }, { href: '/blog', label: 'Blog' }, { href: '/contact', label: 'Contact' }, { href: '/mentions-legales', label: 'Mentions légales' }]) },
      ],
    },
  ]

  for (const p of pagesData) {
    const page = await prisma.page.create({
      data: {
        slug: p.slug,
        titre: p.titre,
      },
    })
    for (const s of p.sections) {
      await prisma.pageSection.create({
        data: {
          pageId: page.id,
          key: s.key as string,
          ordre: (s.ordre as number) ?? 0,
          actif: (s.actif as boolean) ?? true,
          titre: s.titre as string | undefined,
          sousTitre: s.sousTitre as string | undefined,
          bodyHtml: s.bodyHtml as string | undefined,
          boutonTexte: s.boutonTexte as string | undefined,
          boutonUrl: s.boutonUrl as string | undefined,
          contenuJson: s.contenuJson as string | undefined,
        },
      })
    }
  }

  console.log('✅ Pages & sections created')

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
      texte: 'Service irréprochable. L’équipe m’a vraiment aidé à planifier mon investissement avec des conseils clairs.',
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

  // ─── Ebooks ───────────────────────────────────────────────────────────────────
  const ebooks = [
    {
      titre: 'Guide complet pour sécuriser un terrain au Bénin',
      slug: 'guide-securiser-terrain-benin',
      description:
        'Un guide pas-à-pas pour vérifier un terrain, éviter les arnaques et sécuriser vos investissements fonciers au Bénin.',
      contenu: null,
      prixCFA: 15000,
      prixPromo: 9900,
      codePromo: 'LANCEMENT10',
      codePromoType: 'POURCENTAGE',
      codePromoValeur: 10,
      couverture: '/images/ebooks/guide-securiser-terrain.jpg',
      fichierPdf: '/ebooks/pdf/guide-securiser-terrain-benins.pdf',
      apercuPdf: '/ebooks/apercus/guide-securiser-terrain-apercu.pdf',
      pages: 72,
      categorie: 'Guide foncier',
      auteur: 'Foncier Facile Afrique',
      publie: true,
      vedette: true,
    },
    {
      titre: 'Pack de modèles de contrats fonciers (Bénin)',
      slug: 'pack-modeles-contrats-fonciers-benin',
      description:
        'Un pack de modèles prêts à l’emploi : promesse de vente, contrat de vente, bail, reconnaissance de dette, adaptés au contexte béninois.',
      contenu: null,
      prixCFA: 25000,
      prixPromo: 19900,
      codePromo: null,
      codePromoType: null,
      codePromoValeur: null,
      couverture: '/images/ebooks/pack-contrats-fonciers.jpg',
      fichierPdf: '/ebooks/pdf/pack-contrats-fonciers-benin.pdf',
      apercuPdf: '/ebooks/apercus/pack-contrats-fonciers-apercu.pdf',
      pages: 110,
      categorie: 'Modèles & contrats',
      auteur: 'Foncier Facile Afrique',
      publie: true,
      vedette: false,
    },
    {
      titre: 'Investir dans la pierre depuis la diaspora',
      slug: 'investir-immobilier-diaspora-benin',
      description:
        'Stratégies, check-lists et erreurs à éviter pour investir dans l’immobilier au Bénin quand on vit en Europe ou en Amérique.',
      contenu: null,
      prixCFA: 18000,
      prixPromo: null,
      codePromo: null,
      codePromoType: null,
      codePromoValeur: null,
      couverture: '/images/ebooks/investir-diaspora.jpg',
      fichierPdf: '/ebooks/pdf/investir-immobilier-diaspora-benin.pdf',
      apercuPdf: '/ebooks/apercus/investir-diaspora-apercu.pdf',
      pages: 88,
      categorie: 'Diaspora & investissement',
      auteur: 'Foncier Facile Afrique',
      publie: true,
      vedette: true,
    },
  ]

  for (const ebook of ebooks) {
    await prisma.ebook.create({ data: ebook })
  }

  console.log('✅ Ebooks created')

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

  // ─── Logements séjour (démo) ─────────────────────────────────────────────
  await prisma.logement.create({
    data: {
      reference: 'L-PAR-001',
      nom: 'Villa Les Palmiers — Parakou',
      type: 'VILLA_VAC',
      ville: 'Parakou',
      quartier: 'Banikanni',
      description:
        'Villa meublée 3 chambres, jardin, sécurité 24h/24. Idéale pour séjours famille ou affaires.',
      prixNuit: 85000,
      capacite: 6,
      minNuits: 2,
      note: 4.8,
      nbAvis: 12,
      equipements: ['Wifi', 'Climatisation', 'Cuisine équipée', 'Parking'],
      services: ['Check-in flexible', 'Ménage'],
      statut: 'DISPONIBLE',
      photos: {
        create: [
          { url: '/images/services/diaspora.jpg', alt: 'Villa Parakou', ordre: 0 },
        ],
      },
    },
  })

  await prisma.logement.create({
    data: {
      reference: 'L-COT-002',
      nom: 'Appartement centre — Cotonou',
      type: 'APPARTEMENT',
      ville: 'Cotonou',
      quartier: 'Haie Vive',
      description: 'Appartement T3 climatisé, proche du boulevard, connexion haut débit.',
      prixNuit: 65000,
      capacite: 4,
      minNuits: 1,
      note: 4.5,
      nbAvis: 8,
      equipements: ['Wifi', 'Clim', 'Cuisine'],
      services: ['Transfert aéroport (option)'],
      statut: 'DISPONIBLE',
      photos: {
        create: [{ url: '/images/services/conseil-foncier.jpg', alt: 'Appartement', ordre: 0 }],
      },
    },
  })

  await prisma.dossierFoncier.create({
    data: {
      reference: 'DOS-2026-DEMO',
      nomClient: 'Kossi Mensah',
      emailClient: 'kossi@example.com',
      telephoneClient: '+22990111222',
      pays: 'Bénin',
      typeRegul: 'PH_TO_TF',
      situationInit: 'Parcelle avec permis d’habiter, demande de passage au titre foncier.',
      ville: 'Parakou',
      quartier: 'Aveloukandi',
      etapeActuelle: 2,
      statut: 'EN_COURS',
      delaiEstime: '90 à 120 jours',
      userId: agent.id,
      interactions: {
        create: {
          type: 'NOTE',
          contenu: 'Premier échange téléphonique : dossier complet demandé au client.',
          userId: agent.id,
        },
      },
    },
  })

  console.log('✅ Logements démo (L-PAR-001, L-COT-002) + dossier DOS-2026-DEMO')

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
