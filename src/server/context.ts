import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'

/**
 * Creates context for an incoming request
 * @see https://trpc.io/docs/v11/context
 */
export const createContext = async (opts: FetchCreateContextFnOptions) => {
    console.log('createContext for', 'unknown user', opts)

    return {
        session: {
            user: 1,
        },
    }
}

// oxlint-disable-next-line no-unused-vars
type Context = Awaited<ReturnType<typeof createContext>>
