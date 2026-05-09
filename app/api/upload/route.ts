import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { put } from '@vercel/blob'
import { v4 as uuidv4 } from 'uuid'
import path from 'path'
import fs from 'fs/promises'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'application/pdf']
const MAX_FILE_SIZE = Number(process.env.MAX_FILE_SIZE ?? 10485760) // 10 MB

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
        { success: false, error: `Type ${file.type} non autorisé (JPEG, PNG, WebP, PDF uniquement)` },
        { status: 400 },
      )
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: 'Fichier trop volumineux (10 MB maximum)' },
        { status: 400 },
      )
    }

    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
    const filename = `${uuidv4()}.${ext}`
    const key = `ffa/uploads/${year}/${month}/${filename}`

    // ── PRODUCTION : Vercel Blob (stockage persistant) ─────────────────────
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN
    if (blobToken) {
      const blob = await put(key, file, {
        access: 'public',
        token: blobToken,
        contentType: file.type,
      })
      return NextResponse.json(
        { success: true, url: blob.url, data: { url: blob.url, filename } },
        { status: 201 },
      )
    }

    // ── DÉVELOPPEMENT LOCAL : Système de fichiers ──────────────────────────
    if (process.env.VERCEL) {
      // Sur Vercel sans token configuré → erreur explicite
      return NextResponse.json(
        {
          success: false,
          error:
            "BLOB_READ_WRITE_TOKEN manquant. Configurez Vercel Blob dans les paramètres du projet Vercel (Storage → Blob → Connect).",
        },
        { status: 500 },
      )
    }

    // Local uniquement
    const buffer = Buffer.from(await file.arrayBuffer())
    const subDir = path.join('public', 'uploads', String(year), month)
    const fullDir = path.join(process.cwd(), subDir)
    await fs.mkdir(fullDir, { recursive: true })
    await fs.writeFile(path.join(fullDir, filename), buffer)
    const url = `/uploads/${year}/${month}/${filename}`

    return NextResponse.json({ success: true, url, data: { url, filename } }, { status: 201 })
  } catch (error) {
    console.error('POST /api/upload error:', error)
    return NextResponse.json(
      { success: false, error: "Erreur critique lors de l'upload. Vérifiez la configuration Vercel Blob." },
      { status: 500 },
    )
  }
}
