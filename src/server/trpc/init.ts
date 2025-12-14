import { initTRPC } from "@trpc/server"

export type Context = {
    userId: string
}

const t = initTRPC.context<Context>().create()

export const router = t.router
export const procedure = t.procedure
export const middleware = t.middleware
