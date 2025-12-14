"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { Input } from "@/components/ui/Input"
import { Card } from "@/components/ui/Card"
import { Lock, Mail, AlertCircle, Loader2 } from "lucide-react"

export function AuthContainer() {
    const router = useRouter()
    const [isSignUp, setIsSignUp] = useState(false)
    const [email, setEmail] = useState("")
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            if (!email || !password) {
                setError("Please fill in all fields")
                setLoading(false)
                return
            }

            if (password.length < 6) {
                setError("Password must be at least 6 characters")
                setLoading(false)
                return
            }

            if (isSignUp) {
                const registerResponse = await fetch("/api/auth/register", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, name, password }),
                })

                if (!registerResponse.ok) {
                    const data = await registerResponse.json()
                    setError(data.error || "Sign up failed")
                    setLoading(false)
                    return
                }

                const result = await signIn("credentials", {
                    email,
                    password,
                    redirect: false,
                })

                if (result?.error) {
                    setError(result.error)
                    setLoading(false)
                    return
                }

                router.push("/dashboard")
            } else {
                const result = await signIn("credentials", {
                    email,
                    password,
                    redirect: false,
                })

                if (result?.error) {
                    setError("Invalid email or password")
                    setLoading(false)
                    return
                }

                router.push("/dashboard")
            }
        } catch (err) {
            setError("An error occurred. Please try again.")
            setLoading(false)
        }
    }

    return (
        <Card className="w-full max-w-md bg-card border-border/50 backdrop-blur-sm p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2 text-balance">ProjectHub</h1>
                <p className="text-muted-foreground text-sm">
                    {isSignUp ? "Create an account to get started" : "Sign in to your account"}
                </p>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
                {isSignUp && (
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Name</label>
                        <Input
                            type="text"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="bg-background border-border/50 text-foreground placeholder:text-muted-foreground/50"
                            disabled={loading}
                        />
                    </div>
                )}

                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Email</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-10 bg-background border-border/50 text-foreground placeholder:text-muted-foreground/50"
                            disabled={loading}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-10 bg-background border-border/50 text-foreground placeholder:text-muted-foreground/50"
                            disabled={loading}
                        />
                    </div>
                </div>

                {error && (
                    <div className="p-3 rounded bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>{error}</span>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary hover:bg-primary/90 text-foreground font-medium py-2"
                >
                    {loading ? (
                        <div className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Loading...</span>
                        </div>
                    ) : isSignUp ? (
                        "Sign Up"
                    ) : (
                        "Sign In"
                    )}
                </button>
            </form>

            <div className="mt-6 pt-6 border-t border-border/50 text-center">
                <p className="text-sm text-muted-foreground">
                    {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                    <button
                        onClick={() => {
                            setIsSignUp(!isSignUp)
                            setError("")
                            setEmail("")
                            setPassword("")
                            setName("")
                        }}
                        className="text-primary hover:underline font-medium"
                    >
                        {isSignUp ? "Sign In" : "Sign Up"}
                    </button>
                </p>
            </div>
        </Card>
    )
}