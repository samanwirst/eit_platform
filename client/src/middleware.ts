import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

export function middleware(request: NextRequest) {
    // const token = request.cookies.get("access")?.value;

    // if (!token) {
    //     return NextResponse.redirect(new URL("/login", request.url));
    // }

    // try {
    //     const payload: any = jwtDecode(token);
    //     if (payload.exp * 1000 < Date.now()) {
    //         return NextResponse.redirect(new URL("/login", request.url));
    //     }
    // } catch {
    //     return NextResponse.redirect(new URL("/login", request.url));
    // }

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