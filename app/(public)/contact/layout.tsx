import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { publicPageMetadata } from '@/lib/seo'

export const metadata: Metadata = publicPageMetadata({
  title: 'Contact',
  description:
    'Contactez Foncier Facile Afrique : demande de conseil, estimation, accompagnement foncier et immobilier au Bénin. Formulaire, téléphone et localisation.',
  pathname: '/contact',
  keywords: ['contact Foncier Facile Afrique', 'conseil foncier Bénin', 'Parakou immobilier'],
})

export default function ContactLayout({ children }: { children: ReactNode }) {
  return children
}
