import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const role = request.cookies.get('role')?.value;
    const pathname = request.nextUrl.pathname;

    // Check if user is trying to access a protected route
    if (pathname.startsWith('/dashboard')) {
        if (!token || !role) {
            // Redirect to login if no token or role
            return NextResponse.redirect(new URL('/login', request.url));
        }

        // Check role-based access
        if (pathname.startsWith('/dashboard/manager') && role !== 'Manager') {
            return NextResponse.redirect(new URL('/', request.url));
        }
        if (pathname.startsWith('/dashboard/trainer') && role !== 'PersonalTrainer') {
            return NextResponse.redirect(new URL('/', request.url));
        }
        if (pathname.startsWith('/dashboard/client') && role !== 'Client') {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*'],
};