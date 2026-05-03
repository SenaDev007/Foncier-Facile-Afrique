import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, ROLES_MANAGERS } from '@/lib/api-admin-auth'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function POST(request: NextRequest) {
  const gate = await requireAdmin(ROLES_MANAGERS)
  if (!gate.ok) return gate.response
  try {
    const formData = await request.formData()
    const file = formData.get('image') as File
    const serviceId = formData.get('serviceId') as string

    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 })
    }

    if (!serviceId) {
      return NextResponse.json({ error: 'ID de service manquant' }, { status: 400 })
    }

    // Validation du type de fichier
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Type de fichier non autorisé' }, { status: 400 })
    }

    // Validation de la taille (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'Fichier trop volumineux (max 5MB)' }, { status: 400 })
    }

    // Vérifier si Vercel Blob est configuré
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const { put } = await import('@vercel/blob')
        const blob = await put(`services/${file.name}`, file, {
          access: 'public',
        })
        return NextResponse.json({
          success: true,
          imageUrl: blob.url,
          filename: file.name,
          message: 'Image uploadée avec succès sur Vercel Blob',
        })
      } catch (blobError) {
        console.error('Erreur Vercel Blob:', blobError)
        // Fallback en local si erreur
      }
    }

    // Créer le dossier services s'il n'existe pas
    const servicesDir = join(process.cwd(), 'public', 'images', 'services')
    try {
      if (!existsSync(servicesDir)) {
        await mkdir(servicesDir, { recursive: true })
      }
    } catch (fsError) {
      return NextResponse.json({ 
        error: 'Le système de fichiers est en lecture seule. Veuillez configurer Vercel Blob.' 
      }, { status: 500 })
    }

    // Générer un nom de fichier sécurisé
    const timestamp = Date.now()
    const extension = file.name.split('.').pop()
    const filename = `${serviceId}-${timestamp}.${extension}`
    const filepath = join(servicesDir, filename)

    // Écrire le fichier
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filepath, buffer)

    // Retourner l'URL publique
    const imageUrl = `/images/services/${filename}`

    return NextResponse.json({ 
      success: true, 
      imageUrl,
      filename,
      message: 'Image uploadée avec succès en local'
    })

  } catch (error) {
    console.error('Erreur lors de l\'upload:', error)
    return NextResponse.json({ error: 'Erreur lors de l\'upload' }, { status: 500 })
  }
}
