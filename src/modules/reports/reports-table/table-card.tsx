'use client'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import type { ReportListItem } from '@/types/ReportDTO'
import { ReportStatus } from '@/types/ReportDTO'
import { Skeleton } from '@/components/ui/skeleton'
import { PROMPT_OPTIONS } from '@/_bff/modules/analysis/constants'
import { parseReportDate } from '@/lib/formatters'

type Props = {
    reports: ReportListItem[]
    isLoading: boolean
}

export function TableCard({ reports, isLoading }: Props) {
    const isEmpty = !isLoading && reports?.length === 0

    const renderContent = () => {
        if (isLoading) return <ReportsLoading />
        if (isEmpty) return <NoReportsState />
        return <ReportsList reports={reports} />
    }

    return (
        <>
            {/* Desktop: table */}
            <Card className="pt-0 hidden md:block">
                <CardContent className="p-0">
                    <Table>
                        <ReportsTableHeader />
                        <TableBody>{renderContent()}</TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Mobile: stacked cards */}
            <div className="flex flex-col gap-3 md:hidden">
                {isLoading && (
                    <>
                        {Array.from({ length: 4 }).map((_, i) => (
                            <Skeleton key={`mobile-loading-${i}`} className="h-28 w-full" />
                        ))}
                    </>
                )}
                {isEmpty && (
                    <Card className="pt-0">
                        <CardContent className="flex h-32 items-center justify-center text-sm text-ink/60">
                            No reports found.
                        </CardContent>
                    </Card>
                )}
                {!isLoading &&
                    !isEmpty &&
                    reports.map((report) => (
                        <Card key={report.id} className="pt-0">
                            <CardContent className="p-4 flex flex-col gap-3">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex flex-col gap-0.5">
                                        <span className="display text-xl">{report.stock}</span>
                                        <span className="text-xs text-ink/60">
                                            {
                                                PROMPT_OPTIONS.find((o) => o.type === report.type)
                                                    ?.label
                                            }
                                        </span>
                                    </div>
                                    <StatusBadge status={report.status} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-ink/60">
                                        {parseReportDate(report.created_at)}
                                    </span>
                                    <ActionCell status={report.status} report={report} />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
            </div>
        </>
    )
}

function ReportsLoading() {
    return (
        <>
            {Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={`reports-loading-${i}`}>
                    <TableCell colSpan={5} className="h-12 w-full text-center text-ink/60">
                        <Skeleton className="w-full h-12" />
                    </TableCell>
                </TableRow>
            ))}
        </>
    )
}

function ReportsList({ reports }: Pick<Props, 'reports'>) {
    return (
        // oxlint-disable-next-line react/jsx-no-useless-fragment - necessary because of the map
        <>
            {reports?.map((report) => (
                <TableRow key={report.id}>
                    <TableCell className="pl-5 py-4 max-w-37.5">
                        <span className="display text-xl">{report.stock}</span>
                    </TableCell>
                    <TableCell className="py-4">
                        {PROMPT_OPTIONS.find((o) => o.type === report.type)?.label}
                    </TableCell>
                    <TableCell className="py-4 text-sm">
                        {parseReportDate(report.created_at)}
                    </TableCell>
                    <TableCell className="py-4">
                        <StatusBadge status={report.status} />
                    </TableCell>
                    <TableCell className="pr-5 py-4 text-right">
                        <ActionCell status={report.status} report={report} />
                    </TableCell>
                </TableRow>
            ))}
        </>
    )
}

function NoReportsState() {
    return (
        <TableRow>
            <TableCell colSpan={5} className="h-32 text-center text-ink/60">
                No reports found.
            </TableCell>
        </TableRow>
    )
}

function ReportsTableHeader() {
    return (
        <TableHeader>
            <TableRow>
                <TableHead className="pl-5">Stock</TableHead>
                <TableHead>Analysis Type</TableHead>
                <TableHead>Date Requested</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="pr-5 text-right">Action</TableHead>
            </TableRow>
        </TableHeader>
    )
}

function StatusBadge({ status }: { status: ReportStatus }) {
    if (status === ReportStatus.COMPLETED) {
        return (
            <Badge
                data-tone="green"
                className="w-32.5 rounded-[min(var(--radius-md),12px)] border-ink/5 bg-tone-soft py-2.5 font-bold text-tone-deep hover:bg-tone-soft md:w-30"
            >
                Completed
            </Badge>
        )
    }
    if (status === ReportStatus.GENERATING) {
        return (
            <Badge
                data-tone="blue"
                className="w-32.5 gap-1.5 rounded-[min(var(--radius-md),12px)] border-ink/5 bg-tone-soft py-2.5 font-bold text-tone-deep hover:bg-tone-soft md:w-30"
            >
                <Loader2 className="size-3 animate-spin" />
                Generating...
            </Badge>
        )
    }
    return (
        <Badge className="w-32.5 rounded-[min(var(--radius-md),12px)] border-ink/5 bg-destructive/10 py-2.5 font-bold text-destructive hover:bg-destructive/10 md:w-30">
            Failed
        </Badge>
    )
}

function ActionCell({ status, report }: { status: ReportStatus; report: ReportListItem }) {
    if (status === ReportStatus.COMPLETED) {
        return (
            <Link className="contents" href={`/reports/${report.id}`} prefetch={false}>
                <Button variant="ink" size="sm" className="h-9 w-32.5 px-4 md:w-fit">
                    View Report
                </Button>
            </Link>
        )
    }
}
