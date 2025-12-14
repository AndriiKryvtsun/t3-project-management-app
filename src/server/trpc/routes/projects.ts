import { procedure, router } from "../init";
import { z } from "zod";
import { prisma } from "@/server/db/client";
import { ProjectSchema } from "../schemas/project.schema";
import { TaskStatus, TaskPriority } from "@/types";

export const projectRouter = router({
    list: procedure.output(z.array(ProjectSchema)).query(async ({ ctx }) => {
        const projects = await prisma.project.findMany({
            where: { userId: ctx.userId },
            include: { tasks: true },
        });

        return projects.map((project) => ({
            ...project,
            createdAt: project.createdAt.toISOString(),
            tasks: project.tasks.map((task) => ({
                ...task,
                status: task.status as TaskStatus,
                priority: task.priority as TaskPriority,
                createdAt: task.createdAt.toISOString(),
            })),
        }));
    }),

    create: procedure
        .input(
            z.object({
                name: z.string().min(1),
                description: z.string(),
            })
        )
        .mutation(async ({ input, ctx }) => {
            const project = await prisma.project.create({
                data: {
                    name: input.name,
                    description: input.description,
                    color: ["bg-blue-500", "bg-cyan-500", "bg-orange-500"][Math.floor(Math.random() * 3)],
                    userId: ctx.userId,
                },
            });

            return { ...project, createdAt: project.createdAt.toISOString(), tasks: [] };
        }),

    delete: procedure.input(z.object({ id: z.string() })).mutation(async ({ input, ctx }) => {
        await prisma.project.deleteMany({ where: { id: input.id, userId: ctx.userId } });
        return { success: true };
    }),

    update: procedure
        .input(
            z.object({
                id: z.string(),
                name: z.string().optional(),
                description: z.string().optional(),
            })
        )
        .mutation(async ({ input, ctx }) => {
            const { id, ...data } = input;
            return prisma.project.updateMany({ where: { id, userId: ctx.userId }, data });
        }),

    getById: procedure.input(z.object({ id: z.string() })).output(ProjectSchema.nullable()).query(async ({ input, ctx }) => {
        const project = await prisma.project.findFirst({
            where: { id: input.id, userId: ctx.userId },
            include: { tasks: true },
        });

        if (!project) return null;

        return {
            ...project,
            createdAt: project.createdAt.toISOString(),
            tasks: project.tasks.map((task) => ({
                ...task,
                status: task.status as TaskStatus,
                priority: task.priority as TaskPriority,
                createdAt: task.createdAt.toISOString(),
            })),
        };
    }),
});
