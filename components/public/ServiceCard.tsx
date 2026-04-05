'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

interface ServiceCardProps {
  id: string
  title: string
  description: string
  image: string
  index: number
}

export default function ServiceCard({ id, title, description, image, index }: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -6 }}
      className="group h-full"
    >
      <Link href="/services" className="block h-full">
        <div className="relative h-full flex flex-col bg-ffa-elevated border border-ffa-divider rounded-2xl overflow-hidden shadow-lg hover:shadow-xl hover:shadow-ffa-gold/10 hover:border-ffa-gold/30 transition-all duration-300">
          <div className="relative w-full h-52 min-h-[208px] overflow-hidden flex-shrink-0 bg-ffa-panel">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              unoptimized={image.startsWith('/')}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2C2C2E] via-[#2C2C2E]/60 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="font-heading font-bold text-[#EFEFEF] text-lg drop-shadow-lg">{title}</h3>
            </div>
          </div>
          <div className="p-6 flex flex-col flex-1">
            <p className="text-[#8E8E93] text-sm leading-relaxed flex-1">{description}</p>
            <span className="mt-4 inline-flex items-center gap-2 text-[#D4A843] font-semibold text-sm group-hover:gap-3 transition-all">
              Découvrir <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
