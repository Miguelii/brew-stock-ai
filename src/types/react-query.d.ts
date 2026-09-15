import '@tanstack/react-query'

type QueryMeta = {
    /** When set, a failed query shows this message in a toast (handled once in the QueryCache). */
    errorMessage?: string
}

declare module '@tanstack/react-query' {
    interface Register {
        queryMeta: QueryMeta
    }
}
