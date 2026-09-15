'use client'

import { useState, type PropsWithChildren } from 'react'
import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpBatchLink } from '@trpc/client'
import { trpcClient as trpc } from '@/_trpc/client'
import { toastError } from '@/lib/toast-error'

type Props = PropsWithChildren

export function TrpcContextProvider({ children }: Props) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                queryCache: new QueryCache({
                    // Fires once per failed query, however many components use it.
                    // Queries opt in to a toast through `meta.errorMessage`.
                    onError: (error, query) => {
                        const errorMessage = query.meta?.errorMessage
                        if (errorMessage) toastError(errorMessage, error)
                    },
                }),
            })
    )
    const [trpcClient] = useState(() =>
        trpc.createClient({
            links: [
                httpBatchLink({
                    url: '/api/trpc',
                }),
            ],
        })
    )

    return (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </trpc.Provider>
    )
}
