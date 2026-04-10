import type { ReactNode } from 'react'
import { adminPageMetadata } from '@/lib/seo'

export const metadata = adminPageMetadata({
  title: 'Cartes services — Admin FFA',
  pathname: '/admin/services',
  description: 'Gestion des cartes « Nos services » affichées sur le site public.',
})

export default function AdminServicesLayout({ children }: { children: ReactNode }) {
  return children
}
