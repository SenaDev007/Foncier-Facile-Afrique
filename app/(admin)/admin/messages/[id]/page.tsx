import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Phone, Mail, Reply } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'

export const metadata: Metadata = { title: 'Message — Admin FFA' }

interface PageProps {
  params: { id: string }
}

export default async function MessageDetailPage({ params }: PageProps) {
  const message = await prisma.message.findUnique({
    where: { id: params.id },
  })

  if (!message) notFound()

  if (!message.lu) {
    await prisma.message.update({ where: { id: params.id }, data: { lu: true } })
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <Link href="/admin/messages" className="inline-flex items-center gap-1 text-sm text-grey hover:text-primary transition-colors mb-3">
          <ChevronLeft className="h-4 w-4" aria-hidden="true" /> Retour aux messages
        </Link>
        <h1 className="font-heading text-2xl font-bold text-dark">
          {message.sujet ?? 'Sans sujet'}
        </h1>
        <p className="text-grey text-sm mt-1">Reçu le {formatDate(message.createdAt.toISOString())}</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-semibold text-dark">{message.nom}</p>
            <div className="flex items-center gap-2 mt-1">
              <Mail className="h-3.5 w-3.5 text-grey" aria-hidden="true" />
              <a href={`mailto:${message.email}`} className="text-sm text-primary hover:underline">{message.email}</a>
            </div>
            {message.telephone && (
              <div className="flex items-center gap-2 mt-1">
                <Phone className="h-3.5 w-3.5 text-grey" aria-hidden="true" />
                <a href={`tel:${message.telephone}`} className="text-sm text-grey hover:text-primary transition-colors">{message.telephone}</a>
              </div>
            )}
          </div>
          <a
            href={`mailto:${message.email}?subject=Re: ${encodeURIComponent(message.sujet ?? 'Votre message')}`}
            className="inline-flex items-center gap-2 bg-primary text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-primary-dark transition-colors flex-shrink-0"
          >
            <Reply className="h-4 w-4" aria-hidden="true" /> Répondre
          </a>
        </div>

        {message.sujet && (
          <div>
            <p className="text-xs text-grey font-medium uppercase tracking-wide">Sujet</p>
            <p className="text-sm text-dark mt-0.5">{message.sujet}</p>
          </div>
        )}

        <div>
          <p className="text-xs text-grey font-medium uppercase tracking-wide mb-2">Message</p>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-dark whitespace-pre-wrap leading-relaxed">{message.contenu}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
