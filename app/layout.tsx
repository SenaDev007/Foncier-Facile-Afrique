import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: {
    default: 'Foncier Facile Afrique — Terrains & Immobilier sécurisé au Bénin',
    template: '%s | Foncier Facile Afrique',
  },
  description:
    'Foncier Facile Afrique vous accompagne dans l\'acquisition de terrains et biens immobiliers juridiquement sécurisés en Afrique de l\'Ouest. Conseil, vérification documentaire et courtage foncier à Parakou, Bénin.',
  keywords: ['immobilier Bénin', 'terrain Parakou', 'foncier Afrique', 'achat terrain Bénin', 'titre foncier', 'immobilier Afrique Ouest'],
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://www.foncierfacileafrique.fr',
    siteName: 'Foncier Facile Afrique',
    images: [{ url: '/images/og-default.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${playfair.variable} ${inter.variable}`}>
      <body className="font-body antialiased">
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  )
}
