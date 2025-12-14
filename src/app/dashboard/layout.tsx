import type React from "react"
import type { Metadata } from "next"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { DashboardNav } from "@/components/DashboardNav"

export const metadata: Metadata = {
    title: "Dashboard - Project Manager",
}

export default function DashboardLayout({
                                            children,
                                        }: {
    children: React.ReactNode
}) {
    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-background">
                <DashboardNav />
                <main className="pt-20">{children}</main>
            </div>
        </ProtectedRoute>
    )
}