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
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div>
        <Link href="/admin/messages" className="inline-flex items-center gap-1 text-sm text-[#8E8E93] hover:text-[#D4A843] transition-colors mb-3">
          <ChevronLeft className="h-4 w-4" aria-hidden="true" /> Retour aux messages
        </Link>
        <h1 className="font-heading text-2xl font-bold text-[#EFEFEF]">
          {message.sujet ?? 'Sans sujet'}
        </h1>
        <p className="text-[#8E8E93] text-sm mt-1">Reçu le {formatDate(message.createdAt.toISOString())}</p>
      </div>

      <div className="bg-[#2C2C2E] border border-[#3A3A3C] rounded-xl p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-semibold text-[#EFEFEF]">{message.nom}</p>
            <div className="flex items-center gap-2 mt-1">
              <Mail className="h-3.5 w-3.5 text-[#8E8E93]" aria-hidden="true" />
              <a href={`mailto:${message.email}`} className="text-sm text-[#D4A843] hover:underline">{message.email}</a>
            </div>
            {message.telephone && (
              <div className="flex items-center gap-2 mt-1">
                <Phone className="h-3.5 w-3.5 text-[#8E8E93]" aria-hidden="true" />
                <a href={`tel:${message.telephone}`} className="text-sm text-[#8E8E93] hover:text-[#D4A843] transition-colors">{message.telephone}</a>
              </div>
            )}
          </div>
          <a
            href={`mailto:${message.email}?subject=Re: ${encodeURIComponent(message.sujet ?? 'Votre message')}`}
            className="inline-flex items-center gap-2 bg-[#D4A843] text-[#1C1C1E] text-sm font-semibold px-4 py-2 rounded-xl hover:bg-[#B8912E] transition-colors flex-shrink-0"
          >
            <Reply className="h-4 w-4" aria-hidden="true" /> Répondre
          </a>
        </div>

        {message.sujet && (
          <div>
            <p className="text-xs text-[#8E8E93] font-medium uppercase tracking-wide">Sujet</p>
            <p className="text-sm text-[#EFEFEF] mt-0.5">{message.sujet}</p>
          </div>
        )}

        <div>
          <p className="text-xs text-[#8E8E93] font-medium uppercase tracking-wide mb-2">Message</p>
          <div className="bg-[#1C1C1E] border border-[#3A3A3C] rounded-lg p-4">
            <p className="text-sm text-[#EFEFEF] whitespace-pre-wrap leading-relaxed">{message.contenu}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
