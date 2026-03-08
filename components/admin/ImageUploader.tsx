'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import { Upload, X, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface UploadedImage {
  url: string
  alt: string
}

interface ImageUploaderProps {
  images: UploadedImage[]
  onImagesChange: (images: UploadedImage[]) => void
  maxImages?: number
}

export default function ImageUploader({ images, onImagesChange, maxImages = 10 }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  const uploadFile = useCallback(async (file: File) => {
    if (images.length >= maxImages) {
      toast.error(`Maximum ${maxImages} images autorisées`)
      return
    }
    if (!file.type.startsWith('image/')) {
      toast.error('Seules les images sont acceptées')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Taille maximale : 5 Mo par image')
      return
    }

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.url) {
        onImagesChange([...images, { url: data.url, alt: file.name.replace(/\.[^/.]+$/, '') }])
        toast.success('Image uploadée')
      } else {
        toast.error(data.error ?? 'Erreur lors de l\'upload')
      }
    } catch {
      toast.error('Erreur de connexion')
    } finally {
      setUploading(false)
    }
  }, [images, onImagesChange, maxImages])

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return
    Array.from(files).forEach((file) => uploadFile(file))
  }, [uploadFile])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    handleFiles(e.dataTransfer.files)
  }, [handleFiles])

  const removeImage = (index: number) => {
    onImagesChange(images.filter((_, i) => i !== index))
  }

  const updateAlt = (index: number, alt: string) => {
    const updated = [...images]
    updated[index] = { ...updated[index], alt }
    onImagesChange(updated)
  }

  return (
    <div className="space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        className={cn(
          'border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer',
          dragOver ? 'border-primary bg-primary-light' : 'border-gray-200 hover:border-primary hover:bg-primary-light/50'
        )}
        onClick={() => document.getElementById('file-upload')?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && document.getElementById('file-upload')?.click()}
        aria-label="Zone de dépôt d'images"
      >
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          onChange={(e) => handleFiles(e.target.files)}
          aria-label="Uploader des images"
        />
        {uploading ? (
          <div className="flex flex-col items-center gap-2 text-grey">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm">Upload en cours...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-grey">
            <Upload className="h-8 w-8 text-primary" aria-hidden="true" />
            <p className="text-sm font-medium">Glissez vos images ici ou <span className="text-primary">cliquez pour parcourir</span></p>
            <p className="text-xs">PNG, JPG, WebP — max 5 Mo par image</p>
          </div>
        )}
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {images.map((img, index) => (
            <div key={index} className="relative group rounded-lg overflow-hidden border border-gray-100">
              <div className="relative h-28">
                <Image src={img.url} alt={img.alt} fill className="object-cover" sizes="200px" />
              </div>
              <div className="p-2">
                <input
                  type="text"
                  value={img.alt}
                  onChange={(e) => updateAlt(index, e.target.value)}
                  placeholder="Texte alternatif"
                  className="w-full text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
                  aria-label={`Texte alternatif image ${index + 1}`}
                />
              </div>
              <button
                onClick={() => removeImage(index)}
                className="absolute top-1.5 right-1.5 p-1 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label={`Supprimer l'image ${index + 1}`}
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
              {index === 0 && (
                <span className="absolute top-1.5 left-1.5 text-xs bg-primary text-white px-1.5 py-0.5 rounded-full">
                  Principale
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
