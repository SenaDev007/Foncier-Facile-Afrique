const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- Nettoyage des données mock ---');

  // Supprimer les leads et leurs interactions
  const leads = await prisma.lead.deleteMany({});
  console.log(`- Leads supprimés: ${leads.count}`);

  // Supprimer les messages de contact
  const messages = await prisma.message.deleteMany({});
  console.log(`- Messages supprimés: ${messages.count}`);

  // Supprimer les dossiers fonciers
  const dossiers = await prisma.dossierFoncier.deleteMany({});
  console.log(`- Dossiers fonciers supprimés: ${dossiers.count}`);

  // Supprimer les logements, photos et réservations
  const reservations = await prisma.reservation.deleteMany({});
  const logements = await prisma.logement.deleteMany({});
  console.log(`- Réservations supprimées: ${reservations.count}`);
  console.log(`- Logements supprimés: ${logements.count}`);

  // Supprimer les Ebooks et commandes
  const commandes = await prisma.commandeEbook.deleteMany({});
  const ebooks = await prisma.ebook.deleteMany({});
  console.log(`- Commandes Ebooks supprimées: ${commandes.count}`);
  console.log(`- Ebooks supprimés: ${ebooks.count}`);

  // Supprimer les newsletters
  const newsletters = await prisma.newsletter.deleteMany({});
  console.log(`- Abonnés Newsletter supprimés: ${newsletters.count}`);

  // Supprimer le blog ? (souvent du contenu mock)
  const blogs = await prisma.blogPost.deleteMany({});
  console.log(`- Articles de blog supprimés: ${blogs.count}`);

  console.log('--- Nettoyage terminé avec succès ---');
}

main()
  .catch((e) => {
    console.error('Erreur lors du nettoyage:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
