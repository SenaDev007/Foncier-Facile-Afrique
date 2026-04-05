'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { toast } from 'sonner'
import { Loader2, ArrowLeft, Save, Upload, FileUp, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Ebook } from '@prisma/client'

const CATEGORIES = [
  'Guide foncier',
  'Droit immobilier',
  'Investissement',
  'Achat terrain',
  'Sécurisation des biens',
  'Fiscalité et patrimoine',
  'Autre',
]

interface EbookFormProps {
  initialData?: Ebook | null
}

export default function EbookForm({ initialData }: EbookFormProps) {
  const router = useRouter()
  const isEdit = Boolean(initialData?.id)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [uploadingCover, setUploadingCover] = useState(false)
  const [uploadingPdf, setUploadingPdf] = useState(false)
  const [form, setForm] = useState({
    titre: '',
    slug: '',
    description: '',
    contenu: '',
    prixCFA: '',
    prixPromo: '',
    codePromo: '',
    codePromoType: 'FIXE',
    codePromoValeur: '',
    codePromoExpire: '',
    codePromoMax: '',
    couverture: '',
    fichierPdf: '',
    apercuPdf: '',
    pages: '',
    categorie: 'Guide foncier',
    auteur: 'Foncier Facile Afrique',
    publie: false,
    vedette: false,
  })

  useEffect(() => {
    if (initialData) {
      setForm({
        titre: initialData.titre,
        slug: initialData.slug,
        description: initialData.description,
        contenu: initialData.contenu ?? '',
        prixCFA: String(initialData.prixCFA),
        prixPromo: initialData.prixPromo != null ? String(initialData.prixPromo) : '',
        codePromo: initialData.codePromo ?? '',
        codePromoType: (initialData.codePromoType as string) || 'FIXE',
        codePromoValeur: initialData.codePromoValeur != null ? String(initialData.codePromoValeur) : '',
        codePromoExpire: initialData.codePromoExpire
          ? new Date(initialData.codePromoExpire).toISOString().slice(0, 16)
          : '',
        codePromoMax: initialData.codePromoMax != null ? String(initialData.codePromoMax) : '',
        couverture: initialData.couverture,
        fichierPdf: initialData.fichierPdf,
        apercuPdf: initialData.apercuPdf ?? '',
        pages: initialData.pages != null ? String(initialData.pages) : '',
        categorie: initialData.categorie,
        auteur: initialData.auteur,
        publie: initialData.publie,
        vedette: initialData.vedette,
      })
    }
  }, [initialData])

  const handleUploadCover = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !file.type.startsWith('image/')) {
      toast.error('Choisissez une image (JPG, PNG, WebP)')
      return
    }
    setUploadingCover(true)
    const fd = new FormData()
    fd.append('file', file)
    if (initialData?.id) fd.append('ebookId', initialData.id)
    try {
      const res = await fetch('/api/admin/ebooks/upload-cover', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.url) {
        setForm((f) => ({ ...f, couverture: data.url }))
        toast.success('Image uploadée')
      } else {
        toast.error(data.error ?? 'Erreur upload')
      }
    } catch {
      toast.error('Erreur upload')
    } finally {
      setUploadingCover(false)
      e.target.value = ''
    }
  }

  const handleUploadPdf = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || file.type !== 'application/pdf') {
      toast.error('Choisissez un fichier PDF')
      return
    }
    setUploadingPdf(true)
    const fd = new FormData()
    fd.append('file', file)
    try {
      const res = await fetch('/api/admin/ebooks/upload-pdf', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.filename) {
        setForm((f) => ({ ...f, fichierPdf: data.filename }))
        toast.success('PDF uploadé')
      } else {
        toast.error(data.error ?? 'Erreur upload')
      }
    } catch {
      toast.error('Erreur upload')
    } finally {
      setUploadingPdf(false)
      e.target.value = ''
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.titre || !form.description || !form.fichierPdf) {
      toast.error('Titre, description et fichier PDF sont requis.')
      return
    }
    setSaving(true)
    try {
      const payload = {
        ...form,
        prixCFA: Number(form.prixCFA) || 0,
        prixPromo: form.prixPromo ? Number(form.prixPromo) : null,
        codePromoValeur: form.codePromoValeur ? Number(form.codePromoValeur) : null,
        codePromoExpire: form.codePromoExpire || null,
        codePromoMax: form.codePromoMax ? Number(form.codePromoMax) : null,
        pages: form.pages ? Number(form.pages) : null,
      }
      if (isEdit && initialData) {
        const res = await fetch(`/api/admin/ebooks/${initialData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error(await res.json().then((d) => d.error))
        toast.success('Ebook mis à jour.')
        router.push('/admin/ebooks')
      } else {
        const res = await fetch('/api/admin/ebooks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error(await res.json().then((d) => d.error))
        toast.success('Ebook créé.')
        router.push('/admin/ebooks')
      }
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!isEdit || !initialData?.id) return
    if (
      !window.confirm(
        'Supprimer définitivement cet ebook ? Il disparaîtra de la boutique. Impossible s’il existe déjà des commandes.',
      )
    )
      return
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/ebooks/${initialData.id}`, { method: 'DELETE' })
      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        toast.success('Ebook supprimé.')
        router.push('/admin/ebooks')
        router.refresh()
      } else {
        toast.error(typeof data.error === 'string' ? data.error : 'Suppression impossible.')
      }
    } catch {
      toast.error('Erreur réseau.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/ebooks"
          className="p-2 text-[#8E8E93] hover:text-[#D4A843] rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="font-heading text-2xl font-bold text-[#EFEFEF]">
          {isEdit ? 'Modifier l\'ebook' : 'Nouvel ebook'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#2C2C2E] border border-[#3A3A3C] rounded-2xl p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <Label className="text-[#EFEFEF]">Titre *</Label>
            <Input
              value={form.titre}
              onChange={(e) => setForm({ ...form, titre: e.target.value })}
              className="mt-1.5 bg-[#1C1C1E] border-[#3A3A3C] text-[#EFEFEF]"
              required
            />
          </div>
          <div>
            <Label className="text-[#EFEFEF]">Slug (URL)</Label>
            <Input
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="mt-1.5 bg-[#1C1C1E] border-[#3A3A3C] text-[#EFEFEF]"
              placeholder="auto si vide"
            />
          </div>
        </div>

        <div>
          <Label className="text-[#EFEFEF]">Description *</Label>
          <Textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="mt-1.5 bg-[#1C1C1E] border-[#3A3A3C] text-[#EFEFEF]"
            rows={4}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <Label className="text-[#EFEFEF]">Prix (FCFA) *</Label>
            <Input
              type="number"
              value={form.prixCFA}
              onChange={(e) => setForm({ ...form, prixCFA: e.target.value })}
              className="mt-1.5 bg-[#1C1C1E] border-[#3A3A3C] text-[#EFEFEF]"
              required
            />
          </div>
          <div>
            <Label className="text-[#EFEFEF]">Prix promo (FCFA)</Label>
            <Input
              type="number"
              value={form.prixPromo}
              onChange={(e) => setForm({ ...form, prixPromo: e.target.value })}
              className="mt-1.5 bg-[#1C1C1E] border-[#3A3A3C] text-[#EFEFEF]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <Label className="text-[#EFEFEF]">Couverture</Label>
            <div className="mt-1.5 flex gap-2">
              <Input
                value={form.couverture}
                onChange={(e) => setForm({ ...form, couverture: e.target.value })}
                className="flex-1 bg-[#1C1C1E] border-[#3A3A3C] text-[#EFEFEF]"
                placeholder="/images/ebooks/... ou URL"
              />
              <label className="flex-shrink-0 inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-lg border border-[#3A3A3C] text-[#D4A843] hover:bg-[rgba(212,168,67,0.12)] cursor-pointer transition-colors text-sm font-medium">
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleUploadCover}
                  disabled={uploadingCover}
                />
                {uploadingCover ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                {uploadingCover ? 'Upload...' : 'Upload'}
              </label>
            </div>
            {form.couverture && (
              <div className="relative mt-2 h-24 w-32 rounded-lg overflow-hidden border border-[#3A3A3C]">
                {form.couverture.startsWith('http') ? (
                  <img src={form.couverture} alt="Aperçu couverture" className="h-full w-full object-cover" />
                ) : (
                  <Image src={form.couverture} alt="Aperçu couverture" fill className="object-cover" sizes="128px" />
                )}
              </div>
            )}
          </div>
          <div>
            <Label className="text-[#EFEFEF]">Fichier PDF *</Label>
            <div className="mt-1.5 flex gap-2">
              <Input
                value={form.fichierPdf}
                onChange={(e) => setForm({ ...form, fichierPdf: e.target.value })}
                className="flex-1 bg-[#1C1C1E] border-[#3A3A3C] text-[#EFEFEF]"
                placeholder="Nom du fichier après upload"
                required
              />
              <label className="flex-shrink-0 inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-lg border border-[#3A3A3C] text-[#D4A843] hover:bg-[rgba(212,168,67,0.12)] cursor-pointer transition-colors text-sm font-medium">
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  className="sr-only"
                  onChange={handleUploadPdf}
                  disabled={uploadingPdf}
                />
                {uploadingPdf ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileUp className="h-4 w-4" />}
                {uploadingPdf ? 'Upload...' : 'Upload PDF'}
              </label>
            </div>
            <p className="text-[#8E8E93] text-xs mt-1">Le PDF est enregistré dans private/ebooks/ (sécurisé).</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <Label className="text-[#EFEFEF]">Catégorie</Label>
            <Select
              value={form.categorie}
              onValueChange={(v) => setForm({ ...form, categorie: v })}
            >
              <SelectTrigger className="mt-1.5 bg-[#1C1C1E] border-[#3A3A3C] text-[#EFEFEF]">
                <SelectValue placeholder="Choisir une catégorie" />
              </SelectTrigger>
              <SelectContent>
                {(CATEGORIES.includes(form.categorie) ? CATEGORIES : [form.categorie, ...CATEGORIES]).map((cat) => (
                  <SelectItem key={cat} value={cat} className="text-[#1C1C1E]">
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-[#EFEFEF]">Pages</Label>
            <Input
              type="number"
              value={form.pages}
              onChange={(e) => setForm({ ...form, pages: e.target.value })}
              className="mt-1.5 bg-[#1C1C1E] border-[#3A3A3C] text-[#EFEFEF]"
            />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Checkbox
              id="publie"
              checked={form.publie}
              onCheckedChange={(v) => setForm({ ...form, publie: v === true })}
            />
            <Label htmlFor="publie" className="text-[#EFEFEF] cursor-pointer">Publié</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="vedette"
              checked={form.vedette}
              onCheckedChange={(v) => setForm({ ...form, vedette: v === true })}
            />
            <Label htmlFor="vedette" className="text-[#EFEFEF] cursor-pointer">Vedette</Label>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 pt-4">
          <Button type="submit" disabled={saving} className="bg-[#D4A843] text-[#1C1C1E] hover:bg-[#B8912E]">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push('/admin/ebooks')}>
            Annuler
          </Button>
          {isEdit && initialData?.id && (
            <Button
              type="button"
              variant="outline"
              disabled={deleting}
              onClick={handleDelete}
              className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300 ml-auto"
            >
              {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              Supprimer
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
