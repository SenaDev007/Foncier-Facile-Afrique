import { adminPageMetadata } from '@/lib/seo'
import { TemoignageForm } from '@/components/admin/TemoignageForm'

export const metadata = adminPageMetadata({
  title: 'Nouveau témoignage — Admin FFA',
  pathname: '/admin/temoignages/new',
  description: 'Ajouter manuellement un avis client ou un témoignage partenaire.',
})

export default function NewTemoignagePage() {
  return <TemoignageForm />
}
