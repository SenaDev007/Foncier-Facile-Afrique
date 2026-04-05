import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getPageBySlugWithSections } from '@/lib/pages'
import { requireAdmin, ROLES_CONTENT } from '@/lib/api-admin-auth'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const gate = await requireAdmin(ROLES_CONTENT)
  if (!gate.ok) return gate.response
  try {
    const { slug } = await params
    const page = await getPageBySlugWithSections(slug)
    if (!page) return NextResponse.json({ error: 'Page introuvable' }, { status: 404 })
    return NextResponse.json(page)
  } catch (error) {
    console.error('[admin/pages/[slug]] GET', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const gate = await requireAdmin(ROLES_CONTENT)
  if (!gate.ok) return gate.response
  try {
    const { slug } = await params
    const body = await req.json()
    const { titre, sections } = body as {
      titre?: string
      sections?: Array<{
        id?: string
        key: string
        ordre?: number
        actif?: boolean
        titre?: string | null
        sousTitre?: string | null
        bodyHtml?: string | null
        imageUrl?: string | null
        boutonTexte?: string | null
        boutonUrl?: string | null
        contenuJson?: string | null
      }>
    }

    const page = await prisma.page.findUnique({ where: { slug } })
    if (!page) return NextResponse.json({ error: 'Page introuvable' }, { status: 404 })

    if (titre !== undefined) {
      await prisma.page.update({
        where: { id: page.id },
        data: { titre },
      })
    }

    if (Array.isArray(sections)) {
      for (const s of sections) {
        const data = {
          ordre: s.ordre ?? 0,
          actif: s.actif ?? true,
          titre: s.titre ?? null,
          sousTitre: s.sousTitre ?? null,
          bodyHtml: s.bodyHtml ?? null,
          imageUrl: s.imageUrl ?? null,
          boutonTexte: s.boutonTexte ?? null,
          boutonUrl: s.boutonUrl ?? null,
          contenuJson: s.contenuJson ?? null,
        }
        if (s.id) {
          await prisma.pageSection.update({
            where: { id: s.id },
            data,
          })
        } else {
          await prisma.pageSection.create({
            data: {
              pageId: page.id,
              key: s.key,
              ...data,
            },
          })
        }
      }
    }

    const updated = await getPageBySlugWithSections(slug)
    return NextResponse.json(updated)
  } catch (error) {
    console.error('[admin/pages/[slug]] PATCH', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
