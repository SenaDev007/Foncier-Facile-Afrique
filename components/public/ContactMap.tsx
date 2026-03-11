'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

const OFFICE_POSITION: [number, number] = [9.3375, 2.6303]
const OFFICE_TITLE = 'Foncier Facile Afrique'
const OFFICE_ADDRESS = "Parakou, Bénin — Afrique de l'Ouest"
const OFFICE_PHONE = '+229 96 90 12 04'

// Corriger les icônes Leaflet avec Next.js (chemins par défaut cassés)
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

function MapContent() {
  useFixLeafletIcon()
  return (
    <>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={OFFICE_POSITION} title={OFFICE_TITLE}>
        <Popup>
          <div className="p-1 min-w-[200px] font-sans">
            <p className="font-semibold text-[#1C1C1E] m-0 mb-1">{OFFICE_TITLE}</p>
            <p className="text-sm text-[#6B7280] m-0">{OFFICE_ADDRESS}</p>
            <a href="tel:+22996901204" className="text-sm text-[#D4A843] hover:underline">
              {OFFICE_PHONE}
            </a>
          </div>
        </Popup>
      </Marker>
    </>
  )
}

export default function ContactMap() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return (
      <div
        className="w-full h-[280px] rounded-xl border border-[#3A3A3C] bg-[#2C2C2E] flex items-center justify-center text-[#8E8E93] text-sm"
        role="region"
        aria-label="Carte : bureau Foncier Facile Afrique"
      >
        Chargement de la carte…
      </div>
    )
  }

  return (
    <div
      className="w-full h-[280px] rounded-xl overflow-hidden border border-[#3A3A3C] z-0 [&_.leaflet-container]:rounded-xl"
      role="region"
      aria-label="Carte : bureau Foncier Facile Afrique"
    >
      <MapContainer
        center={OFFICE_POSITION}
        zoom={14}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <MapContent />
      </MapContainer>
    </div>
  )
}
