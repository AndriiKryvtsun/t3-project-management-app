"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { ProjectGrid } from "@/components/ProjectGrid"
import { CreateProjectModal } from "@/components/CreateProjectModal"
import { Button } from "@/components/ui/Button"
import { Plus } from "lucide-react"
import { trpc } from "@/lib/TrpcProvider"

export default function DashboardPage() {
    const { data: session } = useSession()
    const [showModal, setShowModal] = useState(false)

    const { data: projects = [], isLoading } = trpc.projects.list.useQuery()
    const createProject = trpc.projects.create.useMutation({
        onSuccess: () => {
            utils.projects.list.invalidate()
            setShowModal(false)
        },
    })
    const deleteProject = trpc.projects.delete.useMutation({
        onSuccess: () => {
            utils.projects.list.invalidate()
        },
    })
    const utils = trpc.useUtils()

    const handleCreateProject = (name: string, description: string) => {
        createProject.mutate({ name, description })
    }

    const handleDeleteProject = (id: string) => {
        deleteProject.mutate({ id })
    }

    if (isLoading) {
        return (
            <div className="container py-12 flex items-center justify-center min-h-[60vh]">
                <div className="animate-pulse text-muted-foreground">Loading projects...</div>
            </div>
        )
    }

    return (
        <div className="container py-12">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-4xl font-bold text-balance">Welcome back, {session?.user?.email?.split("@")[0]}!</h1>
                    <p className="text-muted-foreground mt-2">Manage and organize your projects efficiently</p>
                </div>
                <Button onClick={() => setShowModal(true)} className="bg-primary hover:bg-primary-dark gap-2 whitespace-nowrap">
                    <Plus className="w-5 h-5" />
                    New Project
                </Button>
            </div>

            {showModal && <CreateProjectModal onClose={() => setShowModal(false)} onCreate={handleCreateProject} />}

            {projects.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 rounded-lg border border-border bg-card/50">
                    <div className="text-center">
                        <p className="text-lg text-muted-foreground mb-4">No projects yet</p>
                        <Button onClick={() => setShowModal(true)} variant="outline" className="gap-2">
                            <Plus className="w-4 h-4" />
                            Create your first project
                        </Button>
                    </div>
                </div>
            ) : (
                <ProjectGrid projects={projects} onDelete={handleDeleteProject} />
            )}
        </div>
    )
}
