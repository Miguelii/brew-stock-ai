import 'server-only'

import { appRouter } from '@/_bff/trpc/router'
import { createContext } from '@/_bff/trpc/context'

export const createCaller = async () => {
    const ctx = await createContext({} as any)
    return appRouter.createCaller(ctx)
}
