'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Loader2, Mail, Phone, MapPin, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

export default function ContactPage() {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ nom: '', email: '', telephone: '', sujet: '', message: '' })

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
        setForm({ nom: '', email: '', telephone: '', sujet: '', message: '' })
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
    <div className="bg-[#F9F9F6] min-h-screen">
      <div className="container-site py-14">
        <div className="text-center mb-12">
          <h1 className="section-title">Contactez-nous</h1>
          <p className="section-subtitle mx-auto mt-3">Notre équipe vous répond sous 24 heures ouvrées.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 max-w-5xl mx-auto">
          <div className="space-y-6">
            {[
              { icon: Phone, title: 'Téléphone / WhatsApp', content: '+229 96 90 12 04', href: 'tel:+22996901204' },
              { icon: Mail, title: 'Email', content: 'contact@foncierfacileafrique.fr', href: 'mailto:contact@foncierfacileafrique.fr' },
              { icon: MapPin, title: 'Adresse', content: 'Parakou, Bénin\nAfrique de l\'Ouest', href: undefined },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-xl p-5 shadow-sm flex items-start gap-4">
                <div className="p-2.5 rounded-lg bg-primary-light flex-shrink-0">
                  <item.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-semibold text-dark text-sm">{item.title}</p>
                  {item.href ? (
                    <a href={item.href} className="text-grey text-sm hover:text-primary transition-colors whitespace-pre-line">{item.content}</a>
                  ) : (
                    <p className="text-grey text-sm whitespace-pre-line">{item.content}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-2 bg-white rounded-2xl shadow-card p-8">
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <Label htmlFor="nom">Nom complet *</Label>
                  <Input id="nom" name="nom" value={form.nom} onChange={handleChange} required className="mt-1.5" placeholder="Jean Dupont" />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} required className="mt-1.5" placeholder="jean@email.com" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <Label htmlFor="telephone">Téléphone</Label>
                  <Input id="telephone" name="telephone" type="tel" value={form.telephone} onChange={handleChange} className="mt-1.5" placeholder="+229 ..." />
                </div>
                <div>
                  <Label htmlFor="sujet">Sujet</Label>
                  <Input id="sujet" name="sujet" value={form.sujet} onChange={handleChange} className="mt-1.5" placeholder="Objet de votre message" />
                </div>
              </div>
              <div>
                <Label htmlFor="message">Message *</Label>
                <Textarea id="message" name="message" value={form.message} onChange={handleChange} required rows={5} className="mt-1.5" placeholder="Décrivez votre projet ou votre demande..." />
              </div>
              <Button type="submit" disabled={loading} className="w-full sm:w-auto gap-2">
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
