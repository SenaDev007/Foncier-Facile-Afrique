import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function POST(request: NextRequest) {
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

    // Créer le dossier services s'il n'existe pas
    const servicesDir = join(process.cwd(), 'public', 'images', 'services')
    if (!existsSync(servicesDir)) {
      await mkdir(servicesDir, { recursive: true })
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
      message: 'Image uploadée avec succès'
    })

  } catch (error) {
    console.error('Erreur lors de l\'upload:', error)
    return NextResponse.json({ error: 'Erreur lors de l\'upload' }, { status: 500 })
  }
}
