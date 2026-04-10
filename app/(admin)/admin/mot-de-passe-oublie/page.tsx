import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { adminPageMetadata } from '@/lib/seo'
import { ForgotPasswordForm } from './ForgotPasswordForm'

export const metadata = adminPageMetadata({
  title: 'Mot de passe oublié — Back-office FFA',
  pathname: '/admin/mot-de-passe-oublie',
  description: 'Demander un lien de réinitialisation du mot de passe administrateur.',
})

export default async function MotDePasseOubliePage() {
  const session = await auth()
  if (session) redirect('/admin')

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#1C1C1E] flex items-center justify-center">
          <div className="text-[#8E8E93]">Chargement...</div>
        </div>
      }
    >
      <ForgotPasswordForm />
    </Suspense>
  )
}
