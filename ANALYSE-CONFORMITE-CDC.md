# Analyse de conformité au CDC — Foncier Facile Afrique

Rapport d’audit du projet par rapport au cahier des charges (PROMPT_WINDSURF_FoncierFacileAfrique.md).

---

## 1. Stack technique — Conforme

| Élément | CDC | Projet | Statut |
|--------|-----|--------|--------|
| Framework | Next.js 14 (App Router, TypeScript) | Next.js 14.2.5, App Router | OK |
| BDD | PostgreSQL + Prisma | PostgreSQL + Prisma 5.16 | OK |
| Auth | NextAuth.js v5 (credentials + JWT) | next-auth 5.0.0-beta.19, Credentials, JWT | OK |
| Styling | Tailwind + shadcn/ui | Tailwind + Radix/shadcn | OK |
| Cartographie | Leaflet (react-leaflet) | leaflet, react-leaflet, react-leaflet-cluster | OK |
| Upload | Uploadthing ou local /public/uploads | Route API upload + stockage local | OK |
| Email | Nodemailer | nodemailer | OK |
| Éditeur riche | Tiptap | @tiptap/* | OK |
| Validation | Zod | zod | OK |
| État global | Zustand | zustand | OK |
| Déploiement | output: standalone (VPS) | next.config.ts `output: 'standalone'` | OK |

**Interdictions respectées :** pas de `next/image` loader externe bloquant, pas d’Edge Runtime, pas de CMS externe.

---

## 2. Structure des dossiers — Conforme avec écarts de nommage

- **Routes publiques** : `(public)/page.tsx`, services, annonces, annonces/[slug], blog, blog/[slug], notre-expertise, simulateur, contact, mentions-legales — OK.
- **Routes admin** : layout, dashboard, annonces (liste, new, [id]/edit), blog (liste, new, [id]/edit), leads, messages, témoignages, utilisateurs, paramètres — OK.
- **Écart** : CDC prévoit `annonces/nouvelle/page.tsx` et `annonces/[id]/page.tsx` ; le projet utilise `annonces/new/page.tsx` et `annonces/[id]/edit/page.tsx`. Même logique pour le blog. Acceptable.
- **API** : auth, contact, annonces, annonces/[id], blog, blog/[id], leads, messages, upload — OK. Routes sous `/api/admin/*` pour le back-office (logique et cohérent).
- **Composants** : public (Navbar, Footer, HeroSection, AnnonceCard, AnnonceFilters, MapView, WhatsAppButton, Simulateur, TestimonialsCarousel, BlogCard, LeadMagnetBanner) et admin (Sidebar, DashboardStats, AnnonceForm, BlogForm, LeadsKanban, DataTable, ImageUploader) — présents.
- **Lib** : prisma, auth, mail, utils, validations — OK.
- **Fichiers déploiement** : `ecosystem.config.js`, `deploy.sh` — conformes au CDC.

---

## 3. Base de données (Prisma) — Conforme + extension

- Modèles **User**, **Role**, **Annonce**, **Photo**, **TypeBien**, **StatutAnnonce**, **Lead**, **CanalLead**, **StatutLead**, **Interaction**, **Message**, **BlogPost**, **StatutPost**, **Temoignage**, **Parametre** — conformes au schéma CDC.
- **Modèle ajouté** : `Newsletter` (email, actif, createdAt) — non prévu au CDC mais cohérent avec la newsletter du footer.
- **Message** : le CDC décrit un formulaire contact avec Nom et Prénom ; le modèle `Message` n’a que `nom` (pas `prenom`). Le prénom est reçu par l’API et utilisé dans les e-mails mais **n’est pas persisté** en base.

---

## 4. Identité visuelle (tokens CSS) — Non conforme

Le CDC impose dans `globals.css` :

- `--color-primary: #1A6B3A`, `--color-primary-dark`, `--color-primary-light`
- `--color-gold: #C8A435`, `--color-gold-light: #FBF3DC`
- `--color-dark: #1A1A1A`, `--color-grey: #6B7280`, `--color-light: #F9F9F6`
- `--font-heading: 'Playfair Display'`, `--font-body: 'Inter'`
- `--radius: 0.5rem`, `--shadow-card: 0 2px 12px rgba(0,0,0,0.08)`

**Projet actuel :**

- Thème **sombre** (anthracite) avec `--color-bg: #1C1C1E`, `--color-gold: #D4A843` (au lieu de #C8A435), `--font-body: 'DM Sans'` (au lieu de 'Inter').
- Les variables **primary** (vert FFA) du CDC ne sont pas les variables principales du thème ; le vert n’est pas utilisé comme couleur de fond principale.
- **tailwind.config.ts** : couleurs `primary` et `gold` conformes au CDC, mais le rendu global est piloté par le thème sombre de `globals.css`.

**Conclusion** : Identité visuelle CDC (vert FFA + or #C8A435, fond clair) non respectée ; le site est en thème sombre avec une or différente.

---

## 5. Composants et pages — Écarts par rapport au CDC

### 5.1 HeroSection

- **CDC** : Titre « Investissez en terrain sécurisé au Bénin », sous-titre « Vérification juridique, accompagnement complet… », **barre de recherche rapide** (type de bien + localisation + bouton Rechercher), badge « 200+ clients satisfaits · Documents vérifiés · 5 ans d’expérience », 2 CTA (Voir les annonces, Parler à un conseiller → WhatsApp).
- **Projet** : Titre « Achetez un terrain en toute sécurité au Bénin », sous-titre différent, **pas de barre de recherche dans le hero**, pas de badge de confiance, 2 CTA et 3 mini-cartes (Sécurité juridique, etc.). **Non conforme** (recherche rapide et badge manquants).

### 5.2 AnnonceFilters

- **CDC** : Filtres basés sur l’URL (useSearchParams), type en **boutons toggle** (Tous / Terrain / …), localisation avec **debounce 300 ms**, **slider + input** pour budget max, **checkboxes Documents** (TF, ACD, Permis d’habiter), bouton Réinitialiser.
- **Projet** : Type en select, localisation en input sans debounce explicite, budget/surface en selects prédéfinis, **pas de filtres par documents**. Conforme sur l’idée (filtres URL, réinitialiser), partiel sur le détail (toggle, slider, documents).

### 5.3 Simulateur

- **CDC** : Budget total (FCFA), type de bien (Terrain / Maison / Appartement), zone (Cotonou centre / Périphérie / Autre ville). Résultats : frais de notaire 8 %, frais d’arpentage (100k–300k FCFA), frais d’enregistrement 2 %, budget net, fourchette de surface par zone, CTA « Parler à un conseiller » (WhatsApp avec données du simulateur).
- **Projet** : Simulateur de **crédit immobilier** (prix du bien, apport, durée, taux → mensualité, coût total, intérêts). **Logique métier différente** du CDC — **non conforme**.

### 5.4 MapView

- **CDC** : react-leaflet, carte centrée Cotonou (6.3654, 2.4183), **markers verts** personnalisés, popup (titre, prix, lien), **clustering** si > 10 marqueurs, bascule Liste/Carte sur la page Annonces.
- **Projet** : Leaflet en manuel (import dynamique), centre ~Cotonou (6.3703, 2.3912), **markers par défaut** (rouge), **tous les markers à la même position** (latitude/longitude des annonces non utilisées), pas de clustering, **MapView non utilisée** sur la page Annonces (pas de vue Carte). **Non conforme** (marqueurs, clustering, vue Carte).

### 5.5 Footer

- **CDC** : 4 colonnes — Logo + description + réseaux ; Navigation (Services, Annonces, Blog, Contact, Mentions légales) ; Contact (adresse, tél, email) ; **Newsletter** (input email + bouton « S’abonner »). Bande dorée en haut, fond vert foncé, texte blanc.
- **Projet** : 4 colonnes (Logo, Services, Liens utiles, Contact), **pas de bloc Newsletter**. Style doré/anthracite au lieu de vert foncé. **Non conforme** (newsletter et style vert foncé manquants).

### 5.6 Fiche annonce (`annonces/[slug]`)

- **CDC** : Galerie **lightbox** (ex. react-photo-view), **MapView** avec marker centré sur le bien, description HTML rendue proprement, **formulaire de contact dédié** (création d’un Lead), WhatsApp avec message contextualisé, **section « Biens similaires »** (3 annonces même type/zone), **generateStaticParams** pour les 20 annonces les plus récentes, métadonnées OG.
- **Projet** : Grille de photos sans lightbox, **pas de MapView**, description en texte brut (pas de rendu HTML structuré), pas de formulaire Lead inline (liens WhatsApp / téléphone / contact), **pas de « Biens similaires »**, **pas de generateStaticParams**. **Non conforme** sur ces points.

### 5.7 Page Annonces

- **CDC** : Bascule **Grille / Liste / Carte**, pagination 12 par page, tri (Plus récents, Prix croissant/décroissant, Surface).
- **Projet** : Uniquement vue **grille** et pagination. Pas de vue Liste ni Carte. **Partiel**.

### 5.8 Page Contact

- **CDC** : Champs Nom, Prénom, Email, Téléphone, Sujet (select), Message. Validation Zod client + serveur. Création Message en BDD + envoi e-mail admin + confirmation expéditeur. Bloc contact + **carte Leaflet** avec épingle bureau FFA.
- **Projet** : Formulaire avec **Nom complet**, Email, Téléphone, Sujet, **Message** (pas de champ Prénom séparé, champ envoyé sous le nom `message`). L’API attend `nom`, `prenom`, `contenu` → **risque d’échec de validation** (prenom requis, contenu vs message). **Pas de carte Leaflet**. **Non conforme** (champs/prénom/contenu, carte).

### 5.9 Blog — article (`blog/[slug]`)

- **CDC** : Contenu HTML (Tiptap) affiché de façon sûre ; **sanitization DOMPurify** avant affichage.
- **Projet** : `dangerouslySetInnerHTML` sur `post.contenu` **sans sanitization**. Le package `isomorphic-dompurify` est installé mais **non utilisé**. **Non conforme** (sécurité).
- **Bug** : La page utilise `post.imageUrl` et `post.imageAlt` alors que le schéma Prisma ne contient que **imageUne** → erreur à l’exécution (champs inexistants).

### 5.10 Dashboard admin

- **CDC** : 4 KPI (Annonces actives, Leads ce mois, Messages non lus, Vues totales cette semaine), **graphique en barres** (Leads par mois sur 6 mois), 5 derniers leads, 5 derniers messages, **Top 5 annonces les plus vues cette semaine**, **alertes** (leads sans réponse depuis +48 h).
- **Projet** : 4 cartes (Annonces en ligne, Total leads + sous-titre « ce mois », Messages non lus, Témoignages), 5 derniers leads, 5 derniers messages. **Pas de graphique**, pas de « annonces les plus vues », pas d’alertes. **Partiel**.

---

## 6. API et sécurité

- **Contact** : Rate limiting 5 req/min par IP — OK. Validation Zod — OK. Création Message + envoi e-mails — OK. **Prénom** non stocké en BDD (utilisé uniquement dans les e-mails).
- **Leads** : Rate limiting 5 req/min — OK. Création Lead + notification — OK.
- **Réponses** : Format `{ success, data?, error? }` — utilisé. Auth sur routes admin — OK.
- **next.config.ts** : CDC prévoit `images.localPatterns: [{ pathname: '/uploads/**' }]` ; **absent** dans la config actuelle (à ajouter si utilisation d’images sous `/uploads` avec `next/image`).

---

## 7. Données de démonstration (seed)

- **CDC** : 1 Super Admin `admin@foncierfacileafrique.fr` / `Admin@FFA2024!`, 8 annonces (Cotonou Akpakpa, Cadjehoun, Fidjrossè, etc.), 3 articles de blog précis, 3 témoignages, 5 paramètres (telephone, email, adresse, whatsapp, slogan).
- **Projet** : Super Admin avec email client `isdineidisoule@gmail.com` et mot de passe `Admin@2024!`, 5 annonces (Parakou, Abomey-Calavi, Sèmè-Kpodji…), 3 articles de blog (titres différents), 4 témoignages, paramètres avec clés différentes (nom_site, description_site, email_contact, etc.). **Fonctionnel mais pas aligné** sur les données exactes du CDC (pratique pour démo client).

---

## 8. Récapitulatif des corrections prioritaires

| Priorité | Élément | Action recommandée |
|----------|--------|---------------------|
| Haute | Contact | Aligner formulaire et API : champs Nom, Prénom, `contenu` (au lieu de `message`) ; ou adapter l’API pour accepter « nom complet » + `contenu`. |
| Haute | Blog [slug] | Utiliser `imageUne` (et non `imageUrl`/`imageAlt`) ; sanitizer le HTML avec DOMPurify avant `dangerouslySetInnerHTML`. |
| Haute | Simulateur | Soit implémenter le simulateur CDC (budget, type, zone, frais notaire/arpentage/enregistrement, surface, CTA WhatsApp), soit documenter le choix « simulateur crédit » comme évolution. |
| Moyenne | Fiche annonce | Ajouter MapView (marker unique), lightbox galerie, section « Biens similaires », formulaire Lead inline ; ajouter `generateStaticParams` pour les 20 dernières annonces. |
| Moyenne | Page Annonces | Intégrer MapView avec vrais lat/long et bascule Grille / Liste / Carte ; filtres par documents (TF, ACD, Permis) ; optionnel : debounce localisation, slider budget. |
| Moyenne | HeroSection | Ajouter barre de recherche rapide (type + localisation + Rechercher) et badge de confiance (200+ clients, etc.). |
| Moyenne | Footer | Ajouter colonne Newsletter (input + S’abonner) branchée sur `/api/newsletter` ; ajuster style vers « bande dorée + fond vert foncé » si souhait de conformité stricte. |
| Moyenne | Identité visuelle | Soit réintroduire les variables CDC (primary vert, gold #C8A435, Inter, fond clair) dans `globals.css` et les utiliser, soit acter le thème sombre dans le CDC. |
| Basse | Message (BDD) | Ajouter champ `prenom` au modèle `Message` et le renseigner depuis le formulaire contact pour traçabilité complète. |
| Basse | next.config | Ajouter `images.localPatterns: [{ pathname: '/uploads/**' }]` si utilisation de `next/image` pour les uploads. |
| Basse | Dashboard | Ajouter graphique Leads par mois (recharts), bloc « Annonces les plus vues », alertes leads non traités +48 h. |
| Basse | Seed | Optionnel : aligner email/mot de passe admin et jeux de données sur le CDC pour démo standardisée. |

---

## 9. Synthèse

- **Conforme** : Stack, structure des dossiers, schéma Prisma (hors Newsletter et prénom Message), auth, middleware, rate limiting, déploiement (standalone, PM2, deploy.sh), composants principaux présents, AnnonceCard (badges, prix FCFA), WhatsAppButton, LeadsKanban, formulaires admin (AnnonceForm, BlogForm).
- **Partiel** : Filtres annonces, dashboard (KPI sans graphique ni alertes), page Annonces (pas de vue Carte/Liste).
- **Non conforme ou à corriger** : Identité visuelle (thème sombre vs CDC), HeroSection (recherche rapide, badge), Simulateur (crédit au lieu de budget/frais/zone), MapView (non utilisée, marqueurs/clustering), Footer (newsletter, style), fiche annonce (lightbox, carte, biens similaires, formulaire Lead, generateStaticParams), page Contact (champs/prénom/contenu, carte), blog [slug] (DOMPurify, imageUne), seed (données différentes).

En appliquant les corrections prioritaires ci-dessus, le projet pourra être rendu pleinement conforme au CDC tout en conservant les évolutions utiles (Newsletter, thème sombre optionnel, etc.) si elles sont documentées.
