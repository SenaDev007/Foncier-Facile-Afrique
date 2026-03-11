import Sidebar from '@/components/admin/Sidebar'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') ?? ''

  // Ne pas rediriger sur la page de login : laisser afficher le formulaire
  if (!session && pathname !== '/admin/login') {
    redirect('/admin/login')
  }

  // Page login : afficher uniquement le contenu (pas de sidebar)
  if (!session && pathname === '/admin/login') {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-[#1C1C1E] flex">
      {/* Sidebar - Desktop */}
      <div className="hidden lg:block w-64 bg-[#2C2C2E] border-r border-[#3A3A3C]">
        <Sidebar />
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-[#2C2C2E] border-b border-[#3A3A3C] px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Mobile menu button */}
              <button className="lg:hidden p-2 rounded-lg hover:bg-[#3A3A3C]">
                <svg className="w-6 h-6 text-[#EFEFEF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="text-xl font-semibold text-[#EFEFEF]">
                Backoffice Foncier Facile Afrique
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-[#8E8E93] text-sm">
                {session.user?.name}
              </span>
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-[#D4A843] text-[#1C1C1E] text-sm font-semibold rounded-lg hover:bg-[#B8912E] transition-colors"
              >
                Voir le site
              </a>
              <form action="/api/auth/signout" method="POST">
                <button
                  type="submit"
                  className="px-3 py-1.5 border border-[#3A3A3C] text-[#8E8E93] text-sm rounded-lg hover:bg-[#3A3A3C] transition-colors"
                >
                  Déconnexion
                </button>
              </form>
            </div>
          </div>
        </header>
        
        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
