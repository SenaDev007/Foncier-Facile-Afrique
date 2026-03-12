'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { Loader2, Save, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { RichTextEditor } from '@/components/admin/RichTextEditor'

interface Section {
  id: string
  key: string
  ordre: number
  actif: boolean
  titre: string | null
  sousTitre: string | null
  bodyHtml: string | null
  imageUrl: string | null
  boutonTexte: string | null
  boutonUrl: string | null
  contenuJson: string | null
}

interface PageData {
  id: string
  slug: string
  titre: string
  sections: Section[]
}

export default function AdminContenusSlugPage() {
  const router = useRouter()
  const params = useParams()
  const slug = params?.slug as string
  const [page, setPage] = useState<PageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [sections, setSections] = useState<Section[]>([])

  useEffect(() => {
    if (!slug) return
    fetch(`/api/admin/pages/${slug}`)
      .then((r) => {
        if (!r.ok) throw new Error('Not found')
        return r.json()
      })
      .then((data: PageData) => {
        setPage(data)
        setSections(data.sections.map((s) => ({ ...s })))
      })
      .catch(() => setPage(null))
      .finally(() => setLoading(false))
  }, [slug])

  const updateSection = (index: number, field: keyof Section, value: string | number | boolean | null) => {
    setSections((prev) => {
      const next = [...prev]
      if (!next[index]) return prev
      next[index] = { ...next[index], [field]: value }
      return next
    })
  }

  const handleSave = async () => {
    if (!page) return
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/pages/${page.slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sections: sections.map((s) => ({
            id: s.id,
            key: s.key,
            ordre: s.ordre,
            actif: s.actif,
            titre: s.titre ?? null,
            sousTitre: s.sousTitre ?? null,
            bodyHtml: s.bodyHtml ?? null,
            imageUrl: s.imageUrl ?? null,
            boutonTexte: s.boutonTexte ?? null,
            boutonUrl: s.boutonUrl ?? null,
            contenuJson: s.contenuJson ?? null,
          })),
        }),
      })
      if (res.ok) {
        toast.success('Contenus enregistrés.')
        router.refresh()
      } else {
        const data = await res.json()
        toast.error(data.error ?? 'Erreur lors de l\'enregistrement.')
      }
    } catch {
      toast.error('Erreur réseau.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-[#D4A843]" aria-hidden="true" />
      </div>
    )
  }

  if (!page) {
    return (
      <div className="text-center py-20">
        <p className="text-[#8E8E93]">Page introuvable.</p>
        <Link href="/admin/contenus" className="mt-4 inline-block text-[#D4A843] hover:underline">
          Retour aux contenus
        </Link>
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/contenus"
            className="p-2 rounded-lg border border-[#3A3A3C] text-[#8E8E93] hover:text-[#EFEFEF] hover:bg-[#2C2C2E]"
            aria-label="Retour"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          </Link>
          <div>
            <h1 className="font-heading text-2xl font-bold text-[#EFEFEF]">{page.titre}</h1>
            <p className="text-[#8E8E93] text-sm">/{page.slug}</p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving} className="gap-2 bg-[#D4A843] hover:bg-[#B8912E] text-[#1C1C1E]">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Save className="h-4 w-4" aria-hidden="true" />}
          Enregistrer
        </Button>
      </div>

      <div className="space-y-8">
        {sections.map((section, index) => (
          <div
            key={section.id}
            className="bg-[#2C2C2E] border border-[#3A3A3C] rounded-xl p-6 space-y-4"
          >
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <span className="font-mono text-sm text-[#D4A843] bg-[#1C1C1E] px-2 py-1 rounded">
                {section.key}
              </span>
              <label className="flex items-center gap-2 text-sm text-[#8E8E93]">
                <Checkbox
                  checked={section.actif}
                  onCheckedChange={(c) => updateSection(index, 'actif', c === true)}
                  className="border-[#3A3A3C] data-[state=checked]:bg-[#D4A843] data-[state=checked]:border-[#D4A843]"
                />
                Section active
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label className="text-[#EFEFEF]">Titre</Label>
                <Input
                  value={section.titre ?? ''}
                  onChange={(e) => updateSection(index, 'titre', e.target.value || null)}
                  className="mt-1.5 bg-[#1C1C1E] border-[#3A3A3C] text-[#EFEFEF]"
                  placeholder="Titre"
                />
              </div>
              <div>
                <Label className="text-[#EFEFEF]">Sous-titre</Label>
                <Input
                  value={section.sousTitre ?? ''}
                  onChange={(e) => updateSection(index, 'sousTitre', e.target.value || null)}
                  className="mt-1.5 bg-[#1C1C1E] border-[#3A3A3C] text-[#EFEFEF]"
                  placeholder="Sous-titre"
                />
              </div>
            </div>

            {(section.key.includes('intro') || section.key === 'hero_texte' || section.key === 'hero' || section.key === 'description' || section.key === 'newsletter_intro' || section.key === 'cta_bas' || section.key === 'cta' || section.key === 'methode_intro') && (
              <div>
                <Label className="text-[#EFEFEF]">Texte / contenu (HTML)</Label>
                <RichTextEditor
                  value={section.bodyHtml ?? ''}
                  onChange={(html) => updateSection(index, 'bodyHtml', html || null)}
                  placeholder="Contenu..."
                  minHeight="120px"
                  className="mt-1.5"
                />
              </div>
            )}
            {!section.key.includes('intro') && section.key !== 'hero_texte' && section.key !== 'hero' && section.key !== 'description' && section.key !== 'newsletter_intro' && section.key !== 'cta_bas' && section.key !== 'cta' && section.key !== 'methode_intro' && section.key !== 'links_services' && section.key !== 'links_utiles' && (
              <div>
                <Label className="text-[#EFEFEF]">Texte / contenu</Label>
                <Textarea
                  value={section.bodyHtml ?? ''}
                  onChange={(e) => updateSection(index, 'bodyHtml', e.target.value || null)}
                  className="mt-1.5 bg-[#1C1C1E] border-[#3A3A3C] text-[#EFEFEF]"
                  rows={2}
                  placeholder="Contenu (HTML possible)"
                />
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label className="text-[#EFEFEF]">Image (URL)</Label>
                <Input
                  value={section.imageUrl ?? ''}
                  onChange={(e) => updateSection(index, 'imageUrl', e.target.value || null)}
                  className="mt-1.5 bg-[#1C1C1E] border-[#3A3A3C] text-[#EFEFEF]"
                  placeholder="/images/..."
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label className="text-[#EFEFEF]">Bouton — texte</Label>
                <Input
                  value={section.boutonTexte ?? ''}
                  onChange={(e) => updateSection(index, 'boutonTexte', e.target.value || null)}
                  className="mt-1.5 bg-[#1C1C1E] border-[#3A3A3C] text-[#EFEFEF]"
                  placeholder="Ex: Nous contacter"
                />
              </div>
              <div>
                <Label className="text-[#EFEFEF]">Bouton — URL</Label>
                <Input
                  value={section.boutonUrl ?? ''}
                  onChange={(e) => updateSection(index, 'boutonUrl', e.target.value || null)}
                  className="mt-1.5 bg-[#1C1C1E] border-[#3A3A3C] text-[#EFEFEF]"
                  placeholder="/contact"
                />
              </div>
            </div>

            {(section.key === 'links_services' || section.key === 'links_utiles') && (
              <div>
                <Label className="text-[#EFEFEF]">{'Liens (JSON : [{"href": string, "label": string}])'}</Label>
                <Textarea
                  value={section.contenuJson ?? ''}
                  onChange={(e) => updateSection(index, 'contenuJson', e.target.value || null)}
                  className="mt-1.5 font-mono text-xs bg-[#1C1C1E] border-[#3A3A3C] text-[#EFEFEF]"
                  rows={6}
                  placeholder='[{"href":"/services","label":"Services"}]'
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
