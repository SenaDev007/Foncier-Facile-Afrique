'use client'

import { useEffect, useState, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
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
  const [icon, setIcon] = useState<any>(null)

  useEffect(() => {
    const L = require('leaflet')
    const goldIcon = new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    })
    setIcon(goldIcon)
  }, [])

  return (
    <>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds points={points.map((p) => ({ lat: p.lat, lng: p.lng }))} single={single} />
      
      <MarkerClusterGroup 
        chunkedLoading 
        maxClusterRadius={60}
        showCoverageOnHover={false}
        spiderfyOnMaxZoom={true}
      >
        {points.map(({ annonce, lat, lng }) => (
          <Marker 
            key={annonce.id} 
            position={[lat, lng]} 
            title={annonce.titre}
            icon={icon}
          >
            <Popup className="premium-map-popup">
              <div className="p-1 min-w-[200px] font-sans">
                {annonce.photos?.[0] && (
                  <div className="relative w-full h-24 mb-2 rounded-lg overflow-hidden border border-[#3A3A3C]">
                    <img 
                      src={annonce.photos[0].url} 
                      alt="" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <p className="font-heading font-semibold text-[#1C1C1E] text-sm m-0 mb-1 line-clamp-1">
                  {annonce.titre}
                </p>
                <p className="text-xs text-[#8E8E93] m-0 line-clamp-1">{annonce.localisation}</p>
                <div className="flex items-center justify-between mt-2">
                  <p className="font-heading font-bold text-[#D4A843] text-sm">
                    {new Intl.NumberFormat('fr-BJ').format(annonce.prix)} FCFA
                  </p>
                  <Link
                    href={`/annonces/${annonce.slug}`}
                    className="text-[10px] bg-[#1C1C1E] text-white px-2 py-1 rounded-md hover:bg-[#D4A843] hover:text-[#1C1C1E] transition-colors"
                  >
                    Détails
                  </Link>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
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
