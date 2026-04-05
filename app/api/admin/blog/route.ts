import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin, ROLES_CONTENT } from '@/lib/api-admin-auth'

// GET - Récupérer tous les articles de blog
export async function GET() {
  const gate = await requireAdmin(ROLES_CONTENT)
  if (!gate.ok) return gate.response
  try {
    const posts = await prisma.blogPost.findMany({
      include: {
        auteur: { select: { name: true } }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(posts)
  } catch (error) {
    console.error('Erreur lors de la récupération des articles:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// POST - Créer un nouvel article
export async function POST(request: NextRequest) {
  const gate = await requireAdmin(ROLES_CONTENT)
  if (!gate.ok) return gate.response
  try {
    const data = await request.json()
    
    const post = await prisma.blogPost.create({
      data: {
        titre: data.titre,
        resume: data.resume,
        contenu: data.contenu,
        imageUne: data.imageUne,
        statut: data.statut,
        metaTitle: data.metaTitle,
        metaDesc: data.metaDesc,
        tags: data.tags || [],
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : null,
        slug: generateSlug(data.titre),
        auteurId: 'default-user', // À adapter selon votre système d'authentification
      },
      include: {
        auteur: { select: { name: true } }
      }
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de la création de l\'article:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// Fonctions utilitaires
function generateSlug(titre: string): string {
  return titre
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') + '-' + Date.now()
}
