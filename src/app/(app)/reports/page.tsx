import type { Metadata } from 'next'
import { Separator } from '@/components/ui/separator'
import { ReportsTable } from '@/modules/reports/reports-table'
import { ReportsRefetch } from '@/modules/reports/reports-refetch'

export const metadata: Metadata = {
    title: 'My Reports',
}

export default function Report() {
    return (
        <main className="max-w-7xl mx-auto px-6 py-10 space-y-6" id="#main">
            <div className="flex flex-col gap-6 md:gap-0 md:flex-row w-full justify-between items-start md:items-center">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        Analysis Reports
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Track the status of your requested reports.
                    </p>
                </div>

                <ReportsRefetch />
            </div>

            <Separator />

            <ReportsTable />
        </main>
    )
}
