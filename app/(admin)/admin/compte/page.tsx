import type { Metadata } from 'next'
import { auth } from '@/lib/auth'
import { ChangePasswordForm } from './ChangePasswordForm'

export const metadata: Metadata = { title: 'Mon compte — Admin FFA' }

export default async function ComptePage() {
  const session = await auth()

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="font-heading text-2xl font-bold text-[#EFEFEF]">Mon compte</h1>
        <p className="text-[#8E8E93] text-sm mt-1">
          Connecté en tant que <span className="text-[#EFEFEF]">{session?.user?.email}</span> ({session?.user?.role})
        </p>
      </div>

      <div className="bg-[#2C2C2E] border border-[#3A3A3C] rounded-xl p-6 space-y-4">
        <h2 className="font-heading text-lg font-semibold text-[#EFEFEF]">Changer le mot de passe</h2>
        <p className="text-[#8E8E93] text-sm leading-relaxed">
          Saisissez votre mot de passe actuel puis le nouveau (minimum 8 caractères). La session en cours reste active ;
          aux prochaines connexions, utilisez le nouveau mot de passe.
        </p>
        <ChangePasswordForm />
      </div>
    </div>
  )
}
