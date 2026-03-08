'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react'
import type { TemoignageItem } from '@/types'

interface TestimonialsCarouselProps {
  temoignages: TemoignageItem[]
}

export default function TestimonialsCarousel({ temoignages }: TestimonialsCarouselProps) {
  const [current, setCurrent] = useState(0)

  if (!temoignages.length) return null

  const prev = () => setCurrent((c) => (c === 0 ? temoignages.length - 1 : c - 1))
  const next = () => setCurrent((c) => (c === temoignages.length - 1 ? 0 : c + 1))

  const t = temoignages[current]

  return (
    <section className="bg-primary-light py-16" aria-label="Témoignages clients">
      <div className="container-site">
        <div className="text-center mb-12">
          <h2 className="section-title">Ce que disent nos clients</h2>
          <p className="section-subtitle mx-auto mt-3">Des centaines de familles nous ont fait confiance pour sécuriser leur patrimoine foncier.</p>
        </div>

        <div className="max-w-3xl mx-auto relative">
          <div className="bg-white rounded-2xl shadow-card p-8 md:p-10 text-center">
            <Quote className="h-10 w-10 text-gold/30 mx-auto mb-4" aria-hidden="true" />

            <div className="flex items-center justify-center gap-1 mb-4" aria-label={`Note: ${t.note} sur 5`}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${i < t.note ? 'text-gold fill-gold' : 'text-gray-200'}`}
                  aria-hidden="true"
                />
              ))}
            </div>

            <blockquote>
              <p className="text-gray-700 text-lg leading-relaxed italic">&ldquo;{t.contenu}&rdquo;</p>
              <footer className="mt-6">
                <div className="font-heading font-semibold text-dark text-base">{t.nom}</div>
                {t.localisation && (
                  <div className="text-grey text-sm mt-0.5">{t.localisation}</div>
                )}
              </footer>
            </blockquote>
          </div>

          {temoignages.length > 1 && (
            <div className="flex items-center justify-center gap-4 mt-6">
              <button
                onClick={prev}
                className="p-2.5 rounded-full bg-white shadow-card hover:bg-primary hover:text-white transition-colors"
                aria-label="Témoignage précédent"
              >
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              <div className="flex gap-1.5" role="tablist" aria-label="Navigation témoignages">
                {temoignages.map((_, i) => (
                  <button
                    key={i}
                    role="tab"
                    aria-selected={i === current}
                    onClick={() => setCurrent(i)}
                    className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-primary w-5' : 'bg-gray-300'}`}
                    aria-label={`Témoignage ${i + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={next}
                className="p-2.5 rounded-full bg-white shadow-card hover:bg-primary hover:text-white transition-colors"
                aria-label="Témoignage suivant"
              >
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
