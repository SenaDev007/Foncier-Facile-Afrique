import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

const EBOOKS_IMAGES_DIR = join(process.cwd(), 'public', 'images', 'ebooks')
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const MAX_SIZE = 5 * 1024 * 1024 // 5 MB

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const ebookId = (formData.get('ebookId') as string) || 'cover'

    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Type non autorisé (JPG, PNG, WebP uniquement)' },
        { status: 400 }
      )
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'Fichier trop volumineux (5 Mo maximum)' },
        { status: 400 }
      )
    }

    if (!existsSync(EBOOKS_IMAGES_DIR)) {
      await mkdir(EBOOKS_IMAGES_DIR, { recursive: true })
    }

    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const safeId = ebookId.replace(/[^a-z0-9-]/gi, '-').slice(0, 40)
    const filename = `${safeId}-${Date.now()}.${ext}`
    const filepath = join(EBOOKS_IMAGES_DIR, filename)

    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(filepath, buffer)

    const imageUrl = `/images/ebooks/${filename}`

    return NextResponse.json(
      { success: true, url: imageUrl, filename },
      { status: 201 }
    )
  } catch (error) {
    console.error('[admin/ebooks/upload-cover]', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'upload de la couverture' },
      { status: 500 }
    )
  }
}
