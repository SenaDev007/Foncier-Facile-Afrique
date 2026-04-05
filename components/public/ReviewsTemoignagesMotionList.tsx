'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Star, CheckCircle2 } from 'lucide-react'
import type { Temoignage } from '@prisma/client'

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.11, delayChildren: 0.05 },
  },
}

const item = {
  hidden: { opacity: 0, y: 28, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.52, ease: [0.21, 0.47, 0.32, 0.98] },
  },
}

function initials(nom: string): string {
  const parts = nom.trim().split(/\s+/).filter(Boolean)
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  return nom.slice(0, 2).toUpperCase() || '?'
}

function formatReviewDate(d: Date): string {
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

type Props = {
  temoignages: Temoignage[]
}

export function ReviewsTemoignagesMotionList({ temoignages }: Props) {
  return (
    <motion.ul
      className="flex flex-wrap justify-center gap-x-5 gap-y-6 md:gap-x-6 md:gap-y-7 list-none p-0 m-0"
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.08 }}
      aria-label="Avis clients vérifiés"
    >
      {temoignages.map((t) => (
        <motion.li
          key={t.id}
          variants={item}
          className="w-full max-w-[380px] shrink-0 mx-auto sm:mx-0"
          whileHover={{ y: -5, transition: { duration: 0.2, ease: 'easeOut' } }}
        >
          <div className="flex flex-col h-full rounded-2xl border border-[#3A3A3C] bg-[#2C2C2E] p-5 hover:border-[#D4A843]/35 transition-colors">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-1" aria-label={`Note ${t.note} sur 5`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < t.note ? 'text-[#D4A843] fill-[#D4A843]' : 'text-[#3A3A3C]'
                    }`}
                  />
                ))}
              </div>
              <time className="text-xs text-[#636366] shrink-0" dateTime={t.createdAt.toISOString()}>
                {formatReviewDate(t.createdAt)}
              </time>
            </div>

            <span className="inline-flex items-center gap-1 self-start rounded-full bg-emerald-500/15 text-emerald-400/95 text-[11px] font-medium px-2.5 py-1 mb-3 border border-emerald-500/25">
              <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
              Avis vérifié
            </span>

            <blockquote className="flex-1">
              <p className="text-[#EFEFEF] text-sm leading-relaxed line-clamp-6">&ldquo;{t.texte}&rdquo;</p>
            </blockquote>

            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-[#3A3A3C]">
              {t.photo ? (
                <div className="relative h-11 w-11 rounded-full overflow-hidden border border-[#D4A843]/30 shrink-0">
                  <Image
                    src={t.photo}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="44px"
                    unoptimized={t.photo.startsWith('/')}
                  />
                </div>
              ) : (
                <div
                  className="h-11 w-11 rounded-full bg-[#D4A843]/20 border border-[#D4A843]/40 flex items-center justify-center text-sm font-semibold text-[#D4A843] shrink-0"
                  aria-hidden
                >
                  {initials(t.nom)}
                </div>
              )}
              <div className="min-w-0">
                <p className="font-medium text-[#EFEFEF] text-sm truncate">{t.nom}</p>
                <p className="text-xs text-[#8E8E93]">Client FFA</p>
              </div>
            </div>
          </div>
        </motion.li>
      ))}
    </motion.ul>
  )
}
