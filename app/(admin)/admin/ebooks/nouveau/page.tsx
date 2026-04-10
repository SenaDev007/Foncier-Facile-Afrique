import { adminPageMetadata } from '@/lib/seo'
import EbookForm from '@/components/ebooks/admin/EbookForm'

export const metadata = adminPageMetadata({
  title: 'Nouvel ebook — Admin FFA',
  pathname: '/admin/ebooks/nouveau',
  description: 'Publier un nouveau guide ou ebook sur la boutique.',
})

export default function AdminEbookNouveauPage() {
  return <EbookForm />
}
