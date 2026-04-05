import Image from 'next/image'
import { Star } from 'lucide-react'
import type { Temoignage } from '@prisma/client'
import type { ReviewAggregate } from '@/lib/reviews-stats'
import { reviewQualityLabel } from '@/lib/reviews-stats'
import { PublicReviewModal } from '@/components/public/PublicReviewModal'
import { ReviewsTemoignagesMotionList } from '@/components/public/ReviewsTemoignagesMotionList'

export type ReviewsIntro = {
  titre?: string | null
  sousTitre?: string | null
  bodyHtml?: string | null
}

type Props = {
  temoignages: Temoignage[]
  stats: ReviewAggregate
  intro?: ReviewsIntro
}

export default function ReviewsVerifiedSection({ temoignages, stats, intro }: Props) {
  const maxBar = Math.max(...stats.distributionDesc, 1)
  const hasStats = stats.total > 0
  const quality = hasStats ? reviewQualityLabel(stats.average) : ''
  const avgDisplay = hasStats
    ? stats.average.toLocaleString('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
    : ''

  return (
    <section
      className="py-14 md:py-20 bg-[#1C1C1E] border-y border-[#2C2C2E]"
      aria-labelledby="reviews-verified-heading"
    >
      <div className="container-site">
        <div className="text-center mb-10 md:mb-12">
          <p className="text-[#D4A843] text-xs font-semibold uppercase tracking-[0.2em] mb-2">
            {intro?.sousTitre ?? 'Avis vérifiés'}
          </p>
          <h2
            id="reviews-verified-heading"
            className="font-heading text-3xl md:text-4xl font-bold text-[#EFEFEF] mb-3"
          >
            {intro?.titre ?? 'Ce que disent nos clients'}
          </h2>
          <p className="text-[#8E8E93] text-lg max-w-2xl mx-auto">
            {intro?.bodyHtml ??
              'Avis publiés par des clients ayant travaillé avec Foncier Facile Afrique. Chaque témoignage est validé en interne.'}
          </p>
          <PublicReviewModal />
        </div>

        {/* Bloc récap — stats BDD (logo sans sous-cadre) */}
        <div className="max-w-4xl mx-auto mb-12 md:mb-14 rounded-2xl border border-[#3A3A3C] bg-[#2C2C2E] p-6 md:p-8 shadow-lg shadow-black/20">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="flex items-center gap-4 md:gap-5">
              <Image
                src="/images/logo/logo FFA 1.png"
                alt="Foncier Facile Afrique"
                width={64}
                height={64}
                className="h-14 w-14 md:h-16 md:w-16 shrink-0 object-contain"
                priority={false}
              />
              <div>
                <p className="text-[#EFEFEF] font-heading font-semibold text-lg">Foncier Facile Afrique</p>
                <p className="text-[#8E8E93] text-sm mt-0.5">
                  {hasStats ? (
                    <>
                      Basé sur <span className="text-[#EFEFEF] font-medium">{stats.total}</span>{' '}
                      {stats.total <= 1 ? 'avis vérifié' : 'avis vérifiés'}
                    </>
                  ) : (
                    'Les avis publiés apparaîtront ici après modération.'
                  )}
                </p>
              </div>
            </div>

            {hasStats ? (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 md:gap-10">
                <div className="text-center sm:text-left">
                  <p className="text-4xl md:text-5xl font-heading font-bold text-[#EFEFEF] leading-none">{avgDisplay}</p>
                  <div className="flex items-center justify-center sm:justify-start gap-0.5 mt-2" aria-hidden>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 md:h-6 md:w-6 ${
                          i < Math.round(stats.average)
                            ? 'text-[#D4A843] fill-[#D4A843]'
                            : 'text-[#3A3A3C]'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-emerald-400/95 font-semibold text-sm mt-2">{quality}</p>
                </div>

                <div className="w-full sm:w-52 space-y-1.5" aria-label="Répartition des notes">
                  {[5, 4, 3, 2, 1].map((star, i) => {
                    const count = stats.distributionDesc[i]
                    const pct = (count / maxBar) * 100
                    return (
                      <div key={star} className="flex items-center gap-2 text-xs text-[#8E8E93]">
                        <span className="w-3 tabular-nums">{star}</span>
                        <Star className="h-3 w-3 text-[#D4A843] fill-[#D4A843] shrink-0" aria-hidden />
                        <div className="flex-1 h-2 rounded-full bg-[#1C1C1E] overflow-hidden">
                          <div
                            className="h-full rounded-full bg-emerald-500/90 transition-[width]"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="w-6 text-right tabular-nums text-[#8E8E93]">{count}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : (
              <p className="text-[#8E8E93] text-sm md:max-w-xs md:text-right">
                Soyez le premier à partager votre expérience : cliquez sur « Donner mon avis ».
              </p>
            )}
          </div>
        </div>

        {temoignages.length > 0 && <ReviewsTemoignagesMotionList temoignages={temoignages} />}
      </div>
    </section>
  )
}
