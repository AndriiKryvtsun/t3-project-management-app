import { prisma } from "@/server/db/client"
import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { email, password, name } = body

        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
        }

        if (password.length < 6) {
            return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
        })

        if (existingUser) {
            return NextResponse.json({ error: "User with this email already exists" }, { status: 409 })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const user = await prisma.user.create({
            data: {
                email,
                name: name || undefined,
                password: hashedPassword,
            },
        })

        return NextResponse.json(
            {
                message: "User created successfully",
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                },
            },
            { status: 201 },
        )
    } catch (error) {
        console.error("Registration error:", error)
        return NextResponse.json({ error: "An error occurred during registration" }, { status: 500 })
    }
}