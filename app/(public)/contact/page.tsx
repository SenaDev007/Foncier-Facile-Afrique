'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { toast } from 'sonner'
import { Loader2, Mail, Phone, MapPin, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

const ContactMap = dynamic(() => import('@/components/public/ContactMap'), { ssr: false })

interface ContactFormState {
  nom: string
  prenom: string
  email: string
  telephone: string
  sujet: string
  contenu: string
}

export default function ContactPage() {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<ContactFormState>({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    sujet: '',
    contenu: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Message envoyé ! Nous vous répondrons sous 24h.')
        setForm({
          nom: '',
          prenom: '',
          email: '',
          telephone: '',
          sujet: '',
          contenu: '',
        })
      } else {
        toast.error(data.error ?? 'Erreur lors de l\'envoi')
      }
    } catch {
      toast.error('Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-ffa-ink min-h-screen">
      {/* Hero avec image */}
      <section className="relative overflow-hidden border-b border-ffa-divider" style={{ minHeight: '340px' }}>
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="/images/hero/hero-contact.jpg"
            alt="Contactez Foncier Facile Afrique"
            fill
            className="object-cover object-center"
            style={{ animation: 'slowZoom 25s ease-in-out infinite alternate' }}
            priority
            sizes="100vw"
          />
          {/* Overlays */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to right, rgba(22,22,24,0.95) 0%, rgba(22,22,24,0.75) 55%, rgba(22,22,24,0.40) 100%)',
            }}
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(28,28,30,1) 0%, transparent 60%)' }} />
        </div>
        <style>{`@keyframes slowZoom { from { transform: scale(1); } to { transform: scale(1.15); } }`}</style>
        <div className="container-site relative z-10 py-14 md:py-20 text-center">
          <p className="text-ffa-gold text-xs font-semibold uppercase tracking-[0.2em] mb-3">Contact</p>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-ffa-fg leading-tight">Contactez-nous</h1>
          <p className="text-ffa-fg-muted mt-4 max-w-xl mx-auto text-lg leading-relaxed">
            Notre équipe vous répond sous 24 heures ouvrées pour toute question ou projet.
          </p>
        </div>
      </section>

      <div className="container-site py-12">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 max-w-5xl mx-auto">
          <div className="space-y-6">
            {[
              { icon: Phone, title: 'Téléphone / WhatsApp', content: '+229 96 90 12 04', href: 'tel:+22996901204' },
              { icon: Mail, title: 'Email', content: 'contact@foncierfacileafrique.fr', href: 'mailto:contact@foncierfacileafrique.fr' },
              { icon: MapPin, title: 'Adresse', content: 'Parakou, Bénin\nAfrique de l\'Ouest', href: undefined },
            ].map((item) => (
              <div key={item.title} className="bg-ffa-elevated border border-ffa-divider rounded-xl p-5 flex items-start gap-4">
                <div className="p-2.5 rounded-lg bg-ffa-gold/12 flex-shrink-0">
                  <item.icon className="h-5 w-5 text-ffa-gold" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-semibold text-ffa-fg text-sm">{item.title}</p>
                  {item.href ? (
                    <a href={item.href} className="text-ffa-fg-muted text-sm hover:text-ffa-gold transition-colors whitespace-pre-line">{item.content}</a>
                  ) : (
                    <p className="text-ffa-fg-muted text-sm whitespace-pre-line">{item.content}</p>
                  )}
                </div>
              </div>
            ))}
            <div className="rounded-xl overflow-hidden border border-ffa-divider">
              <ContactMap />
            </div>
          </div>

          <div className="lg:col-span-2 bg-ffa-elevated border border-ffa-divider rounded-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-5 [&_label]:text-ffa-fg" noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="sm:col-span-1">
              <Label htmlFor="prenom">Prénom *</Label>
              <Input
                id="prenom"
                name="prenom"
                value={form.prenom}
                onChange={handleChange}
                required
                className="mt-1.5 bg-ffa-ink border-ffa-divider text-ffa-fg placeholder:text-ffa-fg-subtle focus-visible:ring-ffa-gold"
                placeholder="Jean"
              />
            </div>
            <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <Label htmlFor="nom">Nom *</Label>
                <Input
                  id="nom"
                  name="nom"
                  value={form.nom}
                  onChange={handleChange}
                  required
                  className="mt-1.5 bg-ffa-ink border-ffa-divider text-ffa-fg placeholder:text-ffa-fg-subtle focus-visible:ring-ffa-gold"
                  placeholder="Dupont"
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="mt-1.5 bg-ffa-ink border-ffa-divider text-ffa-fg placeholder:text-ffa-fg-subtle focus-visible:ring-ffa-gold"
                  placeholder="jean@email.com"
                />
              </div>
            </div>
          </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <Label htmlFor="telephone">Téléphone</Label>
                  <Input id="telephone" name="telephone" type="tel" value={form.telephone} onChange={handleChange} className="mt-1.5 bg-ffa-ink border-ffa-divider text-ffa-fg placeholder:text-ffa-fg-subtle focus-visible:ring-ffa-gold" placeholder="+229 ..." />
                </div>
                <div>
                  <Label htmlFor="sujet">Sujet</Label>
                  <Input id="sujet" name="sujet" value={form.sujet} onChange={handleChange} className="mt-1.5 bg-ffa-ink border-ffa-divider text-ffa-fg placeholder:text-ffa-fg-subtle focus-visible:ring-ffa-gold" placeholder="Objet de votre message" />
                </div>
              </div>
              <div>
                <Label htmlFor="contenu">Message *</Label>
                <Textarea
                  id="contenu"
                  name="contenu"
                  value={form.contenu}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="mt-1.5 bg-ffa-ink border-ffa-divider text-ffa-fg placeholder:text-ffa-fg-subtle focus-visible:ring-ffa-gold min-h-[120px]"
                  placeholder="Décrivez votre projet ou votre demande..."
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full sm:w-auto gap-2 bg-ffa-gold hover:bg-ffa-gold-light text-ffa-navy font-semibold">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Send className="h-4 w-4" aria-hidden="true" />}
                Envoyer le message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
