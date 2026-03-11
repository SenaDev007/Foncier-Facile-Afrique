import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { LoginForm } from './LoginForm'

export default async function LoginPage() {
  const session = await auth()
  
  // Si déjà connecté, rediriger vers le dashboard
  if (session) {
    redirect('/admin')
  }

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#1C1C1E] flex items-center justify-center">
        <div className="text-[#8E8E93]">Chargement...</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
