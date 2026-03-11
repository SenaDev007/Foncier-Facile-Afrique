# 🛠️ Système de Gestion Complet — Backoffice BDD

## 📋 Modules de gestion

### 1. **Gestion des Annonces** ✅
- **URL** : `/admin/annonces`
- **CRUD complet** : Créer, Lire, Mettre à jour, Supprimer
- **Filtres** : Par type, statut, recherche
- **Statuts** : Brouillon, En ligne, Réservé, Vendu, Archivé
- **Types** : Terrain, Maison, Appartement, Villa, Bureau, Commerce

### 2. **Gestion des Services** ✅
- **URL** : `/admin/services`
- **Upload images** : Interface drag & drop
- **Textes éditables** : Titres et descriptions
- **Stockage BDD** : Données sauvegardées en JSON
- **URLs publiques** : Images optimisées

### 3. **Gestion du Blog** 🚧
- **URL** : `/admin/blog` (à créer)
- **Articles** : CRUD complet
- **Catégories** : Gestion des tags
- **Publication** : Brouillon → Publié
- **SEO** : Meta descriptions, slugs

### 4. **Gestion des Avis** 🚧
- **URL** : `/admin/avis` (à créer)
- **Modération** : Approuver/Rejeter
- **Notes** : 1-5 étoiles
- **Réponses** : Répondre aux avis

## 🗄️ Architecture Base de Données

### Tables principales
```sql
-- Annonces immobilières
Annonce {
  id, reference, slug, titre, description
  type (TERRAIN|MAISON|APPARTEMENT|VILLA|BUREAU|COMMERCE)
  statut (BROUILLON|EN_LIGNE|RESERVE|VENDU|ARCHIVE)
  prix, surface, localisation
  photos[], auteurId, createdAt, updatedAt
}

-- Articles de blog
BlogPost {
  id, slug, titre, contenu, extrait
  statut (BROUILLON|PUBLIE)
  image, auteurId, publishedAt, createdAt
}

-- Témoignages
Temoignage {
  id, nom, texte, note (1-5)
  localisation, photo, actif
  ordre, createdAt
}

-- Utilisateurs
User {
  id, name, email, password
  role (SUPER_ADMIN|ADMIN|AGENT|EDITEUR)
  active, createdAt, updatedAt
}
```

## 🎯 Fonctionnalités par Module

### Annonces
- ✅ **Interface admin** : Cards avec filtres
- ✅ **API REST** : CRUD complet
- ✅ **Recherche** : Titre + localisation
- ✅ **Filtres** : Type et statut
- ✅ **Toggle statut** : Brouillon ↔ En ligne
- ✅ **Validation** : Champs requis
- ✅ **Responsive** : Mobile/Desktop

### Services
- ✅ **Upload images** : Drag & drop
- ✅ **Stockage** : `/public/images/services/`
- ✅ **Optimisation** : Compression auto
- ✅ **Édition texte** : Titre + description
- ✅ **URL management** : Chemins publics
- ✅ **Sauvegarde** : JSON local

### Blog (à implémenter)
- 📝 **Éditeur** : Rich text (Tiptap)
- 🏷️ **Catégories** : Tags système
- 📅 **Planification** : Publication différée
- 🖼️ **Images** : Gallery par article
- 📊 **Stats** : Vues, engagements

### Avis (à implémenter)
- ⭐ **Modération** : Approbation admin
- 💬 **Réponses** : Répondre aux clients
- 📈 **Analytics** : Notes moyennes
- 🏷️ **Filtres** : Par note, date, service

## 🔌 API Routes

### Annonces
```
GET    /api/admin/annonces           # Lister toutes
POST   /api/admin/annonces           # Créer
PUT    /api/admin/annonces/[id]      # Mettre à jour
DELETE /api/admin/annonces/[id]      # Supprimer
PATCH  /api/admin/annonces/[id]/toggle # Activer/désactiver
```

### Services
```
GET    /api/admin/services           # Charger
PUT    /api/admin/services           # Sauvegarder
POST   /api/admin/services/upload    # Upload image
```

### Blog (à créer)
```
GET    /api/admin/blog               # Lister articles
POST   /api/admin/blog               # Créer article
PUT    /api/admin/blog/[id]          # Mettre à jour
DELETE /api/admin/blog/[id]          # Supprimer
PATCH  /api/admin/blog/[id]/publish  # Publier
```

### Avis (à créer)
```
GET    /api/admin/avis               # Lister avis
POST   /api/admin/avis               # Créer avis
PUT    /api/admin/avis/[id]          # Mettre à jour
PATCH  /api/admin/avis/[id]/approve  # Approuver
DELETE /api/admin/avis/[id]          # Supprimer
```

## 🎨 Interface Utilisateur

### Design System
- **Palette** : Anthracite & Or
- **Components** : shadcn/ui
- **Responsive** : Mobile-first
- **Animations** : Transitions fluides
- **Feedback** : Toast notifications

### Navigation admin
```
/admin
├── /annonces     # Gestion annonces
├── /services     # Gestion services
├── /blog         # Gestion blog (bientôt)
├── /avis         # Gestion avis (bientôt)
└── /dashboard    # Tableau de bord (bientôt)
```

## 🚀 Déploiement

### Prérequis
- **Base de données** : PostgreSQL
- **Stockage** : Local filesystem
- **Authentification** : NextAuth.js
- **Upload** : Taille max 5MB

### Configuration
```env
DATABASE_URL=postgresql://...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
UPLOAD_MAX_SIZE=5242880
```

## ✅ État actuel

| Module | État | Fonctionnalités |
|--------|------|-----------------|
| **Annonces** | ✅ Terminé | CRUD, filtres, toggle |
| **Services** | ✅ Terminé | Upload, édition, sauvegarde |
| **Blog** | 🚧 En cours | À implémenter |
| **Avis** | 🚧 En cours | À implémenter |
| **Dashboard** | 📋 Prévu | Statistiques et analytics |

## 🔄 Prochaines étapes

1. **Module Blog** : Éditeur rich text + catégories
2. **Module Avis** : Modération + analytics
3. **Dashboard** : Statistiques globales
4. **Authentification** : Sécurisation backoffice
5. **API avancées** : Export/import, bulk actions

---

**Système de gestion complet avec base de données opérationnel !** 🎉✨
