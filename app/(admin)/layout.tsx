import { auth } from '@/lib/auth'
import Sidebar from '@/components/admin/Sidebar'
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

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-bg-surface border-b border-bg-border px-6 py-3 flex items-center justify-between">
          <div />
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-text-primary">{session.user?.name}</p>
              <p className="text-xs text-text-muted">{session.user.role}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center">
              <span className="text-text-inverse text-xs font-bold">
                {session.user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
      <Toaster richColors position="top-right" />
    </div>
  )
}
