'use client'
import { motion } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { useInView } from 'framer-motion'

interface Props {
  children: React.ReactNode
  delay?: number       // délai en secondes (ex: 0.1, 0.2, 0.3)
  direction?: 'up' | 'down' | 'left' | 'right'
  className?: string
}

export function AnimateOnScroll({
  children,
  delay = 0,
  direction = 'up',
  className,
}: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.15 })
  // Ne pas appliquer l'état caché côté serveur (SSR) pour éviter une page blanche
  // avant l'hydratation JS. On active l'animation seulement après le montage client.
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const variants = {
    hidden: {
      opacity: 0,
      y: direction === 'up' ? 40 : direction === 'down' ? -40 : 0,
      x: direction === 'left' ? 40 : direction === 'right' ? -40 : 0,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration: 0.7,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      },
    },
  }

  // Avant le montage : contenu visible sans animation (SSR + premier rendu)
  if (!mounted) {
    return <div ref={ref} className={className}>{children}</div>
  }

  return (
    <motion.div
      ref={ref}
      variants={variants}
      // Si déjà visible au chargement : pas d'état initial caché
      initial={isInView ? false : 'hidden'}
      animate={isInView ? 'visible' : 'hidden'}
      className={className}
    >
      {children}
    </motion.div>
  )
}
