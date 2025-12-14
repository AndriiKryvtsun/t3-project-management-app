"use client"

import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Trash2, ArrowRight, CheckCircle2, Folder } from "lucide-react"

interface Project {
    id: string
    name: string
    description: string
    color: string
    createdAt: string
    tasks?: any[]
}

interface ProjectGridProps {
    projects: Project[]
    onDelete: (id: string) => void
}

export function ProjectGrid({ projects, onDelete }: ProjectGridProps) {
    const router = useRouter()

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
                <Card
                    key={project.id}
                    className="group relative bg-card hover:border-primary/50 transition-all cursor-pointer overflow-hidden"
                    onClick={() => router.push(`/dashboard/project/${project.id}`)}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="relative p-6 flex flex-col h-full">
                        <div className="flex items-start justify-between mb-4">
                            <div className={`w-12 h-12 rounded-lg ${project.color} opacity-20 flex items-center justify-center`}>
                                <Folder className="w-6 h-6 text-foreground" />
                            </div>
                        </div>

                        <div className="flex-1">
                            <h3 className="text-xl font-semibold text-foreground mb-2 line-clamp-2">{project.name}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                        </div>

                        <div className="mt-6 flex items-center justify-between pt-4 border-t border-border/30">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">{project.tasks?.length || 0} tasks</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        if (confirm("Delete this project? This action cannot be undone.")) {
                                            onDelete(project.id)
                                        }
                                    }}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    )
}