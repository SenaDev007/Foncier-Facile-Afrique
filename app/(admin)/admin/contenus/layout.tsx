import type { ReactNode } from 'react'
import { adminPageMetadata } from '@/lib/seo'

export const metadata = adminPageMetadata({
  title: 'Contenus du site — Admin FFA',
  pathname: '/admin/contenus',
  description: 'Pages éditoriales et blocs de contenu du site public.',
})

export default function AdminContenusLayout({ children }: { children: ReactNode }) {
  return children
}
