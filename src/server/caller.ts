import 'server-only'

import { appRouter } from './appRouter'
import { createContext } from './context'

export const createCaller = async () => {
    const ctx = await createContext({} as any)
    return appRouter.createCaller(ctx)
}
