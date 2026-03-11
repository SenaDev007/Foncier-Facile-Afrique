import { auth } from '@/lib/auth'
import { Toaster } from 'sonner'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  if (!session) {
    return (
      <>
        {children}
        <Toaster richColors position="top-right" />
      </>
    )
  }

  // Connecté : seul le layout admin (/admin/layout.tsx) affiche la sidebar et le header
  return (
    <>
      {children}
      <Toaster richColors position="top-right" />
    </>
  )
}
