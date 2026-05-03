import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { put } from '@vercel/blob'
import { v4 as uuidv4 } from 'uuid'
import path from 'path'
import fs from 'fs/promises'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
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
        { success: false, error: `Type ${file.type} non autorisé (JPEG, PNG, WebP uniquement)` },
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
    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
    const filename = `${uuidv4()}.${ext}`
    const buffer = Buffer.from(await file.arrayBuffer())

    // 1. Essayer Vercel Blob si configuré (Recommandé pour la production)
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
        console.error('Vercel Blob upload failed:', blobErr)
        // On continue vers le fallback filesystem si on n'est pas sur Vercel (détection approximative)
        if (process.env.VERCEL) {
          return NextResponse.json(
            { success: false, error: "L'upload sur Vercel Blob a échoué. Vérifiez votre token." },
            { status: 500 }
          )
        }
      }
    }

    // 2. Fallback Local Filesystem (pour développement local uniquement)
    try {
      const subDir = path.join('public', 'uploads', String(year), month)
      const fullDir = path.join(process.cwd(), subDir)
      
      await fs.mkdir(fullDir, { recursive: true })
      await fs.writeFile(path.join(fullDir, filename), buffer)
      
      // Toujours utiliser des slashes / pour les URLs web, même sur Windows
      const url = `/uploads/${year}/${month}/${filename}`

      return NextResponse.json({ success: true, url, data: { url, filename } }, { status: 201 })
    } catch (fsErr: any) {
      console.error('Filesystem upload error:', fsErr)
      
      let errorMsg = "Erreur lors de l'écriture du fichier sur le serveur."
      if (fsErr.code === 'EROFS' || process.env.VERCEL) {
        errorMsg = "Impossible d'écrire sur le disque (système de fichiers en lecture seule). Utilisez Vercel Blob en production."
      }

      return NextResponse.json(
        { success: false, error: errorMsg },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('POST /api/upload error:', error)
    return NextResponse.json({ success: false, error: "Erreur critique lors de l'upload" }, { status: 500 })
  }
}
