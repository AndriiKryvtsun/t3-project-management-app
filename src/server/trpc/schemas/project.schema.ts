import { z } from "zod";
import { TaskSchema } from "./task.schema";

export const ProjectSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    color: z.string(),
    createdAt: z.string(),
    tasks: z.array(TaskSchema),
});

export type Project = z.infer<typeof ProjectSchema>;