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
import { PROMPT_OPTIONS } from '@/lib/constants'
import { parseReportDate } from '@/lib/utils'

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
        <Card className="pt-0">
            <CardContent className="p-0">
                <Table>
                    <ReportsTableHeader />
                    <TableBody>{renderContent()}</TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

function ReportsLoading() {
    return (
        <>
            {Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={`reports-loading-${i}`}>
                    <TableCell
                        colSpan={5}
                        className="w-full h-12 text-center text-muted-foreground"
                    >
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
                        <span className="text-wrap">{report.stock}</span>
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
            <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
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
            <Badge className="py-3 border border-accent-green/25 bg-accent-green-light text-accent-green font-bold hover:bg-accent-green/10">
                Completed
            </Badge>
        )
    }
    if (status === ReportStatus.GENERATING) {
        return (
            <Badge className="py-3 gap-1.5 border border-accent-blue/25 bg-accent-blue-light text-accent-blue font-bold hover:bg-accent-blue/10">
                <Loader2 className="size-3 animate-spin" />
                AI is working...
            </Badge>
        )
    }
    return (
        <Badge className="py-3 border border-destructive/25 bg-destructive/10 text-destructive font-bold hover:bg-destructive/10">
            Failed
        </Badge>
    )
}

function ActionCell({ status, report }: { status: ReportStatus; report: ReportListItem }) {
    if (status === ReportStatus.COMPLETED) {
        return (
            <Link className="contents" href={`/reports/${report.id}`} prefetch={false}>
                <Button variant="outline" size="sm" className="cursor-pointer bg-card rounded-none">
                    View Report
                </Button>
            </Link>
        )
    }
}
