import { ScrollTextIcon, TriangleAlertIcon, CircleAlertIcon } from 'lucide-react'
import { AdminStatCard } from '@/modules/admin/shared/admin-stat-card'
import { LogsExplorer } from '@/modules/admin/logs/logs-explorer'
import { fetchAdminLogs } from '@/modules/admin/shared/admin-queries'

type Props = {
    email: string
}

export async function AdminLogsSection({ email }: Props) {
    const logs = await fetchAdminLogs(email)

    const errors = logs.filter((log) => log.level === 'error').length
    const warnings = logs.filter((log) => log.level === 'warn').length

    return (
        <section className="space-y-4">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Logs
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <AdminStatCard label="Total Logs" value={logs.length} icon={ScrollTextIcon} />
                <AdminStatCard label="Errors" value={errors} icon={CircleAlertIcon} accent />
                <AdminStatCard label="Warnings" value={warnings} icon={TriangleAlertIcon} />
            </div>

            <LogsExplorer logs={logs} />
        </section>
    )
}
