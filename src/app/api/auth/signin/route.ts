import { prisma } from "@/server/db/client"
import bcrypt from "bcryptjs"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json()

        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
        }

        const user = await prisma.user.findUnique({ where: { email } })
        if (!user) {
            return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
        }

        const response = NextResponse.json({
            user: { id: user.id, email: user.email },
        })

        response.cookies.set("session", JSON.stringify({ userId: user.id }), {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7,
        })

        return response
    } catch (error) {
        console.error("Signin error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}