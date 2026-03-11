# Instructions pour configurer l'authentification du back-office

## 1. Configurer les variables d'environnement

Copiez le fichier `.env.development` vers `.env.local` :

```bash
cp .env.development .env.local
```

## 2. Générer un secret NextAuth

Exécutez cette commande pour générer un secret sécurisé :

```bash
openssl rand -base64 32
```

Remplacez `votre-secret-ici-generer-avec-openssl-rand-base64-32` dans `.env.local` par le secret généré.

## 3. Configurer la base de données

Modifiez `DATABASE_URL` dans `.env.local` avec vos informations PostgreSQL :

```env
DATABASE_URL="postgresql://votre_user:votre_password@localhost:5432/foncier_facile_db"
```

## 4. Initialiser la base de données

```bash
# Créer et migrer la base de données
npx prisma migrate dev --name init

# Insérer les données de démonstration
npx prisma db seed
```

## 5. Accès au back-office

Une fois configuré, le back-office sera protégé :

- **URL** : http://localhost:3001/admin
- **Redirection automatique** vers `/admin/login` si non connecté
- **Login par défaut** : `isdineidisoule@gmail.com` / `Admin@2024!`

## 6. Protection des routes

Le middleware protège automatiquement :
- Toutes les routes `/admin/*` sauf `/admin/login`
- Vérification des rôles pour `/admin/utilisateurs` et `/admin/parametres`
- Redirection si déjà connecté vers `/admin/login`

## 7. Dépannage

Si le back-office n'est pas protégé :

1. Vérifiez que `.env.local` existe et contient `NEXTAUTH_SECRET`
2. Redémarrez le serveur : `npm run dev`
3. Videz le cache : `rm -rf .next`
4. Vérifiez les logs pour d'éventuelles erreurs
