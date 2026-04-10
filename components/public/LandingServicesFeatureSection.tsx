'use client'

import { Shield, FileCheck, Search, Users, Sparkles, Building2 } from 'lucide-react'
import FeatureCarousel, { type FeatureItem } from '@/components/ui/feature-carousel'
import type { PublicServiceCard } from '@/lib/public-services'

const ICONS = [Shield, FileCheck, Search, Users, Sparkles, Building2]

export function LandingServicesFeatureSection({ services }: { services: PublicServiceCard[] }) {
  const features: FeatureItem[] = services.map((s, i) => ({
    id: s.id,
    label: s.title,
    image: s.image,
    description: s.description,
    icon: ICONS[i % ICONS.length],
  }))

  return <FeatureCarousel features={features} />
}
