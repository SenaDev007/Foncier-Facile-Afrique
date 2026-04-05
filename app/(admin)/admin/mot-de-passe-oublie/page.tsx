import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { ForgotPasswordForm } from './ForgotPasswordForm'

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
