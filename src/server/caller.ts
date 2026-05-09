import 'server-only'

import { appRouter } from '@/server/appRouter'
import { createContext } from '@/server/context'

export const createCaller = async () => {
    const ctx = await createContext({} as any)
    return appRouter.createCaller(ctx)
}
