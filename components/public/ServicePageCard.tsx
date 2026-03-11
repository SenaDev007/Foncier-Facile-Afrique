'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'

const SERVICE_IMAGES: Record<string, string> = {
  conseil: '/images/services/conseil-foncier.jpg',
  verification: '/images/services/verification-docs.jpg',
  courtage: '/images/services/recherche-terrain.jpg',
  investissement: '/images/services/diaspora.jpg',
  diaspora: '/images/services/diaspora.jpg',
  juridique: '/images/services/conseil-foncier.jpg',
}

interface ServicePageCardProps {
  id: string
  title: string
  description: string
  points: string[]
  index: number
}

export default function ServicePageCard({ id, title, description, points, index }: ServicePageCardProps) {
  const image = SERVICE_IMAGES[id] ?? '/images/services/conseil-foncier.jpg'

  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      whileHover={{ y: -4 }}
      className="group bg-[#2C2C2E] border border-[#3A3A3C] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl hover:shadow-[#D4A843]/10 hover:border-[#D4A843]/30 transition-all duration-300 flex flex-col"
    >
      <div className="relative w-full h-44 min-h-[176px] overflow-hidden flex-shrink-0 bg-[#3A3A3C]">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-600 ease-out"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2C2C2E] via-[#2C2C2E]/50 to-transparent" />
        <h2 className="absolute bottom-4 left-5 right-5 font-heading font-bold text-[#EFEFEF] text-lg drop-shadow-lg">
          {title}
        </h2>
      </div>
      <div className="p-6 flex flex-col flex-1">
        <p className="text-[#8E8E93] text-sm leading-relaxed mb-5">{description}</p>
        <ul className="space-y-2 mt-auto">
          {points.map((point) => (
            <li key={point} className="flex items-start gap-2 text-sm text-[#8E8E93]">
              <CheckCircle className="h-4 w-4 text-[#D4A843] mt-0.5 flex-shrink-0" aria-hidden="true" />
              {point}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}
