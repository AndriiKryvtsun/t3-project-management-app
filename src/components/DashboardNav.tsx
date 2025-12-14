"use client"

import { useRouter, usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import { Button } from "@/components/ui/Button"
import { LogOut, LayoutGrid } from "lucide-react"

export function DashboardNav() {
    const router = useRouter()
    const pathname = usePathname()
    const { data: session } = useSession()

    const handleLogout = async () => {
        await signOut({ callbackUrl: "/" })
    }

    return (
        <nav className="fixed top-0 left-0 right-0 bg-card/80 backdrop-blur-sm border-b border-border z-50">
            <div className="container flex items-center justify-between h-20">
                <div className="flex items-center gap-8">
                    <button
                        onClick={() => router.push("/dashboard")}
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                    >
                        <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            ProjectHub
                        </h1>
                    </button>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center text-sm text-muted-foreground">
                        <span>{session?.user?.email}</span>
                    </div>
                    <Button
                        variant="ghost"
                        onClick={() => router.push("/dashboard")}
                        className={`gap-2 ${pathname === "/dashboard" ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
                    >
                        <LayoutGrid className="w-4 h-4" />
                        <span className="hidden sm:inline">Projects</span>
                    </Button>
                    <Button
                        onClick={handleLogout}
                        variant="outline"
                        className="gap-2 border-border text-muted-foreground hover:text-foreground bg-transparent"
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="hidden sm:inline">Logout</span>
                    </Button>
                </div>
            </div>
        </nav>
    )
}