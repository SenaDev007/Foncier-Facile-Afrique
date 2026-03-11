import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir, readFile } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

// Configuration des services
const defaultServices = [
  { id: 'conseil-foncier', title: 'Conseil foncier', description: 'Accompagnement expert pour sécuriser vos acquisitions avec titre foncier officiel.', image: '/images/services/conseil-foncier.jpg', icon: 'Shield' },
  { id: 'verification-docs', title: 'Vérification documentaire', description: 'Contrôle rigoureux de tous les documents légaux avant toute transaction.', image: '/images/services/verification-docs.jpg', icon: 'FileCheck' },
  { id: 'recherche-terrain', title: 'Recherche terrain', description: 'Identification des meilleurs terrains selon vos critères et budget.', image: '/images/services/recherche-terrain.jpg', icon: 'Search' },
  { id: 'diaspora', title: 'Accompagnement diaspora', description: 'Service dédié aux acheteurs de la diaspora africaine pour investir en toute confiance.', image: '/images/services/diaspora.jpg', icon: 'Users' }
]

// Fichier de stockage des données services
const SERVICES_FILE = join(process.cwd(), 'data', 'services.json')

// Assurer que le dossier data existe
async function ensureDataDir() {
  const dataDir = join(process.cwd(), 'data')
  if (!existsSync(dataDir)) {
    await mkdir(dataDir, { recursive: true })
  }
}

// Lire les services depuis le fichier
async function getServices() {
  try {
    await ensureDataDir()
    const fileContent = await readFile(SERVICES_FILE, 'utf-8')
    return JSON.parse(fileContent)
  } catch (error) {
    // Si le fichier n'existe pas, retourner les services par défaut
    return defaultServices
  }
}

// Écrire les services dans le fichier
async function saveServices(services: any[]) {
  await ensureDataDir()
  await writeFile(SERVICES_FILE, JSON.stringify(services, null, 2), 'utf-8')
}

// GET - Récupérer les services
export async function GET() {
  try {
    const services = await getServices()
    return NextResponse.json(services)
  } catch (error) {
    console.error('Erreur lors de la récupération des services:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// PUT - Mettre à jour les services
export async function PUT(request: NextRequest) {
  try {
    const { services } = await request.json()

    // Validation basique
    if (!Array.isArray(services)) {
      return NextResponse.json({ error: 'Services invalide' }, { status: 400 })
    }

    // Sauvegarder les services
    await saveServices(services)

    return NextResponse.json({ success: true, message: 'Services mis à jour avec succès' })
  } catch (error) {
    console.error('Erreur lors de la mise à jour des services:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
