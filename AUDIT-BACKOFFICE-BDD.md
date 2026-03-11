# Audit Backoffice / BDD — Foncier Facile Afrique

**Date :** Mars 2026  
**Objectif :** Vérifier que toutes les entités sont connectées au backoffice et à la base de données pour un audit professionnel.

---

## 1. Synthèse

| Entité        | Modèle Prisma / Source | API CRUD / Lecture | Pages admin | Connecté |
|---------------|------------------------|--------------------|-------------|----------|
| Annonces      | `Annonce` + `Photo`    | Oui                | Oui         | Oui      |
| Blog          | `BlogPost`             | Oui                | Oui         | Oui      |
| Services      | Fichier `data/services.json` | GET/PUT + upload | Oui    | Oui      |
| Témoignages   | `Temoignage`           | Oui                | Oui         | Oui      |
| Messages      | `Message`              | Lecture + marquer lu / supprimer | Oui | Oui  |
| Leads         | `Lead` + `Interaction` | Oui                | Oui         | Oui      |
| Utilisateurs  | `User`                 | Oui                | Oui         | Oui      |
| Paramètres    | `Parametre`            | GET/PUT            | Oui         | Oui      |

---

## 2. Détail par entité

### Annonces
- **Prisma :** `Annonce` (reference, slug, titre, description, type, statut, prix, surface, localisation, etc.), `Photo` (url, alt, ordre, annonceId).
- **API :**
  - `GET/POST /api/admin/annonces` — liste + création (admin).
  - `GET/PUT/DELETE /api/admin/annonces/[id]` — détail, mise à jour, suppression.
  - `GET/PUT/DELETE /api/annonces/[id]` — utilisé par le formulaire annonce (avec auth), gère les photos (tableau `photos`).
  - `POST /api/admin/annonces/[id]/toggle` — bascule statut (ex. EN_LIGNE/BROUILLON).
- **Upload photos :** `/api/upload` (générique) → retourne une URL ; le formulaire envoie `photos: [{ url, alt, ordre }]` au PUT annonce.
- **Pages admin :** Liste (`/admin/annonces`), création (`/admin/annonces/new`), édition (`/admin/annonces/[id]/edit`). Formulaire avec `ImageUploader` pour les photos.

### Blog
- **Prisma :** `BlogPost` (slug, titre, resume, contenu, imageUne, statut, metaTitle, metaDesc, tags, auteurId, etc.).
- **API :**
  - `GET/POST /api/admin/blog` — liste + création.
  - `GET/PATCH/DELETE /api/admin/blog/[id]` — détail, mise à jour, suppression.
  - `GET/PATCH/DELETE /api/blog/[id]` — utilisé par le front (avec auth).
  - `POST /api/admin/blog/[id]/statut` — changement de statut.
- **Pages admin :** Liste (`/admin/blog`), création (`/admin/blog/new`), édition (`/admin/blog/[id]/edit`). Champ `imageUne` (URL) éditable dans le formulaire.

### Services
- **Source :** Pas de modèle Prisma. Données dans `data/services.json` (créé à la volée si absent), avec valeurs par défaut dans `app/api/admin/services/route.ts`.
- **API :**
  - `GET /api/admin/services` — liste des services (pour le backoffice et la page d’accueil si appelée).
  - `PUT /api/admin/services` — mise à jour du tableau (titres, descriptions, images).
  - `POST /api/admin/services/upload` — upload d’image par `serviceId` → enregistrement dans `public/images/services/` et retour de l’URL.
- **Pages admin :** `/admin/services` — édition des titres/descriptions et upload d’images par service.
- **Page publique :** Accueil charge les services (depuis API ou fichier) et affiche les cartes avec image.

### Témoignages
- **Prisma :** `Temoignage` (nom, photo, texte, note, actif, ordre).
- **API :**
  - `GET/POST /api/admin/temoignages` — liste + création.
  - `PUT/DELETE /api/admin/temoignages/[id]` — mise à jour, suppression.
  - `POST /api/admin/temoignages/[id]/toggle` — bascule actif/inactif.
- **Pages admin :** `/admin/temoignages` — liste, création, édition. Le champ `photo` (URL) peut être renseigné (upload possible à prévoir ou URL manuelle).
- **Affichage :** Accueil et section dédiée utilisent `temoignage.photo` avec fallback si absent.

### Messages (contact)
- **Prisma :** `Message` (nom, prenom, email, telephone, sujet, contenu, lu).
- **Création :** Formulaire contact → `POST /api/contact` → `prisma.message.create`.
- **API :**
  - `GET /api/admin/messages` — liste.
  - `GET/PUT/DELETE /api/admin/messages/[id]` — détail, mise à jour (ex. marquer lu), suppression.
  - `POST /api/admin/messages/[id]/read` — marquer comme lu.
  - `POST /api/admin/messages/reply` — préparation réponse (ex. mailto).
- **Pages admin :** Liste (`/admin/messages`), détail (`/admin/messages/[id]`).

### Leads
- **Prisma :** `Lead` (nom, prenom, telephone, email, canal, budget, statut, notes, prochainRappel, agentId, annonceId), `Interaction`.
- **Création :** Formulaire site (ex. lead magnet) / formulaire annonce → `POST /api/leads` → `prisma.lead.create`.
- **API :**
  - `GET /api/admin/leads` — liste (avec pagination/filtres).
  - `GET/PUT/DELETE /api/leads/[id]` — détail, mise à jour, suppression.
  - `POST /api/admin/leads/[id]/statut` — changement de statut.
  - `POST /api/admin/leads/[id]/interactions` — ajout d’une interaction.
- **Pages admin :** Liste (`/admin/leads`), détail (`/admin/leads/[id]`).

### Utilisateurs
- **Prisma :** `User` (name, email, password, role, active).
- **Auth :** NextAuth avec credentials, `lib/auth.ts` → `prisma.user.findUnique` par email.
- **API :**
  - `GET/POST /api/admin/utilisateurs` — liste + création.
  - `PUT/DELETE /api/admin/utilisateurs/[id]` — mise à jour, suppression.
  - `POST /api/admin/utilisateurs/[id]/toggle` — activer/désactiver.
- **Pages admin :** `/admin/utilisateurs` — liste, création, édition.

### Paramètres
- **Prisma :** `Parametre` (cle, valeur). Pas de schéma fixe : paires clé/valeur (nom_site, email_contact, hero_image, etc.).
- **API :**
  - `GET /api/parametres` — liste (pour la page paramètres et le site).
  - `PUT /api/parametres` — mise à jour (auth requise côté appelant si protégé).
- **Pages admin :** `/admin/parametres` — formulaire par clés connues (nom_site, description_site, email_contact, etc.). Possibilité d’ajouter `hero_image` et `hero_image_mobile` pour images hero modifiables depuis le backoffice.

---

## 3. Points d’attention

1. **Upload annonces :** Le client utilise `/api/upload` avec `formData.append('file', file)`. L’API retourne `{ success: true, data: { url, filename } }`. S’assurer que le client lit `data.data?.url` ou que l’API expose aussi `url` à la racine pour cohérence.
2. **Services :** Stockage fichier `data/services.json` + images dans `public/images/services/`. Pas de BDD ; adapté pour un petit nombre de services éditable en backoffice.
3. **Hero / images globales :** Pour rendre les images hero modifiables depuis le backoffice, utiliser le modèle `Parametre` (ex. `hero_image`, `hero_image_mobile`) et les afficher en priorité dans `HeroSection` si présents.
4. **Témoignages :** Le champ `photo` (URL) est éditable en backoffice ; prévoir un upload dédié ou usage de l’URL (comme pour le blog) pour les avatars.

---

## 4. Conclusion

Toutes les entités listées sont connectées au backoffice et à la BDD (ou au stockage fichier prévu pour les services). Les APIs et pages admin couvrent la création, la lecture, la mise à jour et, selon les cas, la suppression. Les uploads d’images existent pour les annonces (API générique), les services (API dédiée) et peuvent être étendus pour hero et témoignages via paramètres ou champs URL déjà présents.
