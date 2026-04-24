import { Separator } from '@/components/ui/separator'
import { ReportsTable } from '@/features/reports/reports-table'
import { ReportsRefetch } from '@/features/reports/reports-refetch'

export default function Report() {
    return (
        <main className="max-w-7xl mx-auto px-6 py-10 space-y-6" id="#main">
            <div className="flex flex-row w-full justify-between items-center">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        Analysis Reports
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        View and manage comprehensive intelligence reports across your tracked
                        assets.
                    </p>
                </div>

                <ReportsRefetch />
            </div>

            <Separator />

            <ReportsTable />
        </main>
    )
}
