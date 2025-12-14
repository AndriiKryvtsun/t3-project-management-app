import { prisma } from "@/server/db/client"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const cookieStore = await cookies()
        const sessionCookie = cookieStore.get("session")

        if (!sessionCookie) {
            return NextResponse.json({ user: null })
        }

        const session = JSON.parse(sessionCookie.value)
        const user = await prisma.user.findUnique({
            where: { id: session.userId },
            select: { id: true, email: true },
        })

        return NextResponse.json({ user })
    } catch (error) {
        console.error("Session error:", error)
        return NextResponse.json({ user: null })
    }
}