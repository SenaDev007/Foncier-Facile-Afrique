import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { UserCheck, UserX } from 'lucide-react'

export const metadata: Metadata = { title: 'Utilisateurs — Admin FFA' }

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
    SUPER_ADMIN: 'bg-purple-100 text-purple-700',
    ADMIN: 'bg-blue-100 text-blue-700',
    AGENT: 'bg-green-100 text-green-700',
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-dark">Utilisateurs</h1>
        <p className="text-grey text-sm mt-1">{users.length} utilisateur{users.length > 1 ? 's' : ''}</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-4 py-3 text-grey font-medium">Nom</th>
              <th className="text-left px-4 py-3 text-grey font-medium hidden md:table-cell">Email</th>
              <th className="text-left px-4 py-3 text-grey font-medium">Rôle</th>
              <th className="text-left px-4 py-3 text-grey font-medium">Statut</th>
              <th className="text-left px-4 py-3 text-grey font-medium hidden lg:table-cell">Créé le</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 && (
              <tr><td colSpan={5} className="text-center py-12 text-grey">Aucun utilisateur.</td></tr>
            )}
            {users.map((user) => (
              <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold">{user.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <p className="font-medium text-dark">{user.name}</p>
                  </div>
                </td>
                <td className="px-4 py-3 text-grey hidden md:table-cell">{user.email}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleColors[user.role] ?? ''}`}>
                    {user.role.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1 text-xs font-medium ${user.active ? 'text-green-700' : 'text-red-600'}`}>
                    {user.active
                      ? <><UserCheck className="h-3.5 w-3.5" aria-hidden="true" /> Actif</>
                      : <><UserX className="h-3.5 w-3.5" aria-hidden="true" /> Inactif</>}
                  </span>
                </td>
                <td className="px-4 py-3 text-grey hidden lg:table-cell">{formatDate(user.createdAt.toISOString())}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
