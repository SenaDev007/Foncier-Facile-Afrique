/** Style sombre type anthracite pour les cartes Google Maps */
export const MAP_DARK_STYLES: google.maps.MapTypeStyle[] = [
  { elementType: 'geometry', stylers: [{ color: '#1C1C1E' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#1C1C1E' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#8E8E93' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#2C2C2E' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#8E8E93' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#2C2C2E' }] },
  { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#8E8E93' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#161618' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#636366' }] },
  { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#2C2C2E' }] },
  { featureType: 'administrative', elementType: 'labels.text.fill', stylers: [{ color: '#8E8E93' }] },
]
