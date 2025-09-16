import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Refresh session if expired
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Protect admin routes
  if (req.nextUrl.pathname.startsWith('/admin') && !session) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Protect super admin routes
  if (req.nextUrl.pathname.startsWith('/super-admin')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // Check if user is super admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (profile?.role !== 'super_admin') {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }
  }

  // Protect teacher routes
  if (req.nextUrl.pathname.startsWith('/teacher') && !session) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Protect parent routes
  if (req.nextUrl.pathname.startsWith('/parent') && !session) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return res;
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/super-admin/:path*',
    '/teacher/:path*',
    '/parent/:path*',
    '/api/:path*',
  ],
};