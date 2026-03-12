import type { Metadata } from 'next'
import MerciContent from '@/components/ebooks/MerciContent'

export const metadata: Metadata = {
  title: 'Merci pour votre achat',
  description: 'Confirmation de votre commande ebook — Foncier Facile Afrique',
}

interface PageProps {
  searchParams: Promise<{ tx?: string; transaction_id?: string; id?: string }>
}

export default async function EbooksMerciPage({ searchParams }: PageProps) {
  const params = await searchParams
  const tx = params?.tx ?? params?.transaction_id ?? params?.id ?? null

  return <MerciContent txFromUrl={tx} />
}
