#!/bin/bash
echo "=== Déploiement FFA ==="
git pull origin main
npm ci --production=false
npx prisma migrate deploy
npx prisma generate
npm run build
cp -r public .next/standalone/
cp -r .next/static .next/standalone/.next/
pm2 restart foncier-facile-afrique || pm2 start ecosystem.config.js
echo "=== Déploiement terminé ==="
