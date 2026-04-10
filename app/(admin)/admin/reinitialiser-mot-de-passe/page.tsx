import { adminPageMetadata } from '@/lib/seo'
import { ResetPasswordForm } from './ResetPasswordForm'

export const metadata = adminPageMetadata({
  title: 'Réinitialiser le mot de passe — Back-office FFA',
  pathname: '/admin/reinitialiser-mot-de-passe',
  description: 'Définir un nouveau mot de passe pour votre compte administrateur.',
})

interface PageProps {
  searchParams: { token?: string }
}

export default function ReinitialiserMotDePassePage({ searchParams }: PageProps) {
  const raw = searchParams.token
  const token = typeof raw === 'string' ? raw.trim() : ''
  return <ResetPasswordForm token={token} />
}
