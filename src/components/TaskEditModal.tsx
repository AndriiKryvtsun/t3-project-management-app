"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card } from "@/components/ui/Card"
import { X } from "lucide-react"

interface Task {
    id: string
    title: string
    description: string
    priority: "low" | "medium" | "high"
}

interface TaskEditModalProps {
    task: Task
    onClose: () => void
    onUpdate: (title: string, description: string, priority: string) => void
}

export function TaskEditModal({ task, onClose, onUpdate }: TaskEditModalProps) {
    const [title, setTitle] = useState<string>(task.title)
    const [description, setDescription] = useState<string>(task.description)
    const [priority, setPriority] = useState<string>(task.priority)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (title.trim()) {
            onUpdate(title, description, priority)
            onClose()
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md bg-card border-border p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Edit Task</h2>
                    <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-border">
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Task Title</label>
                        <Input
                            placeholder="Enter task title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="bg-background border-border"
                            autoFocus
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <Input
                            placeholder="Enter task description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="bg-background border-border"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Priority</label>
                        <select
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                            className="w-full bg-background border border-border rounded px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button type="button" variant="outline" className="flex-1 bg-transparent" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" className="flex-1 bg-primary hover:bg-primary-dark" disabled={!title.trim()}>
                            Update
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    )
}
