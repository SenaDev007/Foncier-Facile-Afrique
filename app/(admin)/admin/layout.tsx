import Sidebar from '@/components/admin/Sidebar'
import { AdminSignOutButton } from '@/components/admin/AdminSignOutButton'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { AdminMobileMenu } from '@/components/admin/AdminMobileMenu'
import { prisma } from '@/lib/prisma'

const ADMIN_BARE_PATHS = [
  '/admin/login',
  '/admin/mot-de-passe-oublie',
  '/admin/reinitialiser-mot-de-passe',
]

export const dynamic = 'force-dynamic'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') ?? ''

  const isBare = ADMIN_BARE_PATHS.includes(pathname)

  if (!session && !isBare) {
    redirect('/admin/login')
  }

  // Si on est connecté, on récupère le nom frais en BDD pour éviter le cache session
  let dbUserName = session?.user?.name
  if (session?.user?.email) {
    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { name: true }
    })
    if (dbUser) dbUserName = dbUser.name
  }

  if (isBare) {
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
              <AdminMobileMenu />
              <h1 className="text-xl font-semibold text-[#EFEFEF]">
                Backoffice Foncier Facile Afrique
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-[#8E8E93] text-sm">
                {dbUserName ?? ''}
              </span>
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-[#D4A843] text-[#1C1C1E] text-sm font-semibold rounded-lg hover:bg-[#B8912E] transition-colors"
              >
                Voir le site
              </a>
              <AdminSignOutButton />
            </div>
          </div>
        </header>
        
        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
