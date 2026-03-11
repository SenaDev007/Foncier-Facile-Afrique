# 🛠️ Backoffice Services — Guide d'Utilisation

## 📋 Accès au Backoffice

### URL d'accès
```
http://localhost:3000/admin/services
```

## 🎯 Fonctionnalités disponibles

### 1. **Gestion des Images Services**
- ✅ **Upload d'images** : Glisser-déposer ou sélectionner un fichier
- ✅ **Formats supportés** : JPG, PNG, WebP
- ✅ **Taille maximale** : 5MB par image
- ✅ **Redimensionnement automatique** : Optimisation web

### 2. **Modification des Textes**
- ✅ **Titre** : Modifier le nom de chaque service
- ✅ **Description** : Adapter le texte descriptif
- ✅ **URL image** : Modifier manuellement le chemin de l'image

### 3. **Sauvegarde**
- ✅ **Sauvegarde instantanée** : Enregistrement en base de données
- ✅ **Mise à jour automatique** : Les changements sont visibles immédiatement sur le site

## 📸 Instructions d'Upload

### Étape 1 : Préparer l'image
- **Dimensions recommandées** : 400x300px minimum
- **Format** : JPG (compression web)
- **Qualité** : 80-90%
- **Poids** : Moins de 2MB optimal

### Étape 2 : Upload depuis le backoffice
1. Aller dans `/admin/services`
2. Cliquer sur "Choisir un fichier" pour le service souhaité
3. Sélectionner l'image préparée
4. Attendre la confirmation d'upload
5. Cliquer sur "Sauvegarder"

### Étape 3 : Vérification
- Les images s'affichent immédiatement dans l'aperçu
- Les changements sont visibles sur le site public

## 🔧 Configuration Technique

### Stockage des images
```
public/images/services/
├── conseil-foncier-1640995200000.jpg
├── verification-docs-1640995300000.jpg
├── recherche-terrain-1640995400000.jpg
└── diaspora-1640995500000.jpg
```

### Base de données
Les informations sont stockées dans :
```
data/services.json
```

### API Endpoints
- `GET /api/admin/services` : Récupérer les services
- `PUT /api/admin/services` : Mettre à jour les services
- `POST /api/admin/services/upload` : Uploader une image

## 🎨 Services Disponibles

### 1. Conseil foncier
- **Icône** : Shield
- **Description par défaut** : Accompagnement expert pour sécuriser vos acquisitions
- **Image suggérée** : Documents légaux, consultation

### 2. Vérification documentaire
- **Icône** : FileCheck
- **Description par défaut** : Contrôle rigoureux des documents légaux
- **Image suggérée** : Documents, paperasse, vérification

### 3. Recherche terrain
- **Icône** : Search
- **Description par défaut** : Identification des meilleurs terrains
- **Image suggérée** : Terrain, recherche, prospection

### 4. Accompagnement diaspora
- **Icône** : Users
- **Description par défaut** : Service dédié à la diaspora africaine
- **Image suggérée** : International, communication, accompagnement

## 🚀 Bonnes Pratiques

### Images
- **Nommer les fichiers** de manière descriptive
- **Utiliser des images** pertinentes pour chaque service
- **Optimiser** le poids pour un chargement rapide

### Textes
- **Titres clairs** et concis (max 50 caractères)
- **Descriptions informatives** (100-200 caractères)
- **Mots-clés pertinents** pour le SEO

### Sauvegarde
- **Sauvegarder régulièrement** après chaque modification
- **Vérifier l'aperçu** avant de quitter
- **Tester sur le site public** pour confirmer

## 🔒 Sécurité

- **Validation des types** de fichiers
- **Limitation de la taille** des uploads
- **Stockage sécurisé** des images
- **Backup automatique** des données

---

**Le backoffice est maintenant prêt pour gérer les images services en temps réel !** 🎉
