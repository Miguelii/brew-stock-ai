/**
 * Creates context for an incoming request. Procedures resolve the session through
 * `next/headers` (see the auth middleware), so nothing is read from the transport and
 * server-side callers can build the same context without a request.
 * @see https://trpc.io/docs/v11/context
 */
export const createContext = async () => ({})

export type Context = Awaited<ReturnType<typeof createContext>>
