'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import type { TemoignageItem } from '@/types'

interface TestimonialsCarouselProps {
  temoignages: TemoignageItem[]
}

export default function TestimonialsCarousel({ temoignages }: TestimonialsCarouselProps) {
  const [current, setCurrent] = useState(0)

  if (!temoignages.length) return null

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((c) => (c === temoignages.length - 1 ? 0 : c + 1))
    }, 5000)
    return () => clearInterval(interval)
  }, [temoignages.length])

  const t = temoignages[current]

  return (
    <section className="py-14 md:py-16 bg-[#2C2C2E] border-y border-[#3A3A3C]" aria-label="Témoignages clients">
      <div className="container-site">
        <div className="text-center mb-8">
          <p className="text-[#D4A843] text-xs font-semibold uppercase tracking-[0.2em] mb-2">
            Témoignages
          </p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-[#EFEFEF] mb-3">
            Ce que disent nos clients
          </h2>
          <p className="text-[#8E8E93] text-lg max-w-2xl mx-auto">
            Des centaines de familles nous ont fait confiance pour sécuriser leur patrimoine foncier.
          </p>
        </div>

        <div className="relative overflow-hidden max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35 }}
              className="bg-[#1C1C1E] border border-[#3A3A3C] rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:border-[#D4A843]/30 transition-all duration-300"
            >
              <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 items-center">
                {t.photo ? (
                  <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden flex-shrink-0 border-2 border-[#D4A843]/40">
                    <Image
                      src={t.photo}
                      alt={t.nom}
                      fill
                      className="object-cover"
                      sizes="112px"
                    />
                  </div>
                ) : (
                  <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden flex-shrink-0 border-2 border-[#D4A843]/40">
                    <Image
                      src={current % 2 === 0 ? '/images/team/avatar-homme.jpg' : '/images/team/avatar-femme.jpg'}
                      alt={t.nom}
                      fill
                      className="object-cover"
                      sizes="112px"
                    />
                  </div>
                )}
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-1 mb-4" aria-label={`Note: ${t.note} sur 5`}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${i < t.note ? 'text-[#D4A843] fill-[#D4A843]' : 'text-[#3A3A3C]'}`}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <blockquote>
                    <p className="text-[#EFEFEF] text-lg leading-relaxed italic">&ldquo;{t.texte}&rdquo;</p>
                    <footer className="mt-6">
                      <div className="font-heading font-semibold text-[#D4A843] text-base">{t.nom}</div>
                    </footer>
                  </blockquote>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {temoignages.length > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            {temoignages.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all ${i === current ? 'bg-[#D4A843] w-8' : 'bg-[#3A3A3C] w-2 hover:bg-[#8E8E93]'}`}
                aria-label={`Témoignage ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
