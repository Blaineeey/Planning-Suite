import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Public routes that don't require authentication
  const publicRoutes = ['/', '/login', '/register', '/forgot-password', '/sign'];
  
  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith('/sign/')
  );
  
  // For now, we'll handle auth checks on the client side since we're using localStorage
  // In a production app, you'd want to use cookies and check authentication here
  
  // Allow all requests to pass through
  // The actual auth protection happens in the components using useEffect hooks
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all routes except static files and api routes
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ]
};
