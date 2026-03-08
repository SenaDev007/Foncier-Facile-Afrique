'use client'

import { useEffect, useRef } from 'react'
import type { AnnonceCard } from '@/types'

interface MapViewProps {
  annonces: AnnonceCard[]
}

export default function MapView({ annonces }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<unknown>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    const initMap = async () => {
      const L = (await import('leaflet')).default
      await import('leaflet/dist/leaflet.css')

      const iconDefault = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      })

      if (!mapRef.current) return

      const map = L.map(mapRef.current, {
        center: [6.3703, 2.3912],
        zoom: 12,
      })
      mapInstanceRef.current = map

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map)

      annonces.forEach((annonce) => {
        if (!annonce.localisation) return
        const marker = L.marker([6.3703, 2.3912], { icon: iconDefault })
          .bindPopup(`
            <div class="font-body">
              <p class="font-semibold text-sm text-dark">${annonce.titre}</p>
              <p class="text-xs text-grey mt-0.5">${annonce.localisation}</p>
              <p class="text-primary font-bold text-sm mt-1">${new Intl.NumberFormat('fr-FR').format(annonce.prix)} FCFA</p>
              <a href="/annonces/${annonce.slug}" class="text-xs text-primary underline">Voir l'annonce →</a>
            </div>
          `)
        marker.addTo(map)
      })
    }

    initMap().catch(console.error)

    return () => {
      if (mapInstanceRef.current) {
        (mapInstanceRef.current as { remove: () => void }).remove()
        mapInstanceRef.current = null
      }
    }
  }, [annonces])

  return (
    <div
      ref={mapRef}
      className="w-full h-[500px] rounded-xl overflow-hidden shadow-card z-0"
      role="region"
      aria-label="Carte des annonces immobilières"
    />
  )
}
