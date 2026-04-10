import Image from 'next/image'
import { Star } from 'lucide-react'
import type { Temoignage } from '@prisma/client'
import type { ReviewAggregate } from '@/lib/reviews-stats'
import { reviewQualityLabel } from '@/lib/reviews-stats'
import { PublicReviewModal } from '@/components/public/PublicReviewModal'
import { ClientsSection, type Stat, type Testimonial } from '@/components/ui/testimonial-card'

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
  const fiveStarsPct = hasStats ? Math.round((stats.distributionDesc[0] / stats.total) * 100) : 0

  const testimonialsData: Testimonial[] = temoignages.slice(0, 8).map((t, i) => ({
    name: t.nom,
    title: 'Client vérifié — Foncier Facile Afrique',
    quote: t.texte,
    avatarSrc:
      t.photo ||
      [
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=240&auto=format&fit=crop&q=60',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=240&auto=format&fit=crop&q=60',
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=240&auto=format&fit=crop&q=60',
      ][i % 3],
    rating: Math.max(1, Math.min(5, t.note)),
  }))

  const statsData: Stat[] = [
    { value: `${stats.total}+`, label: 'Avis vérifiés' },
    { value: hasStats ? avgDisplay : '5.0', label: 'Note moyenne' },
    { value: hasStats ? `${fiveStarsPct}%` : '100%', label: '5 étoiles' },
  ]

  return (
    <div className="relative border-y border-[#2C2C2E] bg-[#1C1C1E]">
      <ClientsSection
        tagLabel={intro?.sousTitre ?? 'Avis vérifiés'}
        title={intro?.titre ?? 'Ce que disent nos clients'}
        description={
          intro?.bodyHtml ??
          'Avis publiés par des clients ayant travaillé avec Foncier Facile Afrique. Chaque témoignage est validé en interne.'
        }
        stats={statsData}
        testimonials={testimonialsData}
        primarySlot={<PublicReviewModal triggerVariant="button" />}
        primaryActionLabel="Donner mon avis"
        secondaryActionLabel="Voir nos annonces"
        secondaryActionHref="/annonces"
        className="py-8 md:py-10"
      />

      <div className="container-site pb-10">
        <div className="rounded-2xl border border-[#3A3A3C] bg-[#2C2C2E] px-5 py-4 flex flex-wrap items-center gap-4 text-sm text-[#8E8E93]">
          <Image src="/images/logo/logo FFA.png" alt="Foncier Facile Afrique" width={42} height={42} className="object-contain" />
          <span>
            {hasStats
              ? `Basé sur ${stats.total} avis vérifiés — note moyenne ${avgDisplay}/5 (${quality}).`
              : 'Les avis publiés apparaîtront ici après modération.'}
          </span>
          {hasStats && (
            <span className="ml-auto inline-flex items-center gap-1 text-[#D4A843]">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < Math.round(stats.average) ? 'fill-current' : 'text-[#555]'}`} />
              ))}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
