'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2, Save, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

type StatutPost = 'BROUILLON' | 'PLANIFIE' | 'PUBLIE' | 'ARCHIVE'

interface BlogFormData {
  id?: string
  titre: string
  resume: string
  contenu: string
  statut: StatutPost
  metaTitle: string
  metaDesc: string
  tags: string[]
  imageUne: string
}

interface BlogFormProps {
  initialData?: Partial<BlogFormData>
}

const STATUTS: StatutPost[] = ['BROUILLON', 'PLANIFIE', 'PUBLIE', 'ARCHIVE']

export function BlogForm({ initialData }: BlogFormProps) {
  const router = useRouter()
  const isEdit = Boolean(initialData?.id)

  const [form, setForm] = useState<BlogFormData>({
    titre: initialData?.titre ?? '',
    resume: initialData?.resume ?? '',
    contenu: initialData?.contenu ?? '',
    statut: initialData?.statut ?? 'BROUILLON',
    metaTitle: initialData?.metaTitle ?? '',
    metaDesc: initialData?.metaDesc ?? '',
    tags: initialData?.tags ?? [],
    imageUne: initialData?.imageUne ?? '',
  })
  const [tagInput, setTagInput] = useState('')
  const [saving, setSaving] = useState(false)

  const set = (field: keyof BlogFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase()
    if (tag && !form.tags.includes(tag)) {
      setForm((f) => ({ ...f, tags: [...f.tags, tag] }))
    }
    setTagInput('')
  }

  const removeTag = (tag: string) =>
    setForm((f) => ({ ...f, tags: f.tags.filter((t) => t !== tag) }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.titre || !form.contenu) {
      toast.error('Le titre et le contenu sont obligatoires.')
      return
    }

    setSaving(true)
    try {
      const url = isEdit ? `/api/blog/${initialData!.id}` : '/api/blog'
      const method = isEdit ? 'PATCH' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        toast.success(isEdit ? 'Article mis à jour.' : 'Article créé.')
        router.push('/admin/blog')
        router.refresh()
      } else {
        const data = await res.json()
        toast.error(data.error ?? 'Une erreur est survenue.')
      }
    } catch {
      toast.error('Erreur réseau.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-5">
        <h2 className="font-heading font-semibold text-dark text-lg">Contenu de l&apos;article</h2>

        <div>
          <Label htmlFor="titre">Titre *</Label>
          <Input id="titre" value={form.titre} onChange={set('titre')} required className="mt-1.5" placeholder="Titre de l'article" />
        </div>

        <div>
          <Label htmlFor="statut">Statut</Label>
          <select id="statut" value={form.statut} onChange={set('statut')} className="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
            {STATUTS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div>
          <Label htmlFor="resume">Résumé</Label>
          <Textarea id="resume" value={form.resume} onChange={set('resume')} className="mt-1.5" rows={2} placeholder="Court résumé affiché dans les listes..." />
        </div>

        <div>
          <Label htmlFor="contenu">Contenu * (Markdown supporté)</Label>
          <Textarea id="contenu" value={form.contenu} onChange={set('contenu')} required className="mt-1.5 font-mono text-xs" rows={16} placeholder="# Titre&#10;&#10;Votre contenu en Markdown..." />
        </div>

        <div>
          <Label htmlFor="imageUne">Image à la une (URL)</Label>
          <Input id="imageUne" type="url" value={form.imageUne} onChange={set('imageUne')} className="mt-1.5" placeholder="https://..." />
        </div>

        <div>
          <Label>Tags</Label>
          <div className="mt-1.5 flex gap-2">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
              placeholder="Ajouter un tag et appuyer Entrée"
              className="flex-1"
            />
            <Button type="button" variant="outline" onClick={addTag}>Ajouter</Button>
          </div>
          {form.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {form.tags.map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1 text-xs bg-primary-light text-primary px-2 py-1 rounded-full font-medium">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} aria-label={`Supprimer le tag ${tag}`}>
                    <X className="h-3 w-3" aria-hidden="true" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 space-y-5">
        <h2 className="font-heading font-semibold text-dark text-lg">SEO</h2>

        <div>
          <Label htmlFor="metaTitle">Meta Title</Label>
          <Input id="metaTitle" value={form.metaTitle} onChange={set('metaTitle')} className="mt-1.5" placeholder="Titre pour les moteurs de recherche (60 car. max)" maxLength={60} />
          <p className="text-xs text-grey mt-1">{form.metaTitle.length}/60 caractères</p>
        </div>

        <div>
          <Label htmlFor="metaDesc">Meta Description</Label>
          <Textarea id="metaDesc" value={form.metaDesc} onChange={set('metaDesc')} className="mt-1.5" rows={2} placeholder="Description pour les moteurs de recherche (160 car. max)" maxLength={160} />
          <p className="text-xs text-grey mt-1">{form.metaDesc.length}/160 caractères</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={saving} className="gap-2">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Save className="h-4 w-4" aria-hidden="true" />}
          {isEdit ? 'Mettre à jour' : 'Créer l\'article'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Annuler
        </Button>
      </div>
    </form>
  )
}
