import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import { v4 as uuidv4 } from 'uuid'

const PRIVATE_EBOOKS_DIR = join(process.cwd(), 'private', 'ebooks')
const MAX_PDF_SIZE = 50 * 1024 * 1024 // 50 MB

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 })
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Seuls les fichiers PDF sont acceptés' },
        { status: 400 }
      )
    }

    if (file.size > MAX_PDF_SIZE) {
      return NextResponse.json(
        { error: 'Fichier trop volumineux (50 Mo maximum)' },
        { status: 400 }
      )
    }

    if (!existsSync(PRIVATE_EBOOKS_DIR)) {
      await mkdir(PRIVATE_EBOOKS_DIR, { recursive: true })
    }

    const ext = file.name.split('.').pop()?.toLowerCase() === 'pdf' ? 'pdf' : 'pdf'
    const filename = `${uuidv4()}.${ext}`
    const filePath = join(PRIVATE_EBOOKS_DIR, filename)

    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(filePath, buffer)

    return NextResponse.json(
      { success: true, filename },
      { status: 201 }
    )
  } catch (error) {
    console.error('[admin/ebooks/upload-pdf]', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'upload du PDF' },
      { status: 500 }
    )
  }
}
