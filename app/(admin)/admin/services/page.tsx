'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Loader2, Save, Upload, Trash2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const ICONS = [
  { value: 'Shield', label: 'Bouclier' },
  { value: 'FileCheck', label: 'Document' },
  { value: 'Search', label: 'Recherche' },
  { value: 'Users', label: 'Utilisateurs' },
] as const

interface ServiceItem {
  id: string
  title: string
  description: string
  image: string
  icon: string
  points?: string[]
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingId, setUploadingId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/services')
      .then((res) => res.ok ? res.json() : [])
      .then((data) => setServices(Array.isArray(data) ? data : []))
      .catch(() => {
        toast.error('Erreur chargement des services')
        setServices([])
      })
      .finally(() => setLoading(false))
  }, [])

  const updateService = (index: number, field: keyof ServiceItem, value: string) => {
    setServices((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], [field]: value }
      return next
    })
  }

  const removeService = (index: number) => {
    if (!window.confirm('Retirer cette carte des services ? Enregistrez pour appliquer sur le site public.')) return
    setServices((prev) => prev.filter((_, i) => i !== index))
  }

  const addService = () => {
    const id = `service-${Date.now()}`
    setServices((prev) => [
      ...prev,
      {
        id,
        title: 'Nouveau service',
        description: 'Description à compléter puis enregistrer.',
        image: '/images/services/conseil-foncier.jpg',
        icon: 'Shield',
      },
    ])
    toast.message('Carte ajoutée — pensez à enregistrer.')
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/services', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ services }),
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Services enregistrés')
      } else {
        toast.error(data.error ?? 'Erreur')
      }
    } catch {
      toast.error('Erreur réseau')
    } finally {
      setSaving(false)
    }
  }

  const handleImageUpload = async (serviceId: string, file: File) => {
    setUploadingId(serviceId)
    try {
      const form = new FormData()
      form.append('image', file)
      form.append('serviceId', serviceId)
      const res = await fetch('/api/admin/services/upload', { method: 'POST', body: form })
      const data = await res.json()
      if (data.imageUrl) {
        const index = services.findIndex((s) => s.id === serviceId)
        if (index >= 0) updateService(index, 'image', data.imageUrl)
        toast.success('Image enregistrée')
      } else {
        toast.error(data.error ?? 'Erreur upload')
      }
    } catch {
      toast.error('Erreur upload')
    } finally {
      setUploadingId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-[#D4A843]" aria-hidden="true" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-[#EFEFEF]">Services</h1>
          <p className="text-[#8E8E93] text-sm mt-1">
            Enregistrement en base (paramètre <span className="font-mono text-[#D4A843]/90">services_cards_json</span>) — accueil et{' '}
            <span className="text-[#EFEFEF]">/services</span>. Après enregistrement, le cache des pages concernées est rafraîchi.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={addService}
            className="border-[#3A3A3C] text-[#D4A843] hover:bg-[rgba(212,168,67,0.12)] gap-2"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Ajouter une carte
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#D4A843] hover:bg-[#B8912E] text-[#1C1C1E] font-semibold gap-2"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Save className="h-4 w-4" aria-hidden="true" />}
            Enregistrer
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {services.map((service, index) => (
          <div
            key={service.id}
            className="bg-[#2C2C2E] border border-[#3A3A3C] rounded-xl p-6 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-[#3A3A3C] pb-3 gap-2">
              <span className="text-[#D4A843] font-mono text-sm truncate">{service.id}</span>
              <div className="flex items-center gap-2 shrink-0">
              <select
                value={service.icon}
                onChange={(e) => updateService(index, 'icon', e.target.value)}
                className="bg-[#1C1C1E] border border-[#3A3A3C] rounded-lg px-3 py-1.5 text-sm text-[#EFEFEF]"
              >
                {ICONS.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => removeService(index)}
                className="border-red-500/40 text-red-400 hover:bg-red-500/10 h-9 w-9"
                title="Retirer cette carte"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </Button>
              </div>
            </div>

            <div>
              <Label className="text-[#EFEFEF]">Titre</Label>
              <Input
                value={service.title}
                onChange={(e) => updateService(index, 'title', e.target.value)}
                className="mt-1.5 bg-[#1C1C1E] border-[#3A3A3C] text-[#EFEFEF]"
              />
            </div>

            <div>
              <Label className="text-[#EFEFEF]">Description</Label>
              <Textarea
                value={service.description}
                onChange={(e) => updateService(index, 'description', e.target.value)}
                rows={3}
                className="mt-1.5 bg-[#1C1C1E] border-[#3A3A3C] text-[#EFEFEF]"
              />
            </div>

            <div>
              <Label className="text-[#EFEFEF]">Image</Label>
              <div className="mt-1.5 flex items-center gap-3">
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  className="hidden"
                  id={`file-${service.id}`}
                  onChange={(e) => {
                    const f = e.target.files?.[0]
                    if (f) handleImageUpload(service.id, f)
                  }}
                />
                <label
                  htmlFor={`file-${service.id}`}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-[#3A3A3C] bg-[#1C1C1E] text-[#8E8E93] text-sm cursor-pointer hover:bg-[#2C2C2E]"
                >
                  {uploadingId === service.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <Upload className="h-4 w-4" aria-hidden="true" />
                  )}
                  Changer l&apos;image
                </label>
                {service.image && (
                  <span className="text-xs text-[#8E8E93] truncate max-w-[180px]">{service.image}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {services.length === 0 && (
        <div className="bg-[#2C2C2E] border border-[#3A3A3C] rounded-xl p-12 text-center text-[#8E8E93]">
          Aucun service configuré. Les valeurs par défaut sont affichées sur le site.
        </div>
      )}
    </div>
  )
}
