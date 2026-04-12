import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { put } from '@vercel/blob'
import { v4 as uuidv4 } from 'uuid'
import path from 'path'
import fs from 'fs/promises'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_FILE_SIZE = Number(process.env.MAX_FILE_SIZE ?? 5242880)

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ success: false, error: 'Non autorisé' }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ success: false, error: 'Aucun fichier fourni' }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Type de fichier non autorisé (JPEG, PNG, WebP uniquement)' },
        { status: 400 },
      )
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: 'Fichier trop volumineux (5 MB maximum)' },
        { status: 400 },
      )
    }

    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const ext = file.name.split('.').pop() ?? 'jpg'
    const filename = `${uuidv4()}.${ext}`
    const buffer = Buffer.from(await file.arrayBuffer())

    const blobToken = process.env.BLOB_READ_WRITE_TOKEN
    if (blobToken) {
      try {
        const key = `uploads/${year}/${month}/${filename}`
        const blob = await put(key, buffer, {
          access: 'public',
          token: blobToken,
          contentType: file.type,
        })
        return NextResponse.json(
          { success: true, url: blob.url, data: { url: blob.url, filename } },
          { status: 201 },
        )
      } catch (blobErr) {
        console.warn('Vercel Blob upload failed, falling back to filesystem:', blobErr)
      }
    }

    const subDir = path.join('public', 'uploads', String(year), month)
    const fullDir = path.join(process.cwd(), subDir)
    await fs.mkdir(fullDir, { recursive: true })
    await fs.writeFile(path.join(fullDir, filename), buffer)
    const url = `/uploads/${year}/${month}/${filename}`

    return NextResponse.json({ success: true, url, data: { url, filename } }, { status: 201 })
  } catch (error) {
    console.error('POST /api/upload error:', error)
    return NextResponse.json({ success: false, error: "Erreur lors de l'upload" }, { status: 500 })
  }
}
