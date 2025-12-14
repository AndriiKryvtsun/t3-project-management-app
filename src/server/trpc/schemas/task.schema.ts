import { z } from "zod";
import {TaskStatus, TaskPriority} from "@/types";

export const TaskSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    status: z.nativeEnum(TaskStatus),
    priority: z.nativeEnum(TaskPriority),
    createdAt: z.string(),
});

export type Task = z.infer<typeof TaskSchema>;