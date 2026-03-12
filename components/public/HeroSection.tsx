'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ArrowRight, Shield, Search, TrendingUp } from 'lucide-react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

const DEFAULT_HERO = '/images/hero/hero-bg.jpg'
const DEFAULT_HERO_MOBILE = '/images/hero/hero-bg-mobile.jpg'

interface HeroSectionProps {
  heroImageUrl?: string
  heroImageMobileUrl?: string
  heroBadge?: string
  heroSousTitre?: string
  heroTitre?: string
  heroTexte?: string
  heroCtaAnnonces?: { texte: string; url: string }
  heroCtaContact?: { texte: string; url: string }
}

export default function HeroSection({
  heroImageUrl,
  heroImageMobileUrl,
  heroBadge,
  heroSousTitre,
  heroTitre,
  heroTexte,
  heroCtaAnnonces,
  heroCtaContact,
}: HeroSectionProps = {}) {
  const router = useRouter()
  const [quickType, setQuickType] = useState('ALL')
  const [quickLocalisation, setQuickLocalisation] = useState('')
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  // L'image monte plus lentement que le scroll → effet parallax
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <section ref={ref} className="relative min-h-screen flex items-center overflow-hidden bg-[#1C1C1E]">

      {/* Image parallax - conteneur avec dimensions explicites pour fill */}
      <motion.div
        style={{ y }}
        className="absolute inset-0 z-0 w-full h-full min-h-screen scale-110"
      >
        <Image
          src={heroImageUrl || DEFAULT_HERO}
          alt="Terrain immobilier sécurisé au Bénin"
          fill
          priority
          quality={90}
          className="object-cover object-center"
          sizes="100vw"
          unoptimized
        />
        {/* Image mobile pour petits écrans */}
        <div className="md:hidden absolute inset-0">
          <Image
            src={heroImageMobileUrl || DEFAULT_HERO_MOBILE}
            alt="Terrain immobilier sécurisé au Bénin"
            fill
            priority
            quality={85}
            className="object-cover object-center"
            sizes="100vw"
            unoptimized
          />
        </div>
        {/* Overlay dégradé — du haut vers le bas */}
        <div className="absolute inset-0 bg-gradient-to-b
                        from-[rgba(0,0,0,0.75)]
                        via-[rgba(28,28,30,0.85)]
                        to-[#1C1C1E]" />
        {/* Overlay latéral gauche pour lisibilité du texte */}
        <div className="absolute inset-0 bg-gradient-to-r
                        from-[rgba(0,0,0,0.6)] via-transparent to-transparent" />
      </motion.div>

      {/* Contenu qui s'estompe au scroll */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 container-site py-32"
      >
        <div className="max-w-3xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-[rgba(212,168,67,0.15)] border border-[rgba(212,168,67,0.3)] text-[#D4A843] text-sm font-medium px-4 py-2 rounded-full mb-6 backdrop-blur-sm"
          >
            <Shield className="h-4 w-4" aria-hidden="true" />
            {heroBadge ?? "Votre partenaire immobilier sécurisé en Afrique de l'Ouest"}
          </motion.div>
          <p className="text-[#8E8E93] text-xs mt-2 mb-4">
            {heroSousTitre ?? "200+ clients satisfaits · Documents vérifiés · 5 ans d'expérience"}
          </p>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-[#EFEFEF] leading-tight"
          >
            {heroTitre ?? (
              <>
                Achetez un terrain{' '}
                <span className="text-[#D4A843]">en toute sécurité</span>{' '}
                au Bénin
              </>
            )}
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-6 text-[#8E8E93] text-lg sm:text-xl max-w-2xl leading-relaxed"
          >
            {heroTexte ?? "Foncier Facile Afrique vous accompagne dans l'acquisition de terrains et biens immobiliers avec titre foncier vérifié, de Parakou à tout le Bénin."}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              <Link
                href={heroCtaAnnonces?.url ?? '/annonces'}
                className="inline-flex items-center gap-2 bg-[#D4A843] text-[#EFEFEF] font-semibold px-6 py-4 rounded-xl hover:bg-[#B8912E] transition-all duration-200 shadow-lg hover:shadow-xl text-base"
              >
                {heroCtaAnnonces?.texte ?? 'Voir les annonces'}
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Link>
            </motion.div>
            <Link
              href={heroCtaContact?.url ?? '/contact'}
              className="inline-flex items-center gap-2 border border-[#3A3A3C] text-[#EFEFEF] font-semibold px-6 py-4 rounded-xl hover:bg-[#2C2C2E] transition-all duration-200 backdrop-blur-sm text-base"
            >
              {heroCtaContact?.texte ?? 'Nous contacter'}
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="mt-8 p-4 rounded-xl bg-[#2C2C2E]/90 border border-[#3A3A3C] backdrop-blur-sm"
          >
            <p className="text-[#EFEFEF] text-sm font-medium mb-3">Recherche rapide</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={quickType}
                onChange={(e) => setQuickType(e.target.value)}
                className="h-11 px-4 rounded-lg bg-[#1C1C1E] border border-[#3A3A3C] text-[#EFEFEF] text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A843]/50"
                aria-label="Type de bien"
              >
                <option value="ALL">Tous les types</option>
                <option value="TERRAIN">Terrain</option>
                <option value="MAISON">Maison</option>
                <option value="APPARTEMENT">Appartement</option>
                <option value="VILLA">Villa</option>
                <option value="BUREAU">Bureau</option>
                <option value="COMMERCE">Commerce</option>
              </select>
              <input
                type="text"
                value={quickLocalisation}
                onChange={(e) => setQuickLocalisation(e.target.value)}
                placeholder="Ville ou quartier..."
                className="flex-1 min-w-0 h-11 px-4 rounded-lg bg-[#1C1C1E] border border-[#3A3A3C] text-[#EFEFEF] text-sm placeholder:text-[#636366] focus:outline-none focus:ring-2 focus:ring-[#D4A843]/50"
                aria-label="Localisation"
              />
              <button
                type="button"
                onClick={() => {
                  const params = new URLSearchParams()
                  if (quickType !== 'ALL') params.set('type', quickType)
                  if (quickLocalisation.trim()) params.set('localisation', quickLocalisation.trim())
                  router.push(`/annonces${params.toString() ? `?${params.toString()}` : ''}`)
                }}
                className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-lg bg-[#D4A843] text-[#1C1C1E] font-semibold text-sm hover:bg-[#B8912E] transition-colors"
              >
                <Search className="h-4 w-4" aria-hidden="true" />
                Rechercher
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            {[
              { icon: Shield, title: 'Sécurité juridique', description: 'Vérification complète des titres fonciers' },
              { icon: Search, title: 'Sélection rigoureuse', description: 'Biens vérifiés et documentés' },
              { icon: TrendingUp, title: 'Investissement rentable', description: 'Meilleurs emplacements stratégiques' },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
                className="bg-[#2C2C2E] border border-[#3A3A3C] backdrop-blur-sm rounded-xl p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-[rgba(212,168,67,0.12)] flex-shrink-0">
                    <item.icon className="h-5 w-5 text-[#D4A843]" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#EFEFEF]">{item.title}</h3>
                    <p className="text-[#8E8E93] text-sm mt-1">{item.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#1C1C1E] to-transparent" aria-hidden="true" />
    </section>
  )
}
