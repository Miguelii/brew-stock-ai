import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Effect } from 'effect'
import {
    FileTextIcon,
    UsersIcon,
    CheckCircle2Icon,
    XCircleIcon,
    Loader2Icon,
    type LucideIcon,
} from 'lucide-react'
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
import { Separator } from '@/components/ui/separator'
import { ClientEnv } from '@/env/client'
import { BreadcrumbSchema } from '@/components/structured-data'
import { getCachedSession } from '@/services/auth/get-cached-session'
import { getAdminStats, type AdminStats } from '@/services/admin/get-admin-stats'
import { getAdminUsers, type AdminUser } from '@/services/admin/get-admin-users'
import { getAdminReports, type AdminReport } from '@/services/admin/get-admin-reports'
import { ReportStatus } from '@/types/ReportDTO'
import { PROMPT_OPTIONS } from '@/lib/constants'
import { parseReportDate } from '@/lib/utils'
import { isSuperAdmin } from '@/services/admin/is-super-admin'

const SITE_URL = ClientEnv.NEXT_PUBLIC_WEBSITE_URL
const META_TITLE = 'Admin'
const META_DESCRIPTION = 'Internal admin dashboard.'
const META_URL = `${SITE_URL}/secure-admin`

export const metadata: Metadata = {
    title: META_TITLE,
    description: META_DESCRIPTION,
    robots: { index: false, follow: false },
}

// ─── Stat card ────────────────────────────────────────────────────────────────

type StatCardProps = {
    label: string
    value: number
    icon: LucideIcon
    accent?: boolean
}

function StatCard({ label, value, icon: Icon, accent }: StatCardProps) {
    return (
        <div className="rounded-none border border-border px-5 py-4 space-y-3">
            <div className="flex items-center gap-2">
                <Icon
                    className={`size-4 ${accent ? 'text-destructive' : 'text-muted-foreground'}`}
                />
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    {label}
                </span>
            </div>
            <p
                className={`text-3xl font-bold tabular-nums ${accent ? 'text-destructive' : 'text-foreground'}`}
            >
                {value.toLocaleString()}
            </p>
        </div>
    )
}

// ─── Status badge ─────────────────────────────────────────────────────────────

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

// ─── Page ─────────────────────────────────────────────────────────────────────

const EMPTY_STATS: AdminStats = {
    totalReports: 0,
    completedReports: 0,
    failedReports: 0,
    totalUsers: 0,
}

export default async function SecureAdminPage() {
    const user = await getCachedSession()

    if (!isSuperAdmin(user?.email)) return notFound()

    const email = user!.email!

    const [stats, users, reports] = await Effect.runPromise(
        Effect.all(
            [
                getAdminStats(email).pipe(Effect.catchAll(() => Effect.succeed(EMPTY_STATS))),
                getAdminUsers(email).pipe(Effect.catchAll(() => Effect.succeed([] as AdminUser[]))),
                getAdminReports(email).pipe(
                    Effect.catchAll(() => Effect.succeed([] as AdminReport[]))
                ),
            ],
            { concurrency: 'unbounded' }
        )
    )

    // Build user lookup for the reports table
    const userEmailById = new Map(users.map((u) => [u.id, u.email]))

    // Sort users: most recently registered first
    const sortedUsers = users.toSorted(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )

    return (
        <>
            <BreadcrumbSchema
                items={[
                    { name: 'Home', url: `${SITE_URL}/` },
                    { name: META_TITLE, url: META_URL },
                ]}
            />

            <main className="max-w-7xl mx-auto px-6 py-10 space-y-10">
                {/* Header */}
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight">Admin</h1>
                    <p className="text-sm text-muted-foreground">Platform overview.</p>
                </div>

                <Separator />

                {/* Stats */}
                <section className="space-y-4">
                    <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        Stats
                    </h2>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard
                            label="Total Reports"
                            value={stats.totalReports}
                            icon={FileTextIcon}
                        />
                        <StatCard label="Users" value={stats.totalUsers} icon={UsersIcon} />
                        <StatCard
                            label="Completed"
                            value={stats.completedReports}
                            icon={CheckCircle2Icon}
                        />
                        <StatCard
                            label="Failed"
                            value={stats.failedReports}
                            icon={XCircleIcon}
                            accent
                        />
                    </div>
                </section>

                <Separator />

                {/* Users */}
                <section className="space-y-4">
                    <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        Users
                    </h2>

                    <Card className="pt-0">
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="pl-5">Email</TableHead>
                                        <TableHead>Registered</TableHead>
                                        <TableHead className="pr-5">Last Sign In</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {sortedUsers.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={3}
                                                className="h-24 text-center text-muted-foreground"
                                            >
                                                No users found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        sortedUsers.map((u) => (
                                            <TableRow key={u.id}>
                                                <TableCell className="pl-5 py-3 font-medium">
                                                    {u.email}
                                                </TableCell>
                                                <TableCell className="py-3 text-sm text-muted-foreground">
                                                    {parseReportDate(u.created_at)}
                                                </TableCell>
                                                <TableCell className="pr-5 py-3 text-sm text-muted-foreground">
                                                    {u.last_sign_in_at
                                                        ? parseReportDate(u.last_sign_in_at)
                                                        : '—'}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </section>

                <Separator />

                {/* Reports */}
                <section className="space-y-4">
                    <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        Reports
                    </h2>

                    <Card className="pt-0">
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="pl-5">Stock</TableHead>
                                        <TableHead>Analysis Type</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>User</TableHead>
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
                                                    {PROMPT_OPTIONS.find((o) => o.type === r.type)
                                                        ?.label ?? r.type}
                                                </TableCell>
                                                <TableCell className="py-3">
                                                    <StatusBadge status={r.status} />
                                                </TableCell>
                                                <TableCell className="py-3 text-sm text-muted-foreground">
                                                    {userEmailById.get(r.user_id) ?? r.user_id}
                                                </TableCell>
                                                <TableCell className="py-3 text-sm text-muted-foreground">
                                                    {parseReportDate(r.created_at)}
                                                </TableCell>
                                                <TableCell className="pr-5 py-3 text-right">
                                                    {r.status === ReportStatus.COMPLETED && (
                                                        <Link
                                                            href={`/reports/${r.id}`}
                                                            prefetch={false}
                                                        >
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
            </main>
        </>
    )
}
