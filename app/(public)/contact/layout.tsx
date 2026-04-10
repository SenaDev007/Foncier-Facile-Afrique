import type { Metadata } from 'next'
import { publicPageMetadata } from '@/lib/seo'

export const metadata: Metadata = publicPageMetadata({
  title: 'Contact',
  description:
    'Contactez Foncier Facile Afrique : demande d’information, rendez-vous ou accompagnement foncier au Bénin et en Afrique de l’Ouest.',
  pathname: '/contact',
  keywords: ['contact immobilier Parakou', 'conseil foncier Bénin'],
})

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
