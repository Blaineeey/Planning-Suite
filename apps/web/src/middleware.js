import { NextResponse } from 'next/server';

export function middleware(request) {
  // For now, we'll handle auth checks on the client side since we're using localStorage
  // The middleware can't access localStorage directly
  
  // Just pass through all requests
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register']
};
