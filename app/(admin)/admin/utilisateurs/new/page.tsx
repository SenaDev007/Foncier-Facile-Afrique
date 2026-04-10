import { adminPageMetadata } from '@/lib/seo'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { UserForm, type RoleOption } from '@/components/admin/UserForm'

export const metadata = adminPageMetadata({
  title: 'Créer un utilisateur — Admin FFA',
  pathname: '/admin/utilisateurs/new',
  description: 'Ajouter un compte administrateur, agent ou éditeur.',
})

const ROLES_SUPER_ADMIN: RoleOption[] = ['SUPER_ADMIN', 'ADMIN', 'AGENT', 'EDITEUR']
const ROLES_ADMIN: RoleOption[] = ['AGENT', 'EDITEUR']

export default async function NewUserPage() {
  const session = await auth()
  if (!session?.user) redirect('/admin/login')
  const role = session.user.role as string
  if (role !== 'SUPER_ADMIN' && role !== 'ADMIN') redirect('/admin')
  const allowedRoles: RoleOption[] = role === 'SUPER_ADMIN' ? ROLES_SUPER_ADMIN : ROLES_ADMIN

  return <UserForm allowedRoles={allowedRoles} />
}
