import { adminPageMetadata } from '@/lib/seo'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { UserCheck, UserX, UserPlus } from 'lucide-react'

export const metadata = adminPageMetadata({
  title: 'Utilisateurs — Admin FFA',
  pathname: '/admin/utilisateurs',
  description: 'Comptes équipe : rôles, accès back-office et sécurité.',
})

export default async function AdminUtilisateursPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      active: true,
      createdAt: true,
    },
  })

  const roleColors: Record<string, string> = {
    SUPER_ADMIN: 'bg-purple-500/20 text-purple-300',
    ADMIN: 'bg-blue-500/20 text-blue-300',
    AGENT: 'bg-green-500/20 text-green-300',
    EDITEUR: 'bg-amber-500/20 text-amber-300',
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-[#EFEFEF]">Utilisateurs</h1>
        <p className="text-[#8E8E93] text-sm mt-1">{users.length} utilisateur{users.length > 1 ? 's' : ''}</p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Link
          href="/admin/utilisateurs/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#D4A843] text-[#1C1C1E] text-sm font-semibold hover:bg-[#B8912E] transition-colors"
        >
          <UserPlus className="h-4 w-4" aria-hidden="true" />
          Créer un utilisateur
        </Link>
      </div>

      <div className="bg-[#2C2C2E] border border-[#3A3A3C] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#3A3A3C]">
              <th className="text-left px-4 py-3 text-[#8E8E93] font-medium">Nom</th>
              <th className="text-left px-4 py-3 text-[#8E8E93] font-medium hidden md:table-cell">Email</th>
              <th className="text-left px-4 py-3 text-[#8E8E93] font-medium">Rôle</th>
              <th className="text-left px-4 py-3 text-[#8E8E93] font-medium">Statut</th>
              <th className="text-left px-4 py-3 text-[#8E8E93] font-medium hidden lg:table-cell">Créé le</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 && (
              <tr><td colSpan={5} className="text-center py-12 text-[#8E8E93]">Aucun utilisateur.</td></tr>
            )}
            {users.map((user) => (
              <tr key={user.id} className="border-b border-[#3A3A3C] last:border-0 hover:bg-[#3A3A3C]/50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#D4A843] flex items-center justify-center flex-shrink-0">
                      <span className="text-[#1C1C1E] text-xs font-bold">{user.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <p className="font-medium text-[#EFEFEF]">{user.name}</p>
                  </div>
                </td>
                <td className="px-4 py-3 text-[#8E8E93] hidden md:table-cell">{user.email}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleColors[user.role] ?? 'bg-[#3A3A3C] text-[#8E8E93]'}`}>
                    {user.role.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1 text-xs font-medium ${user.active ? 'text-green-400' : 'text-red-400'}`}>
                    {user.active
                      ? <><UserCheck className="h-3.5 w-3.5" aria-hidden="true" /> Actif</>
                      : <><UserX className="h-3.5 w-3.5" aria-hidden="true" /> Inactif</>}
                  </span>
                </td>
                <td className="px-4 py-3 text-[#8E8E93] hidden lg:table-cell">{formatDate(user.createdAt.toISOString())}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
