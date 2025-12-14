"use client"

import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { TaskList } from "@/components/TaskList"
import { TaskStats } from "@/components/TaskStats"
import { CreateTaskModal } from "@/components/CreateTaskModal"
import { Button } from "@/components/ui/Button"
import { Plus, ArrowLeft } from "lucide-react"
import { trpc } from "@/lib/TrpcProvider"
import {TaskPriority, TaskStatus} from "@/types";
import type {Task} from "@/server/trpc/schemas/task.schema";

export default function ProjectPage() {
    const params = useParams()
    const router = useRouter()
    const projectId = params.id as string
    const [showModal, setShowModal] = useState(false)

    const { data: project, isLoading } = trpc.projects.getById.useQuery({ id: projectId })
    const { data: tasks = [] } = trpc.tasks.list.useQuery({ projectId })
    const utils = trpc.useUtils()

    const createTask = trpc.tasks.create.useMutation({
        onSuccess: () => {
            utils.tasks.list.invalidate({ projectId })
            setShowModal(false)
        },
    })

    const updateTask = trpc.tasks.update.useMutation({
        onSuccess: () => {
            utils.tasks.list.invalidate({ projectId })
        },
    })

    const deleteTask = trpc.tasks.delete.useMutation({
        onSuccess: () => {
            utils.tasks.list.invalidate({ projectId })
        },
    })

    const handleCreateTask = (title: string, description: string, priority: string) => {
        createTask.mutate({
            projectId,
            title,
            description,
            priority: priority as TaskPriority,
        })
    }

    const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
        updateTask.mutate({
            projectId,
            id: taskId,
            ...updates,
        })
    }

    const handleDeleteTask = (taskId: string) => {
        deleteTask.mutate({
            projectId,
            id: taskId,
        })
    }

    if (isLoading) {
        return (
            <div className="container py-12 flex items-center justify-center min-h-[60vh]">
                <div className="animate-pulse text-muted-foreground">Loading project...</div>
            </div>
        )
    }

    if (!project) {
        return (
            <div className="container py-12">
                <p className="text-muted-foreground">Project not found</p>
            </div>
        )
    }

    const todoTasks = tasks.filter((t) => t.status === TaskStatus.Todo)
    const inProgressTasks = tasks.filter((t) => t.status === TaskStatus.InProgress)
    const doneTasks = tasks.filter((t) => t.status === TaskStatus.Done)

    return (
        <div className="container py-12">
            <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")} className="hover:bg-border">
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div className="flex-1">
                    <h1 className="text-4xl font-bold">{project.name}</h1>
                    <p className="text-muted-foreground mt-1">{project.description}</p>
                </div>
            </div>

            <TaskStats tasks={tasks} />

            <div className="flex justify-end mb-8">
                <Button onClick={() => setShowModal(true)} className="bg-primary hover:bg-primary-dark gap-2">
                    <Plus className="w-5 h-5" />
                    New Task
                </Button>
            </div>

            {showModal && <CreateTaskModal onClose={() => setShowModal(false)} onCreate={handleCreateTask} />}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <TaskList
                    title="To Do"
                    tasks={todoTasks}
                    status={TaskStatus.Todo}
                    onUpdateTask={handleUpdateTask}
                    onDeleteTask={handleDeleteTask}
                />
                <TaskList
                    title="In Progress"
                    tasks={inProgressTasks}
                    status={TaskStatus.InProgress}
                    onUpdateTask={handleUpdateTask}
                    onDeleteTask={handleDeleteTask}
                />
                <TaskList
                    title="Done"
                    tasks={doneTasks}
                    status={TaskStatus.Done}
                    onUpdateTask={handleUpdateTask}
                    onDeleteTask={handleDeleteTask}
                />
            </div>
        </div>
    )
}