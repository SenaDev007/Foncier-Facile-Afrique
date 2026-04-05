import { ResetPasswordForm } from './ResetPasswordForm'

interface PageProps {
  searchParams: { token?: string }
}

export default function ReinitialiserMotDePassePage({ searchParams }: PageProps) {
  const raw = searchParams.token
  const token = typeof raw === 'string' ? raw.trim() : ''
  return <ResetPasswordForm token={token} />
}
