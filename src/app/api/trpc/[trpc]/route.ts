import { fetchRequestHandler } from "@trpc/server/adapters/fetch"
import { appRouter } from "@/server/trpc/routes/_app"
import { getServerSession } from "next-auth"
import { authOptions } from "@/server/auth"

const handler = async (req: Request) => {
    const session = await getServerSession(authOptions)

    return fetchRequestHandler({
        endpoint: "/api/trpc",
        req,
        router: appRouter,
        createContext: () => ({
            userId: session?.user?.id || "",
        }),
    })
}

export { handler as GET, handler as POST }