'use client'

import { useState } from 'react'
import Image from 'next/image'
import { BookOpen } from 'lucide-react'

interface EbookCoverImageProps {
  src: string
  alt: string
  className?: string
  sizes?: string
  priority?: boolean
}

export default function EbookCoverImage({ src, alt, className, sizes, priority }: EbookCoverImageProps) {
  const [error, setError] = useState(false)

  if (error || !src) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#2C2C2E]">
        <BookOpen className="w-24 h-24 text-[#D4A843] opacity-40" />
      </div>
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className={className}
      sizes={sizes}
      priority={priority}
      onError={() => setError(true)}
    />
  )
}
