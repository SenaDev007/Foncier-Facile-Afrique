import type { Metadata } from 'next'
import { auth } from '@/lib/auth'
import { AdminSessionProvider } from '@/components/admin/AdminSessionProvider'
import { adminSegmentDefaultMetadata } from '@/lib/seo'

export const metadata: Metadata = adminSegmentDefaultMetadata()

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await auth()

  // SessionProvider requis pour useSession / signOut dans Sidebar (next-auth/react).
  // Toaster : uniquement dans app/layout.tsx (évite doublons / conflits Sonner).
  return <AdminSessionProvider>{children}</AdminSessionProvider>
}
