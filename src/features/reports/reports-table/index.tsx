'use client'

import { trpc } from '@/server/trpc-client'
import { TableCard } from './table-card'

export function ReportsTable() {
    const query = trpc.getReports.useQuery(undefined, {
        staleTime: 1000 * 60 * 1, // 1m
        gcTime: 1000 * 60 * 1, // 1m
        refetchInterval: 1000 * 20, // 20s
    })

    const reports = query.data

    return <TableCard reports={reports ?? []} isLoading={query.isLoading} />
}
