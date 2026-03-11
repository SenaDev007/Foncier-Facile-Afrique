'use client'

import Image from 'next/image'
import { PhotoProvider, PhotoView } from 'react-photo-view'
import 'react-photo-view/dist/react-photo-view.css'

interface Photo {
  id: string
  url: string
  alt: string | null
  ordre: number
}

interface AnnonceGalleryProps {
  photos: Photo[]
  titre: string
}

export default function AnnonceGallery({ photos, titre }: AnnonceGalleryProps) {
  if (photos.length === 0) {
    return (
      <div className="h-80 bg-[#3A3A3C] rounded-2xl flex items-center justify-center">
        <p className="text-[#8E8E93]">Aucune photo disponible</p>
      </div>
    )
  }

  const ordered = [...photos].sort((a, b) => a.ordre - b.ordre)

  return (
    <PhotoProvider>
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2 relative h-80 rounded-2xl overflow-hidden bg-[#3A3A3C]">
          <PhotoView src={ordered[0].url}>
            <Image
              src={ordered[0].url}
              alt={ordered[0].alt ?? titre}
              fill
              className="object-cover cursor-zoom-in"
              sizes="(max-width:768px) 100vw, 66vw"
              priority
            />
          </PhotoView>
        </div>
        {ordered.slice(1, 5).map((photo) => (
          <div
            key={photo.id}
            className="relative h-40 rounded-xl overflow-hidden bg-[#3A3A3C] cursor-zoom-in"
          >
            <PhotoView src={photo.url}>
              <Image
                src={photo.url}
                alt={photo.alt ?? titre}
                fill
                className="object-cover"
                sizes="33vw"
              />
            </PhotoView>
          </div>
        ))}
      </div>
    </PhotoProvider>
  )
}
