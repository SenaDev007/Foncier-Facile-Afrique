import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

const ALLOWED_ROLES_FOR_LIST = ['SUPER_ADMIN', 'ADMIN'] as const
const ROLES_SUPER_ADMIN_CAN_ASSIGN = ['SUPER_ADMIN', 'ADMIN', 'AGENT', 'EDITEUR'] as const
const ROLES_ADMIN_CAN_ASSIGN = ['AGENT', 'EDITEUR'] as const

// GET - Récupérer tous les utilisateurs (réservé SUPER_ADMIN / ADMIN)
export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }
    if (!ALLOWED_ROLES_FOR_LIST.includes(session.user.role as typeof ALLOWED_ROLES_FOR_LIST[number])) {
      return NextResponse.json({ error: 'Droits insuffisants' }, { status: 403 })
    }

    const utilisateurs = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(utilisateurs)
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// POST - Créer un nouvel utilisateur (réservé SUPER_ADMIN / ADMIN, mot de passe fourni ou défaut)
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }
    const callerRole = session.user.role as string
    if (!ALLOWED_ROLES_FOR_LIST.includes(callerRole as typeof ALLOWED_ROLES_FOR_LIST[number])) {
      return NextResponse.json({ error: 'Droits insuffisants' }, { status: 403 })
    }

    const data = await request.json()
    const role = data.role ?? 'AGENT'
    const allowedRoles = callerRole === 'SUPER_ADMIN' ? ROLES_SUPER_ADMIN_CAN_ASSIGN : ROLES_ADMIN_CAN_ASSIGN
    if (!allowedRoles.includes(role)) {
      return NextResponse.json({ error: 'Rôle non autorisé pour ce compte' }, { status: 400 })
    }

    const rawPassword = typeof data.password === 'string' && data.password.trim() ? data.password.trim() : null
    const defaultPassword = 'User@2024!'
    const passwordToHash = rawPassword ?? defaultPassword
    const hashedPassword = await bcrypt.hash(passwordToHash, 12)

    const existing = await prisma.user.findUnique({ where: { email: data.email } })
    if (existing) {
      return NextResponse.json({ error: 'Un utilisateur avec cet email existe déjà' }, { status: 400 })
    }

    const utilisateur = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role,
        active: data.active !== false
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return NextResponse.json({
      utilisateur,
      message: rawPassword
        ? 'Utilisateur créé avec succès.'
        : `Utilisateur créé avec succès. Mot de passe par défaut: ${defaultPassword}`
    }, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
