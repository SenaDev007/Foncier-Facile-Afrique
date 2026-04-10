import Link from 'next/link'
import { Building2 } from 'lucide-react'

export type FooterLink = { title: string; href: string }
export type FooterSocial = { icon: React.ReactNode; link: string; label: string }

interface MinimalFooterProps {
  brandTitle: string
  brandSubtitle?: string
  description: React.ReactNode
  resources: FooterLink[]
  company: FooterLink[]
  socialLinks: FooterSocial[]
  bottomText: React.ReactNode
  logo?: React.ReactNode
  newsletter?: React.ReactNode
}

export function MinimalFooter({
  brandTitle,
  brandSubtitle,
  description,
  resources,
  company,
  socialLinks,
  bottomText,
  logo,
  newsletter,
}: MinimalFooterProps) {
  return (
    <footer className="relative border-t border-[#3A3A3C] bg-[#1C1C1E] text-[#EFEFEF]">
      <div className="mx-auto max-w-7xl bg-[radial-gradient(35%_80%_at_30%_0%,rgba(255,255,255,0.08),transparent)] md:border-x md:border-[#3A3A3C]">
        <div className="bg-[#3A3A3C] absolute inset-x-0 h-px w-full" />
        <div className="grid max-w-7xl grid-cols-12 gap-6 p-6">
          <div className="col-span-12 flex flex-col gap-4 md:col-span-5">
            <div className="flex items-center gap-3">
              {logo ?? (
                <span className="opacity-50">
                  <Building2 className="size-7" />
                </span>
              )}
              <div>
                <p className="font-heading text-base font-semibold">{brandTitle}</p>
                {brandSubtitle ? <p className="text-xs text-[#8E8E93]">{brandSubtitle}</p> : null}
              </div>
            </div>
            <div className="max-w-sm text-sm text-[#8E8E93]">{description}</div>
            <div className="flex gap-2">
              {socialLinks.map((item, i) => (
                <a
                  key={i}
                  className="rounded-md border border-[#3A3A3C] p-1.5 hover:bg-[#2C2C2E] hover:border-[#D4A843]/40"
                  target="_blank"
                  rel="noopener noreferrer"
                  href={item.link}
                  aria-label={item.label}
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="col-span-6 md:col-span-2">
            <span className="mb-2 block text-xs text-[#8E8E93]">Ressources</span>
            <div className="flex flex-col gap-1">
              {resources.map(({ href, title }, i) => (
                <Link key={i} className="w-max py-1 text-sm text-[#EFEFEF] duration-200 hover:underline" href={href}>
                  {title}
                </Link>
              ))}
            </div>
          </div>

          <div className="col-span-6 md:col-span-2">
            <span className="mb-2 block text-xs text-[#8E8E93]">Entreprise</span>
            <div className="flex flex-col gap-1">
              {company.map(({ href, title }, i) => (
                <Link key={i} className="w-max py-1 text-sm text-[#EFEFEF] duration-200 hover:underline" href={href}>
                  {title}
                </Link>
              ))}
            </div>
          </div>

          <div className="col-span-12 md:col-span-3">{newsletter}</div>
        </div>

        <div className="bg-[#3A3A3C] absolute inset-x-0 h-px w-full" />
        <div className="max-w-7xl px-6 pb-5 pt-3">
          <p className="text-center text-xs text-[#8E8E93]">{bottomText}</p>
        </div>
      </div>
    </footer>
  )
}
