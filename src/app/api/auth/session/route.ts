import { prisma } from "@/server/db/client"
import { getServerSession } from "next-auth"
import { authOptions } from "@/server/auth"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json({ user: null }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { id: true, email: true },
        })

        return NextResponse.json({ user })
    } catch (error) {
        console.error("Session error:", error)
        return NextResponse.json({ user: null }, { status: 500 })
    }
}
