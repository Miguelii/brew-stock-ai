'use client'

import { trpc } from '@/server/trpc-client'
import { TableCard } from './table-card'

export function ReportsTable() {
    const query = trpc.getReports.useQuery(undefined, {
        staleTime: 1000 * 60 * 3, // 3 minutos
        gcTime: 1000 * 60 * 3, // 3 minutos
    })

    const reports = query.data

    console.log({ reports })

    return (
        <>
            {/* <TableFilters /> */}

            <TableCard reports={reports ?? []} isLoading={query.isLoading} />

            {/* <TablePagination /> */}
        </>
    )
}
