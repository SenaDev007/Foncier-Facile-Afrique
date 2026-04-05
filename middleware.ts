import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

export default auth((req) => {
  const { pathname } = req.nextUrl
  const origin = req.nextUrl.origin

  // Ne pas appliquer le middleware aux routes API et aux assets statiques
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/images/') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Protéger toutes les routes admin sauf login
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!req.auth) {
      const loginUrl = new URL('/admin/login', origin)
      loginUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Vérifier le rôle pour certaines routes sensibles
    if (pathname.startsWith('/admin/utilisateurs') || pathname.startsWith('/admin/parametres')) {
      const userRole = req.auth?.user?.role
      if (userRole !== 'SUPER_ADMIN' && userRole !== 'ADMIN') {
        return NextResponse.redirect(new URL('/admin', origin))
      }
    }

    // Annonces : réservé à la direction et aux agents (pas aux éditeurs de contenu blog / pages)
    if (pathname.startsWith('/admin/annonces')) {
      const userRole = req.auth?.user?.role
      if (userRole === 'EDITEUR') {
        return NextResponse.redirect(new URL('/admin', origin))
      }
    }

    // Séjour, réservations, dossiers fonciers : pas pour les éditeurs (pôle contenu uniquement)
    if (
      pathname.startsWith('/admin/logements') ||
      pathname.startsWith('/admin/reservations') ||
      pathname.startsWith('/admin/dossiers')
    ) {
      const userRole = req.auth?.user?.role
      if (userRole === 'EDITEUR') {
        return NextResponse.redirect(new URL('/admin', origin))
      }
    }
  }

  // Rediriger si déjà connecté vers login
  if (pathname === '/admin/login' && req.auth) {
    return NextResponse.redirect(new URL('/admin', origin))
  }

  const res = NextResponse.next()
  if (pathname.startsWith('/admin')) {
    res.headers.set('x-pathname', pathname)
  }
  return res
})

export const config = {
  matcher: ['/admin/:path*'],
}
