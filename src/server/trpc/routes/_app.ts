import { router } from "../init"
import { projectRouter } from "./projects"
import { taskRouter } from "./tasks"

export const appRouter = router({
    projects: projectRouter,
    tasks: taskRouter,
})

export type AppRouter = typeof appRouter