'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Power } from 'lucide-react'
import { toast } from 'sonner'

export function TemoignageToggle({ id, actif }: { id: string; actif: boolean }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleToggle = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/temoignages/${id}/toggle`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actif: !actif }),
      })
      if (res.ok) {
        toast.success(actif ? 'Témoignage désactivé' : 'Témoignage activé')
        router.refresh()
      } else {
        toast.error('Erreur')
      }
    } catch {
      toast.error('Erreur')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={loading}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${actif ? 'bg-[rgba(212,168,67,0.15)] text-[#D4A843] hover:bg-[rgba(212,168,67,0.25)]' : 'bg-[#3A3A3C] text-[#8E8E93] hover:bg-[#2C2C2E]'}`}
      title={actif ? 'Désactiver' : 'Activer'}
    >
      {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" /> : <Power className="h-3.5 w-3.5" aria-hidden="true" />}
      {actif ? 'Désactiver' : 'Activer'}
    </button>
  )
}
