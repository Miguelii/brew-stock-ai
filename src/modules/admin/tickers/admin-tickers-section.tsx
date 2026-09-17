import { DatabaseIcon } from 'lucide-react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Card, CardContent } from '@/components/ui/card'
import { AdminStatCard } from '@/modules/admin/shared/admin-stat-card'
import { fetchAdminStockData } from '@/modules/admin/shared/get-admin-data'
import { RefreshTickerButton } from '@/modules/admin/tickers/refresh-ticker-button'
import { parseReportDate } from '@/lib/formatters'

export async function AdminTickersSection() {
    const tickers = await fetchAdminStockData()

    return (
        <section className="space-y-4">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Tickers
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <AdminStatCard label="Tickers" value={tickers.length} icon={DatabaseIcon} />
            </div>

            <Card className="pt-0">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="pl-5">Ticker</TableHead>
                                <TableHead>Last update</TableHead>
                                <TableHead className="pr-5 text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tickers.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={3}
                                        className="h-24 text-center text-muted-foreground"
                                    >
                                        No tickers stored.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                tickers.map((t) => (
                                    <TableRow key={t.ticker}>
                                        <TableCell className="pl-5 py-3 font-semibold uppercase tracking-wide">
                                            {t.ticker}
                                        </TableCell>
                                        <TableCell className="py-3 text-sm text-muted-foreground">
                                            {t.lastUpdateAt
                                                ? parseReportDate(t.lastUpdateAt)
                                                : 'Never'}
                                        </TableCell>
                                        <TableCell className="pr-5 py-3 text-right">
                                            <RefreshTickerButton ticker={t.ticker} />
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </section>
    )
}
