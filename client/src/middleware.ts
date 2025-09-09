import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

interface TokenPayload {
    exp: number;
    userId: string;
    role: 'admin' | 'user';
}

export function middleware(request: NextRequest) {
    const token = request.cookies.get("access")?.value;

    if (!token) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
        const payload = jwtDecode<TokenPayload>(token);
        if (payload.exp * 1000 < Date.now()) {
            return NextResponse.redirect(new URL("/login", request.url));
        }

        // Role-based access control
        const pathname = request.nextUrl.pathname;
        const role = payload.role;

        // Admin can access everything
        if (role === 'admin') {
            return NextResponse.next();
        }

        // Student (user) can only access dashboard, mock page, and mock session pages
        if (role === 'user') {
            const allowedPaths = ['/', '/mock', '/mock/session', '/mock/blur'];
            if (!allowedPaths.includes(pathname)) {
                return NextResponse.redirect(new URL("/", request.url));
            }
        }
    } catch {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all paths except for:
         * - public files (/favicon.ico, /logo.png, etc.)
         * - static Next.js files (_next)
         * - login and register pages
         * - API routes
         */
        "/((?!_next/static|_next/image|favicon.ico|logo.png|login|register|api).*)",
    ],
};