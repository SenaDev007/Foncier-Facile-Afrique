# 🎨 Pages d'Erreurs — Palette Anthracite & Or

## 📋 Pages modifiées

### 1. **Page d'Erreur 500** (`app/error.tsx`)
- ✅ **Fond** : `bg-[#1C1C1E]` (anthracite)
- ✅ **Code erreur** : `text-[#D4A843]` (or)
- ✅ **Titre** : `text-[#EFEFEF]` (blanc)
- ✅ **Description** : `text-[#8E8E93]` (gris)
- ✅ **Bouton principal** : `bg-[#D4A843]` (or)
- ✅ **Bouton secondaire** : `border-[#D4A843] text-[#D4A843]` (or)

### 2. **Page 404** (`app/not-found.tsx`)
- ✅ **Fond** : `bg-[#1C1C1E]` (anthracite)
- ✅ **Code erreur** : `text-[#D4A843]` (or)
- ✅ **Titre** : `text-[#EFEFEF]` (blanc)
- ✅ **Description** : `text-[#8E8E93]` (gris)
- ✅ **Bouton principal** : `bg-[#D4A843]` (or)
- ✅ **Bouton secondaire** : `border-[#D4A843] text-[#D4A843]` (or)

### 3. **Page Loading** (`app/loading.tsx`) - NOUVEAU
- ✅ **Fond** : `bg-[#1C1C1E]` (anthracite)
- ✅ **Logo FFA** : Fond `bg-[#D4A843]` avec texte blanc
- ✅ **Spinner** : Border `border-t-[#D4A843]` (or)
- ✅ **Titre** : `text-[#EFEFEF]` (blanc)
- ✅ **Description** : `text-[#8E8E93]` (gris)
- ✅ **Boutons** : Même style que les pages d'erreur
- ✅ **Barre progression** : `bg-[#D4A843]` (or)

## 🎯 Palette Cohérente

### Couleurs principales
- **Anthracite foncé** : `#1C1C1E` (fond)
- **Or** : `#D4A843` (accents, boutons, codes)
- **Blanc** : `#EFEFEF` (titres, textes principaux)
- **Gris** : `#8E8E93` (descriptions, textes secondaires)

### États hover
- **Boutons or** : `hover:bg-[#B8912E]` (or foncé)
- **Bordures or** : `hover:bg-[#D4A843] hover:text-[#EFEFEF]`

## 🚀 Fonctionnalités

### Page 500
- **Auto-refresh** : Bouton "Réessayer" pour recharger
- **Notification** : Log automatique de l'erreur
- **Navigation** : Retour à l'accueil

### Page 404
- **Double navigation** : Accueil + Annonces
- **Message clair** : "Page introuvable"
- **Design accueillant** : Pas d'erreur technique visible

### Page Loading
- **Spinner animé** : Indicateur visuel de chargement
- **Logo FFA** : Branding constant
- **Barre progression** : Feedback visuel du chargement
- **Navigation possible** : Pas bloqué pendant le chargement

## 🎨 Design System

### Typographie
- **Font heading** : Pour les titres et codes d'erreur
- **Font body** : Pour les descriptions
- **Tailles** : Hiérarchie claire (120px → 3xl → lg)

### Animations
- **Spin** : Loading spinner
- **Pulse** : Barre de progression
- **Transitions** : Hover sur les boutons

### Responsive
- **Mobile** : Stack vertical des boutons
- **Desktop** : Layout horizontal des boutons
- **Centrage** : Parfait sur tous les écrans

## 🔧 Intégration

### Utilisation automatique
- **Next.js** : Utilise automatiquement ces pages selon les erreurs
- **Loading** : S'affiche pendant les chargements de route
- **404** : Pour les routes inexistantes
- **500** : Pour les erreurs serveur

### Cohérence visuelle
- **Header/Footer** : Même palette que le reste du site
- **Navbar** : Style inversé (or/anthracite)
- **Animations** : Fluides et professionnelles

## ✅ Avantages

### UX améliorée
- **Cohérence** : Même design sur tout le site
- **Professionalisme** : Pas de pages d'erreur génériques
- **Branding** : Logo FFA présent partout

### Technique
- **Performance** : Pages légères et rapides
- **SEO** : Pages optimisées
- **Accessibilité** : Structure sémantique HTML5

---

**Toutes les pages d'erreurs sont maintenant parfaitement alignées avec la palette Anthracite & Or !** 🎉✨
