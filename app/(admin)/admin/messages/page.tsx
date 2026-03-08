import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { MailOpen, Mail } from 'lucide-react'

export const metadata: Metadata = { title: 'Messages — Admin FFA' }

interface PageProps {
  searchParams: { page?: string; lu?: string }
}

const ITEMS_PER_PAGE = 20

export default async function AdminMessagesPage({ searchParams }: PageProps) {
  const page = Math.max(1, parseInt(searchParams.page ?? '1'))
  const skip = (page - 1) * ITEMS_PER_PAGE

  const where = {
    ...(searchParams.lu === 'true' ? { lu: true } : searchParams.lu === 'false' ? { lu: false } : {}),
  }

  const [messages, total, unreadCount] = await Promise.all([
    prisma.message.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: ITEMS_PER_PAGE,
    }),
    prisma.message.count({ where }),
    prisma.message.count({ where: { lu: false } }),
  ])

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-dark">Messages</h1>
          <p className="text-grey text-sm mt-1">
            {total} message{total > 1 ? 's' : ''} — <span className="text-primary font-medium">{unreadCount} non lu{unreadCount > 1 ? 's' : ''}</span>
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          { label: 'Tous', value: undefined },
          { label: 'Non lus', value: 'false' },
          { label: 'Lus', value: 'true' },
        ].map(({ label, value }) => (
          <Link
            key={label}
            href={value !== undefined ? `/admin/messages?lu=${value}` : '/admin/messages'}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${(searchParams.lu ?? undefined) === value ? 'bg-primary text-white' : 'bg-white text-grey hover:bg-primary-light hover:text-primary'}`}
          >
            {label}
          </Link>
        ))}
      </div>

      <div className="space-y-3">
        {messages.length === 0 && (
          <div className="bg-white rounded-xl p-12 text-center text-grey">Aucun message.</div>
        )}
        {messages.map((msg) => (
          <Link
            key={msg.id}
            href={`/admin/messages/${msg.id}`}
            className={`block bg-white rounded-xl p-5 shadow-sm hover:shadow-card transition-shadow ${!msg.lu ? 'border-l-4 border-primary' : ''}`}
          >
            <div className="flex items-start gap-4">
              <div className={`p-2 rounded-lg flex-shrink-0 mt-0.5 ${msg.lu ? 'bg-gray-100' : 'bg-primary-light'}`}>
                {msg.lu
                  ? <MailOpen className="h-4 w-4 text-grey" aria-hidden="true" />
                  : <Mail className="h-4 w-4 text-primary" aria-hidden="true" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className={`text-sm ${msg.lu ? 'text-grey' : 'font-semibold text-dark'}`}>{msg.nom}</p>
                  <p className="text-xs text-grey flex-shrink-0">{formatDate(msg.createdAt.toISOString())}</p>
                </div>
                <p className="text-xs text-grey">{msg.email}</p>
                {msg.sujet && <p className="text-sm text-dark mt-1 font-medium">{msg.sujet}</p>}
                <p className="text-sm text-grey mt-1 truncate">{msg.contenu}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <nav className="flex justify-center gap-2" aria-label="Pagination">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/admin/messages?${new URLSearchParams({ ...searchParams, page: String(p) })}`}
              className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium transition-colors ${p === page ? 'bg-primary text-white' : 'bg-white text-grey hover:bg-primary-light'}`}
              aria-current={p === page ? 'page' : undefined}
            >
              {p}
            </Link>
          ))}
        </nav>
      )}
    </div>
  )
}
