'use client'

import { TableCard } from '@/modules/reports/reports-table/table-card'
import { useGetReports } from '@/hooks/use-get-reports'

export function ReportsTable() {
    const { reports, isLoading } = useGetReports()

    return <TableCard reports={reports} isLoading={isLoading} />
}
