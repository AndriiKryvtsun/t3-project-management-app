import { authOptions } from "@/server/auth"
import { getServerSession } from "next-auth/next"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

export async function proxy(request: NextRequest) {
    const url = request.nextUrl.clone()
    const session = await getServerSession(authOptions)

    const protectedRoutes = ["/dashboard", "/dashboard/project"]
    const isProtectedRoute = protectedRoutes.some((route) =>
        request.nextUrl.pathname.startsWith(route)
    )

    if (isProtectedRoute && !session) {
        url.pathname = "/"
        return NextResponse.redirect(url)
    }

    if (request.nextUrl.pathname === "/" && session) {
        url.pathname = "/dashboard"
        return NextResponse.redirect(url)
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/", "/dashboard", "/dashboard/:path*"],
}
