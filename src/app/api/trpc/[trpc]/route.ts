/**
 * This file contains the tRPC http response handler and context creation for Next.js
 */
import { appRouter } from '@/server/appRouter'
import { createContext } from '@/server/context'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'

const handler = (req: Request) =>
    fetchRequestHandler({
        router: appRouter,
        req,
        endpoint: '/api/trpc',
        createContext,
    })

export const GET = handler
export const POST = handler
