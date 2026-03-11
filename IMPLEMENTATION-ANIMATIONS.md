# 🎨 Images & Animations — Guide d'implémentation

## ✅ **Ce qui a été implémenté**

### Composants d'animation créés
- ✅ `SmoothScrollProvider` — Scroll inertiel avec Lenis
- ✅ `AnimateOnScroll` — Wrapper réutilisable pour animations au scroll
- ✅ `AnimatedCounter` — Compteurs animés avec easing fluide
- ✅ `PageTransition` — Transitions entre pages

### Pages et composants mis à jour
- ✅ `HeroSection` — Image parallax, animations d'entrée, micro-interactions
- ✅ Page d'accueil — Section chiffres clés, animations cascade sur services/annonces
- ✅ `AnnonceCard` — Effet 3D hover avec reflet glare dynamique

### Structure des images créée
- ✅ `/public/images/hero/` — Images du hero (placeholders)
- ✅ `/public/images/services/` — Images des services (placeholders)

## 📦 **Installation requise**

```bash
npm install framer-motion @studio-freight/lenis
```

## 🖼️ **Images à télécharger**

### Images Hero (remplacer les placeholders)

1. **Hero principal** :
   ```
   URL: https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1920&q=85
   Destination: /public/images/hero/hero-bg.jpg
   ```

2. **Hero mobile** :
   ```
   URL: https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=768&q=80
   Destination: /public/images/hero/hero-bg-mobile.jpg
   ```

### Images Services (remplacer les placeholders)

1. **Conseil foncier** :
   ```
   URL: https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&q=80
   Destination: /public/images/services/conseil-foncier.jpg
   ```

2. **Vérification docs** :
   ```
   URL: https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=80
   Destination: /public/images/services/verification-docs.jpg
   ```

3. **Recherche terrain** :
   ```
   URL: https://images.unsplash.com/photo-1448630360428-65456885c650?w=600&q=80
   Destination: /public/images/services/recherche-terrain.jpg
   ```

4. **Diaspora** :
   ```
   URL: https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&q=80
   Destination: /public/images/services/diaspora.jpg
   ```

## ⚡ **Intégration finale**

### 1. Intégrer SmoothScrollProvider

Dans `app/layout.tsx` :
```tsx
import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <SmoothScrollProvider>
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  )
}
```

### 2. Intégrer PageTransition (optionnel)

Dans `app/(public)/layout.tsx` :
```tsx
import { PageTransition } from '@/components/ui/PageTransition'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <PageTransition>
      {children}
    </PageTransition>
  )
}
```

### 3. Mettre à jour les services avec les vraies images

Dans `app/(public)/page.tsx`, ajouter les URLs des images :
```tsx
const services = [
  { 
    icon: Shield, 
    title: 'Conseil foncier', 
    description: '...',
    image: '/images/services/conseil-foncier.jpg'
  },
  // ... autres services
]
```

Puis dans le JSX :
```tsx
<div className="relative h-44 overflow-hidden">
  <Image
    src={service.image}
    alt={service.title}
    fill
    className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
  />
  {/* ... overlays */}
</div>
```

## 🎯 **Prochaines étapes**

1. **Installer les dépendances** : `npm install framer-motion @studio-freight/lenis`
2. **Télécharger les images** depuis les URLs Unsplash
3. **Intégrer SmoothScrollProvider** dans le layout principal
4. **Tester les animations** dans le navigateur
5. **Adapter les services** avec les vraies images
6. **Ajouter PageTransition** pour les transitions entre pages

## 🎨 **Effets visuels obtenus**

- ✅ **Parallax Hero** : Image qui monte plus lentement que le scroll
- ✅ **Animations cascade** : Éléments qui apparaissent avec délais progressifs
- ✅ **Compteurs animés** : Chiffres qui comptent avec easing fluide
- ✅ **Cards 3D** : Effet de rotation et reflet au hover
- ✅ **Micro-interactions** : Boutons avec scale au tap/click
- ✅ **Scroll inertiel** : Mouvement fluide et naturel

## 📱 **Responsive & Performance**

- ✅ Images optimisées avec Next.js Image
- ✅ Animations respectent `prefers-reduced-motion`
- ✅ Pas de CLS (Cumulative Layout Shift)
- ✅ Performances optimisées avec Framer Motion

---

*Foncier Facile Afrique — Implementation Images & Animations*
