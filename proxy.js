import { NextResponse } from 'next/server';

const PATH = process.env.DASHBOARD_PATH;

// `/dashboard` is the real route but must never be reachable -- it would leak the secret path.
export function proxy(request) {
  const { pathname } = request.nextUrl;
  if (pathname === '/dashboard' || pathname.startsWith('/dashboard/')) {
    return new NextResponse('Not Found', { status: 404 });
  }

  // Unset DASHBOARD_PATH => nothing is rewritten => dashboard fails closed.
  if (!PATH) return NextResponse.next();

  if (pathname === `/${PATH}`) {
    return NextResponse.rewrite(new URL('/dashboard', request.url));
  }
  if (pathname.startsWith(`/${PATH}/`)) {
    return NextResponse.rewrite(new URL(`/dashboard${pathname.slice(PATH.length + 1)}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
