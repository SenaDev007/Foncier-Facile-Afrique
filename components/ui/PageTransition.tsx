'use client'
import { useEffect, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { usePathname } from 'next/navigation'

/** Courbe d’ease partagée avec les écrans 404 / erreur / chargement */
export const PAGE_TRANSITION_EASE = [0.21, 0.47, 0.32, 0.98] as const

/** Entrée douce pour une page sans changement d’URL (404, erreur globale, etc.) */
export function FadeInPage({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion()
  if (reduceMotion) return <>{children}</>
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: PAGE_TRANSITION_EASE }}
    >
      {children}
    </motion.div>
  )
}

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const reduceMotion = useReducedMotion()
  /** Premier chargement : pas d’entrée en opacité 0 (évite page « vide » avant hydratation). */
  const skipEnterAnimation = useRef(true)

  useEffect(() => {
    skipEnterAnimation.current = false
  }, [pathname])

  const transition = reduceMotion
    ? { duration: 0.15 }
    : { duration: 0.35, ease: PAGE_TRANSITION_EASE }

  const initial =
    reduceMotion || skipEnterAnimation.current ? false : { opacity: 0, y: 12 }
  const animate = { opacity: 1, y: 0 }
  const exit = reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={initial}
        animate={animate}
        exit={exit}
        transition={transition}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
