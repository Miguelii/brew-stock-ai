import 'server-only'

import Link from 'next/link'
import { FileTextIcon, CheckCircle2Icon, XCircleIcon, Loader2Icon } from 'lucide-react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AdminStatCard } from '@/modules/admin/admin-stat-card'
import { fetchAdminStats, fetchAdminUsers, fetchAdminReports } from '@/modules/admin/admin-queries'
import { parseReportDate } from '@/lib/formatters'
import { PROMPT_OPTIONS } from '@/lib/constants'
import { ReportStatus } from '@/types/ReportDTO'

type Props = {
    email: string
}

function StatusBadge({ status }: { status: ReportStatus }) {
    if (status === ReportStatus.COMPLETED) {
        return (
            <Badge className="border border-accent-green/25 bg-accent-green-light text-accent-green font-semibold hover:bg-accent-green/10">
                Completed
            </Badge>
        )
    }
    if (status === ReportStatus.GENERATING) {
        return (
            <Badge className="gap-1.5 border border-accent-blue/25 bg-accent-blue-light text-accent-blue font-semibold hover:bg-accent-blue/10">
                <Loader2Icon className="size-3 animate-spin" />
                Generating
            </Badge>
        )
    }
    return (
        <Badge className="border border-destructive/25 bg-destructive/10 text-destructive font-semibold hover:bg-destructive/10">
            Failed
        </Badge>
    )
}

export async function AdminReportsSection({ email }: Props) {
    const [stats, reports, users] = await Promise.all([
        fetchAdminStats(email),
        fetchAdminReports(email),
        fetchAdminUsers(email),
    ])

    const userEmailById = new Map(users.map((u) => [u.id, u.email]))

    return (
        <section className="space-y-4">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Reports
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <AdminStatCard
                    label="Total Reports"
                    value={stats.totalReports}
                    icon={FileTextIcon}
                />
                <AdminStatCard
                    label="Completed"
                    value={stats.completedReports}
                    icon={CheckCircle2Icon}
                />
                <AdminStatCard
                    label="Failed"
                    value={stats.failedReports}
                    icon={XCircleIcon}
                    accent
                />
            </div>

            <Card className="pt-0">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="pl-5">Stock</TableHead>
                                <TableHead>Analysis Type</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>User</TableHead>
                                <TableHead>Cost</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="pr-5 text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {reports.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        className="h-24 text-center text-muted-foreground"
                                    >
                                        No reports found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                reports.map((r) => (
                                    <TableRow key={r.id}>
                                        <TableCell className="pl-5 py-3 font-semibold uppercase tracking-wide">
                                            {r.stock} |{r.ticker}|
                                        </TableCell>
                                        <TableCell className="py-3 text-sm">
                                            {PROMPT_OPTIONS.find((o) => o.type === r.type)?.label ??
                                                r.type}
                                        </TableCell>
                                        <TableCell className="py-3">
                                            <StatusBadge status={r.status} />
                                        </TableCell>
                                        <TableCell className="py-3 text-sm text-muted-foreground">
                                            {userEmailById.get(r.user_id) ?? r.user_id}
                                        </TableCell>
                                        <TableCell className="py-3 text-sm text-muted-foreground">
                                            {r.cost
                                                ? `${Number(parseFloat(r.cost).toFixed(4))}$`
                                                : 'N/A'}
                                        </TableCell>
                                        <TableCell className="py-3 text-sm text-muted-foreground">
                                            {parseReportDate(r.created_at)}
                                        </TableCell>
                                        <TableCell className="pr-5 py-3 text-right">
                                            {r.status === ReportStatus.COMPLETED && (
                                                <Link href={`/reports/${r.id}`} prefetch={false}>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="rounded-none cursor-pointer"
                                                    >
                                                        View
                                                    </Button>
                                                </Link>
                                            )}
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
