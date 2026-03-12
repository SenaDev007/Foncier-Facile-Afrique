import { NextResponse } from 'next/server'
import { getAllPages } from '@/lib/pages'

export async function GET() {
  try {
    const pages = await getAllPages()
    return NextResponse.json(pages)
  } catch (error) {
    console.error('[admin/pages]', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
