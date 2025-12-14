"use client"

import {Card} from "@/components/ui/Card"
import {CheckCircle2, Circle, Clock} from "lucide-react"
import { TaskPriority, TaskStatus} from "../types";
import { Task } from "@/server/trpc/schemas/task.schema";

interface TaskStatsProps {
    tasks: Task[]
}

export function TaskStats({ tasks }: TaskStatsProps) {
    const stats = {
        total: tasks.length,
        completed: tasks.filter((t) => t.status === TaskStatus.Done).length,
        inProgress: tasks.filter((t) => t.status === TaskStatus.InProgress).length,
        todo: tasks.filter((t) => t.status === TaskStatus.Todo).length,
        highPriority: tasks.filter((t) => t.priority === TaskPriority.High).length,
    }

    const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0

    return (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <Card className="bg-card border-border p-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <Circle className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Total Tasks</p>
                        <p className="text-2xl font-bold">{stats.total}</p>
                    </div>
                </div>
            </Card>

            <Card className="bg-card border-border p-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-secondary/10 rounded-lg">
                        <CheckCircle2 className="w-4 h-4 text-secondary" />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Completed</p>
                        <p className="text-2xl font-bold">{stats.completed}</p>
                    </div>
                </div>
            </Card>

            <Card className="bg-card border-border p-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-500/10 rounded-lg">
                        <Clock className="w-4 h-4 text-orange-400" />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">In Progress</p>
                        <p className="text-2xl font-bold">{stats.inProgress}</p>
                    </div>
                </div>
            </Card>

            <Card className="bg-card border-border p-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                        <Circle className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">To Do</p>
                        <p className="text-2xl font-bold">{stats.todo}</p>
                    </div>
                </div>
            </Card>

            <Card className="bg-card border-border p-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-destructive/10 rounded-lg">
                        <span className="text-sm font-bold text-destructive">{completionRate}%</span>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Progress</p>
                        <div className="w-12 h-2 bg-border rounded-full mt-1 overflow-hidden">
                            <div className="h-full bg-primary transition-all duration-300" style={{ width: `${completionRate}%` }} />
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    )
}