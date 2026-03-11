'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
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
    <div className="bg-[#1C1C1E] min-h-screen">
      <div className="container-site py-14">
        <div className="text-center mb-12">
          <p className="text-[#D4A843] text-xs font-semibold uppercase tracking-[0.2em] mb-3">Contact</p>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-[#EFEFEF]">Contactez-nous</h1>
          <p className="text-[#8E8E93] mt-3 max-w-xl mx-auto">Notre équipe vous répond sous 24 heures ouvrées.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 max-w-5xl mx-auto">
          <div className="space-y-6">
            {[
              { icon: Phone, title: 'Téléphone / WhatsApp', content: '+229 96 90 12 04', href: 'tel:+22996901204' },
              { icon: Mail, title: 'Email', content: 'contact@foncierfacileafrique.fr', href: 'mailto:contact@foncierfacileafrique.fr' },
              { icon: MapPin, title: 'Adresse', content: 'Parakou, Bénin\nAfrique de l\'Ouest', href: undefined },
            ].map((item) => (
              <div key={item.title} className="bg-[#2C2C2E] border border-[#3A3A3C] rounded-xl p-5 flex items-start gap-4">
                <div className="p-2.5 rounded-lg bg-[rgba(212,168,67,0.12)] flex-shrink-0">
                  <item.icon className="h-5 w-5 text-[#D4A843]" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-semibold text-[#EFEFEF] text-sm">{item.title}</p>
                  {item.href ? (
                    <a href={item.href} className="text-[#8E8E93] text-sm hover:text-[#D4A843] transition-colors whitespace-pre-line">{item.content}</a>
                  ) : (
                    <p className="text-[#8E8E93] text-sm whitespace-pre-line">{item.content}</p>
                  )}
                </div>
              </div>
            ))}
            <div className="rounded-xl overflow-hidden border border-[#3A3A3C]">
              <ContactMap />
            </div>
          </div>

          <div className="lg:col-span-2 bg-[#2C2C2E] border border-[#3A3A3C] rounded-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-5 [&_label]:text-[#EFEFEF]" noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="sm:col-span-1">
              <Label htmlFor="prenom">Prénom *</Label>
              <Input
                id="prenom"
                name="prenom"
                value={form.prenom}
                onChange={handleChange}
                required
                className="mt-1.5 bg-[#1C1C1E] border-[#3A3A3C] text-[#EFEFEF] placeholder:text-[#636366] focus-visible:ring-[#D4A843]"
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
                  className="mt-1.5 bg-[#1C1C1E] border-[#3A3A3C] text-[#EFEFEF] placeholder:text-[#636366] focus-visible:ring-[#D4A843]"
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
                  className="mt-1.5 bg-[#1C1C1E] border-[#3A3A3C] text-[#EFEFEF] placeholder:text-[#636366] focus-visible:ring-[#D4A843]"
                  placeholder="jean@email.com"
                />
              </div>
            </div>
          </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <Label htmlFor="telephone">Téléphone</Label>
                  <Input id="telephone" name="telephone" type="tel" value={form.telephone} onChange={handleChange} className="mt-1.5 bg-[#1C1C1E] border-[#3A3A3C] text-[#EFEFEF] placeholder:text-[#636366] focus-visible:ring-[#D4A843]" placeholder="+229 ..." />
                </div>
                <div>
                  <Label htmlFor="sujet">Sujet</Label>
                  <Input id="sujet" name="sujet" value={form.sujet} onChange={handleChange} className="mt-1.5 bg-[#1C1C1E] border-[#3A3A3C] text-[#EFEFEF] placeholder:text-[#636366] focus-visible:ring-[#D4A843]" placeholder="Objet de votre message" />
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
                  className="mt-1.5 bg-[#1C1C1E] border-[#3A3A3C] text-[#EFEFEF] placeholder:text-[#636366] focus-visible:ring-[#D4A843] min-h-[120px]"
                  placeholder="Décrivez votre projet ou votre demande..."
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full sm:w-auto gap-2 bg-[#D4A843] hover:bg-[#B8912E] text-[#1C1C1E] font-semibold">
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
