"use client"

import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Trash2, ChevronRight, ChevronLeft } from "lucide-react"
import {TaskPriority, TaskStatus} from "../types";
import type {Task} from "@/server/trpc/schemas/task.schema";

interface TaskListProps {
    title: string
    tasks: Task[]
    status: TaskStatus
    onUpdateTask: (taskId: string, updates: Partial<Task>) => void
    onDeleteTask: (taskId: string) => void
}

const priorityColors = {
    [TaskPriority.Low]: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    [TaskPriority.Medium]: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    [TaskPriority.High]: "bg-destructive/10 text-destructive border-destructive/20",
}

const statusSteps = [TaskStatus.Todo, TaskStatus.InProgress, TaskStatus.Done]

export function TaskList({ title, tasks, status, onUpdateTask, onDeleteTask }: TaskListProps) {
    const currentIndex = statusSteps.indexOf(status)

    const moveTask = (taskId: string, direction: "forward" | "backward") => {
        if (direction === "forward" && currentIndex < statusSteps.length - 1) {
            onUpdateTask(taskId, { status: statusSteps[currentIndex + 1] })
        } else if (direction === "backward" && currentIndex > 0) {
            onUpdateTask(taskId, { status: statusSteps[currentIndex - 1] })
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">{title}</h2>
                <Badge variant="outline" className="border-border text-muted-foreground">
                    {tasks.length}
                </Badge>
            </div>

            <div className="space-y-3 min-h-96 rounded-lg border border-border p-4 bg-card/50">
                {tasks.length === 0 ? (
                    <div className="flex items-center justify-center h-80 text-muted-foreground text-sm">No tasks yet</div>
                ) : (
                    tasks.map((task) => (
                        <Card key={task.id} className="bg-card border-border hover:border-primary/50 transition-colors p-4 group">
                            <div className="flex items-start justify-between gap-3 mb-3">
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-medium text-foreground text-sm line-clamp-2">{task.title}</h3>
                                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{task.description}</p>
                                </div>
                                <div className="flex-shrink-0">
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => {
                                            if (confirm("Delete this task?")) {
                                                onDeleteTask(task.id)
                                            }
                                        }}
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </Button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <Badge className={priorityColors[task.priority]} variant="outline">
                                    {task.priority}
                                </Badge>

                                <div className="flex items-center gap-1">
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-7 w-7"
                                        disabled={currentIndex === 0}
                                        onClick={() => moveTask(task.id, "backward")}
                                    >
                                        <ChevronLeft className="w-3 h-3" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-7 w-7"
                                        disabled={currentIndex === statusSteps.length - 1}
                                        onClick={() => moveTask(task.id, "forward")}
                                    >
                                        <ChevronRight className="w-3 h-3" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
