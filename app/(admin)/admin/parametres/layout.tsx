import type { ReactNode } from 'react'
import { adminPageMetadata } from '@/lib/seo'

export const metadata = adminPageMetadata({
  title: 'Paramètres — Admin FFA',
  pathname: '/admin/parametres',
  description: 'Paramètres globaux, chiffres clés et configuration du site.',
})

export default function AdminParametresLayout({ children }: { children: ReactNode }) {
  return children
}
