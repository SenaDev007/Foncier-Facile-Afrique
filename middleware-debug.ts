import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

export default auth((req) => {
  const { pathname } = req.nextUrl

  // Debug: Afficher les infos de la requête
  console.log('Middleware - Pathname:', pathname)
  console.log('Middleware - Auth:', req.auth ? 'Authenticated' : 'Not authenticated')

  // Protéger toutes les routes admin sauf login
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!req.auth) {
      console.log('Middleware - Redirecting to login')
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
    
    // Vérifier le rôle pour certaines routes sensibles
    if (pathname.startsWith('/admin/utilisateurs') || pathname.startsWith('/admin/parametres')) {
      const userRole = req.auth?.user?.role
      if (userRole !== 'SUPER_ADMIN' && userRole !== 'ADMIN') {
        console.log('Middleware - Insufficient role, redirecting to admin')
        return NextResponse.redirect(new URL('/admin', req.url))
      }
    }
  }

  // Rediriger si déjà connecté vers login
  if (pathname === '/admin/login' && req.auth) {
    console.log('Middleware - Already authenticated, redirecting to admin')
    return NextResponse.redirect(new URL('/admin', req.url))
  }

  console.log('Middleware - Allowing access')
  return NextResponse.next()
})

export const config = {
  matcher: ['/admin/:path*'],
}
