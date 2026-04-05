'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface SejourPaiementButtonProps {
  paymentToken: string
  disabled?: boolean
}

export function SejourPaiementButton({ paymentToken, disabled }: SejourPaiementButtonProps) {
  const [loading, setLoading] = useState(false)

  const handlePay = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/reservations/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentToken }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(typeof data.error === 'string' ? data.error : 'Erreur')
      }
      const url = data.checkoutUrl as string | undefined
      if (url) {
        window.location.href = url
        return
      }
      throw new Error('URL de paiement manquante')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Erreur')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      type="button"
      disabled={disabled || loading}
      onClick={handlePay}
      className="w-full bg-[#D4A843] hover:bg-[#B8912E] text-[#1C1C1E] font-semibold"
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin mr-2" aria-hidden="true" />
          Redirection vers FedaPay…
        </>
      ) : (
        'Payer avec Mobile Money ou carte'
      )}
    </Button>
  )
}
