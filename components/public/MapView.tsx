'use client'

import { useEffect, useState, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import Link from 'next/link'
import 'leaflet/dist/leaflet.css'
import type { AnnonceCard } from '@/types'

interface MapViewProps {
  annonces: AnnonceCard[]
  /** Centre par défaut (ex. Cotonou) */
  center?: [number, number]
  zoom?: number
  /** Un seul point (fiche annonce) : centrer sur ce point */
  single?: boolean
}

const DEFAULT_CENTER: [number, number] = [6.3654, 2.4183]
const DEFAULT_ZOOM = 12

function useFixLeafletIcon() {
  useEffect(() => {
    const L = require('leaflet')
    delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    })
  }, [])
}

function FitBounds({ points, single }: { points: { lat: number; lng: number }[]; single?: boolean }) {
  const map = useMap()
  useEffect(() => {
    if (single || points.length <= 1) return
    if (points.length === 0) return
    const L = require('leaflet')
    const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lng]))
    map.fitBounds(bounds, { padding: [48, 48] })
  }, [map, points, single])
  return null
}

function MapContent({
  points,
  single,
}: {
  points: { annonce: AnnonceCard; lat: number; lng: number }[]
  single?: boolean
}) {
  useFixLeafletIcon()
  return (
    <>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds points={points.map((p) => ({ lat: p.lat, lng: p.lng }))} single={single} />
      {points.map(({ annonce, lat, lng }) => (
        <Marker key={annonce.id} position={[lat, lng]} title={annonce.titre}>
          <Popup>
            <div className="p-1 min-w-[180px] font-sans">
              <p className="font-semibold text-ffa-navy text-sm m-0 mb-1 line-clamp-2">
                {annonce.titre}
              </p>
              <p className="text-xs text-[#6B7280] m-0">{annonce.localisation}</p>
              <p className="font-semibold text-ffa-gold text-xs mt-1">
                {new Intl.NumberFormat('fr-FR').format(annonce.prix)} FCFA
              </p>
              <Link
                href={`/annonces/${annonce.slug}`}
                className="text-xs text-ffa-gold hover:underline"
              >
                Voir l&apos;annonce →
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  )
}

export default function MapView({
  annonces,
  center = DEFAULT_CENTER,
  zoom = DEFAULT_ZOOM,
  single = false,
}: MapViewProps) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const points = useMemo(() => {
    return annonces
      .map((a) => {
        const lat = a.latitude ?? center[0]
        const lng = a.longitude ?? center[1]
        return { annonce: a, lat, lng }
      })
      .filter((p) => p.annonce)
  }, [annonces, center])

  const singlePoint = single && points[0]
  const mapCenter: [number, number] = singlePoint
    ? [singlePoint.lat, singlePoint.lng]
    : [center[0], center[1]]
  const mapZoom = singlePoint ? 15 : zoom

  if (!mounted) {
    return (
      <div
        className="w-full h-[500px] rounded-xl border border-ffa-divider bg-ffa-elevated flex items-center justify-center text-ffa-fg-muted text-sm"
        role="region"
        aria-label="Carte des annonces immobilières"
      >
        Chargement de la carte…
      </div>
    )
  }

  if (points.length === 0) {
    return (
      <div
        className="w-full h-[500px] rounded-xl border border-ffa-divider bg-ffa-elevated flex items-center justify-center text-ffa-fg-muted text-sm"
        role="region"
        aria-label="Carte des annonces immobilières"
      >
        Aucune position à afficher.
      </div>
    )
  }

  return (
    <div
      className="w-full h-[500px] rounded-xl overflow-hidden border border-ffa-divider shadow-card z-0 [&_.leaflet-container]:rounded-xl"
      role="region"
      aria-label="Carte des annonces immobilières"
    >
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <MapContent points={points} single={single} />
      </MapContainer>
    </div>
  )
}
