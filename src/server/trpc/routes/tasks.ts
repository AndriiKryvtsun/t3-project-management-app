import { procedure, router } from "../init";
import { z } from "zod";
import { prisma } from "@/server/db/client";
import { TaskStatus, TaskPriority } from "@/types";
import { TaskSchema } from "../schemas/task.schema";

export const taskRouter = router({
    list: procedure
        .input(z.object({ projectId: z.string() }))
        .output(z.array(TaskSchema))
        .query(async ({ input, ctx }) => {
            const tasks = await prisma.task.findMany({
                where: { projectId: input.projectId, userId: ctx.userId },
                orderBy: { createdAt: "asc" },
            });

            return tasks.map((task) => ({
                ...task,
                status: task.status as TaskStatus,
                priority: task.priority as TaskPriority,
                createdAt: task.createdAt.toISOString(),
            }));
        }),

    create: procedure
        .input(
            z.object({
                projectId: z.string(),
                title: z.string().min(1),
                description: z.string(),
                priority: z.nativeEnum(TaskPriority),
            })
        )
        .mutation(async ({ input, ctx }) => {
            const { projectId, ...taskData } = input;

            const task = await prisma.task.create({
                data: {
                    ...taskData,
                    status: TaskStatus.Todo,
                    projectId,
                    userId: ctx.userId,
                },
            });

            return {
                ...task,
                status: task.status as TaskStatus,
                priority: task.priority as TaskPriority,
                createdAt: task.createdAt,
            };
        }),

    update: procedure
        .input(
            z.object({
                projectId: z.string(),
                id: z.string(),
                status: z.nativeEnum(TaskStatus).optional(),
                title: z.string().optional(),
                description: z.string().optional(),
                priority: z.nativeEnum(TaskPriority).optional(),
            })
        )
        .mutation(async ({ input, ctx }) => {
            const { projectId, id, ...data } = input;

            const updated = await prisma.task.updateMany({
                where: { id, projectId, userId: ctx.userId },
                data,
            });

            return updated;
        }),

    delete: procedure
        .input(z.object({ projectId: z.string(), id: z.string() }))
        .mutation(async ({ input, ctx }) => {
            await prisma.task.deleteMany({
                where: { id: input.id, projectId: input.projectId, userId: ctx.userId },
            });
            return { success: true };
        }),
});
