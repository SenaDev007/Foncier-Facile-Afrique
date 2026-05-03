'use client'

import { useState } from 'react'
import { Share2, Facebook, Twitter, Linkedin, MessageCircle, Link2, Check } from 'lucide-react'
import { toast } from 'sonner'

const SITE_URL = typeof window !== 'undefined' ? window.location.origin : 'https://www.foncierfacileafrique.fr'

interface ShareButtonsProps {
  url?: string
  title: string
  description?: string
  variant?: 'inline' | 'stack'
  className?: string
}

function buildShareUrl(
  platform: 'facebook' | 'twitter' | 'linkedin' | 'whatsapp',
  shareUrl: string,
  title: string,
  description?: string
): string {
  const encodedUrl = encodeURIComponent(shareUrl)
  const encodedTitle = encodeURIComponent(title)
  const encodedDesc = encodeURIComponent(description ?? '')

  switch (platform) {
    case 'facebook':
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
    case 'twitter':
      return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}${encodedDesc ? `&via=foncierffa` : ''}`
    case 'linkedin':
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
    case 'whatsapp':
      return `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`
    default:
      return shareUrl
  }
}

export default function ShareButtons({
  url,
  title,
  description,
  variant = 'inline',
  className = '',
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)
  const [open, setOpen] = useState(false)
  const shareUrl = url ? (url.startsWith('http') ? url : `${SITE_URL}${url}`) : (typeof window !== 'undefined' ? window.location.href : SITE_URL)

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      toast.success('Lien copié dans le presse-papiers')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Impossible de copier le lien')
    }
  }

  const buttonClass =
    'inline-flex items-center justify-center w-9 h-9 rounded-lg border border-ffa-divider bg-ffa-elevated text-ffa-fg-muted hover:bg-ffa-gold hover:text-ffa-navy hover:border-ffa-gold transition-all duration-200'
  const links = [
    { label: 'Facebook', href: buildShareUrl('facebook', shareUrl, title, description), icon: Facebook },
    { label: 'Twitter / X', href: buildShareUrl('twitter', shareUrl, title, description), icon: Twitter },
    { label: 'LinkedIn', href: buildShareUrl('linkedin', shareUrl, title, description), icon: Linkedin },
    { label: 'WhatsApp', href: buildShareUrl('whatsapp', shareUrl, title, description), icon: MessageCircle },
  ]

  return (
    <div
      className={`${variant === 'stack' ? 'flex flex-col items-start' : 'inline-flex items-center'} ${className}`}
    >
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="inline-flex items-center gap-2 rounded-full border border-ffa-divider bg-ffa-elevated px-3.5 py-2 text-xs font-medium text-ffa-fg hover:bg-ffa-gold hover:text-ffa-navy hover:border-ffa-gold transition-all duration-200"
          aria-expanded={open}
          aria-haspopup="true"
        >
          <Share2 className="h-4 w-4" aria-hidden="true" />
          Partager
        </button>

        {open && (
          <div
            className="absolute mt-2 right-0 z-30 w-56 rounded-xl border border-ffa-divider bg-ffa-ink shadow-xl p-3 flex flex-col gap-2"
          >
            <p className="text-[11px] text-ffa-fg-muted mb-1">Partager cette page</p>
            <div className="flex items-center gap-1.5">
              {links.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonClass}
                  aria-label={`Partager sur ${label}`}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </a>
              ))}
              <button
                type="button"
                onClick={handleCopyLink}
                className={buttonClass}
                aria-label="Copier le lien"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-[#34C759]" aria-hidden="true" />
                ) : (
                  <Link2 className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
