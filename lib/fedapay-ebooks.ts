const FEDAPAY_BASE =
  process.env.FEDAPAY_ENV === 'live'
    ? 'https://api.fedapay.com/v1'
    : 'https://sandbox-api.fedapay.com/v1'

export interface FedaPayTransactionCreateParams {
  description: string
  amount: number
  callback_url: string
  customer: {
    firstname: string
    lastname?: string
    email: string
    phone_number: { number: string; country: string }
  }
}

export interface FedaPayTransaction {
  id: number
  reference?: string
  amount: number
  status?: string
}

export async function createFedaPayTransaction(
  params: FedaPayTransactionCreateParams
): Promise<FedaPayTransaction | null> {
  const key = process.env.FEDAPAY_SECRET_KEY
  if (!key) {
    console.error('[FedaPay] FEDAPAY_SECRET_KEY manquant')
    return null
  }
  try {
    const res = await fetch(`${FEDAPAY_BASE}/transactions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        description: params.description,
        amount: params.amount,
        currency: { iso: 'XOF' },
        callback_url: params.callback_url,
        customer: params.customer,
      }),
    })
    if (!res.ok) {
      const err = await res.text()
      console.error('[FedaPay] create transaction:', res.status, err)
      return null
    }
    const data = await res.json()
    const tx = data.data ?? data
    return { id: tx.id, reference: tx.reference, amount: tx.amount ?? params.amount, status: tx.status }
  } catch (e) {
    console.error('[FedaPay] create transaction error:', e)
    return null
  }
}

export async function getFedaPayTransactionToken(transactionId: number): Promise<{ url?: string } | null> {
  const key = process.env.FEDAPAY_SECRET_KEY
  if (!key) return null
  try {
    const res = await fetch(`${FEDAPAY_BASE}/transactions/${transactionId}/token`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    })
    if (!res.ok) {
      const err = await res.text()
      console.error('[FedaPay] token:', res.status, err)
      return null
    }
    const data = await res.json()
    const tokenData = data.data ?? data
    const url = tokenData.url ?? tokenData.token_url
    return url ? { url } : null
  } catch (e) {
    console.error('[FedaPay] token error:', e)
    return null
  }
}
