'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2, Trash2 } from 'lucide-react'

type Props = {
  annonceId: string
  titre: string
}

export function AnnonceAdminDeleteButton({ annonceId, titre }: Props) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!window.confirm(`Supprimer définitivement l’annonce « ${titre} » ? Elle disparaîtra du site public.`)) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/annonces/${annonceId}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      const payload = await res.json().catch(() => ({}))
      if (res.ok) {
        toast.success('Annonce supprimée.')
        router.refresh()
      } else {
        toast.error(typeof payload.error === 'string' ? payload.error : 'Suppression impossible.')
      }
    } catch {
      toast.error('Erreur réseau.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={deleting}
      className="text-xs text-red-400/95 hover:text-red-300 inline-flex items-center gap-1 font-medium disabled:opacity-50"
    >
      {deleting ? <Loader2 className="h-3 w-3 animate-spin shrink-0" aria-hidden /> : <Trash2 className="h-3 w-3 shrink-0" aria-hidden />}
      Supprimer
    </button>
  )
}
