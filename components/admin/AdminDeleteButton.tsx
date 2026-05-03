'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface AdminDeleteButtonProps {
  id: string
  endpoint: string // ex: '/api/admin/temoignages'
  name: string // ex: 'ce témoignage'
  className?: string
  onSuccess?: () => void
}

export function AdminDeleteButton({ id, endpoint, name, className, onSuccess }: AdminDeleteButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer ${name} ? Cette action est irréversible.`)) {
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${endpoint}/${id}`, {
        method: 'DELETE',
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de la suppression')
      }

      toast.success(`${name} supprimé avec succès.`)
      if (onSuccess) {
        onSuccess()
      } else {
        router.refresh()
      }
    } catch (err: any) {
      toast.error(err.message || 'Erreur serveur')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className={`inline-flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors disabled:opacity-50 ${className || ''}`}
      title={`Supprimer ${name}`}
    >
      {loading ? (
        <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
      ) : (
        <Trash2 className="h-3 w-3" aria-hidden="true" />
      )}
      Supprimer
    </button>
  )
}
