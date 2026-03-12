#!/bin/bash
# Télécharge les images Unsplash pour le site (libres de droits)
set -e
BASE="d:/Projet YEHI OR Tech/Site web- Foncier Facile Afrique"
cd "$BASE"
mkdir -p public/images/hero public/images/services public/images/annonces public/images/blog public/images/team public/images/ebooks

# Hero
curl -sL "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1920&q=85" -o public/images/hero/hero-bg.jpg
curl -sL "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=768&q=80" -o public/images/hero/hero-bg-mobile.jpg

# Services
curl -sL "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&q=80" -o public/images/services/conseil-foncier.jpg
curl -sL "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=80" -o public/images/services/verification-docs.jpg
curl -sL "https://images.unsplash.com/photo-1448630360428-65456885c650?w=600&q=80" -o public/images/services/courtage-immobilier.jpg
curl -sL "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&q=80" -o public/images/services/diaspora.jpg
curl -sL "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=600&q=80" -o public/images/services/recherche-terrain.jpg

# Annonces (fallbacks par type)
curl -sL "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=600&q=80" -o public/images/annonces/terrain.jpg
curl -sL "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80" -o public/images/annonces/maison.jpg
curl -sL "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80" -o public/images/annonces/appartement.jpg
curl -sL "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=600&q=80" -o public/images/annonces/villa.jpg
curl -sL "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80" -o public/images/annonces/bureau.jpg
curl -sL "https://images.unsplash.com/photo-1555529771-7888783a18d3?w=600&q=80" -o public/images/annonces/commerce.jpg

# Blog (fallbacks)
curl -sL "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=600&q=80" -o public/images/blog/investissement.jpg
curl -sL "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&q=80" -o public/images/blog/titre-foncier.jpg
curl -sL "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80" -o public/images/blog/marche-immobilier.jpg

# Ebooks (couvertures démo)
curl -sL "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=400&q=85" -o public/images/ebooks/guide-securiser-terrain.jpg
curl -sL "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&q=85" -o public/images/ebooks/pack-contrats-fonciers.jpg
curl -sL "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&q=85" -o public/images/ebooks/investir-diaspora.jpg

# Team / témoignages (avatars)
curl -sL "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80" -o public/images/team/avatar-homme.jpg
curl -sL "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80" -o public/images/team/avatar-femme.jpg

echo "Images téléchargées."
