'use client'

import { motion } from 'framer-motion'
import AnnonceCard from '@/components/public/AnnonceCard'
import type { AnnonceCard as AnnonceCardType } from '@/types'

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.06 },
  },
}

const item = {
  hidden: { opacity: 0, y: 32, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: [0.21, 0.47, 0.32, 0.98] },
  },
}

type Props = {
  annonces: AnnonceCardType[]
}

export function HomeAnnoncesMotionGrid({ annonces }: Props) {
  return (
    <motion.ul
      className="flex flex-wrap justify-center gap-x-5 gap-y-6 md:gap-x-6 md:gap-y-7 list-none p-0 m-0"
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.08 }}
      aria-label="Liste des annonces"
    >
      {annonces.map((annonce) => (
        <motion.li
          key={annonce.id}
          variants={item}
          className="w-full max-w-[320px] shrink-0 mx-auto sm:mx-0"
        >
          <AnnonceCard annonce={annonce} />
        </motion.li>
      ))}
    </motion.ul>
  )
}
