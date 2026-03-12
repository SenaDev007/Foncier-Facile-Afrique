import type { Metadata } from 'next'
import EbookForm from '@/components/ebooks/admin/EbookForm'

export const metadata: Metadata = { title: 'Nouvel ebook — Admin FFA' }

export default function AdminEbookNouveauPage() {
  return <EbookForm />
}
