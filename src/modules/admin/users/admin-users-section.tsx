import { UsersIcon, UserCheckIcon, MailIcon } from 'lucide-react'
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
import { fetchAdminStats, fetchAdminUsers } from '@/modules/admin/shared/admin-queries'
import { parseReportDate } from '@/lib/formatters'

type Props = {
    email: string
}

export async function AdminUsersSection({ email }: Props) {
    const [stats, users] = await Promise.all([fetchAdminStats(email), fetchAdminUsers(email)])

    const sortedUsers = users.toSorted(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    const googleUsers = users.filter((u) => u.provider === 'google').length
    const emailUsers = users.filter((u) => u.provider === 'email').length

    return (
        <section className="space-y-4">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Users
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <AdminStatCard label="Total Users" value={stats.totalUsers} icon={UsersIcon} />
                <AdminStatCard label="By Google" value={googleUsers} icon={UserCheckIcon} />
                <AdminStatCard label="By Email" value={emailUsers} icon={MailIcon} />
            </div>

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
    )
}
