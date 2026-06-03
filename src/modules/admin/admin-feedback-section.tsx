import 'server-only'

import { MessageSquareIcon } from 'lucide-react'
import { AdminStatCard } from '@/modules/admin/admin-stat-card'
import { fetchAdminFeedback } from '@/modules/admin/admin-queries'
import { parseReportDate } from '@/lib/formatters'
import type { AdminFeedback } from '@/services/core/admin/get-admin-feedback'

type Props = {
    email: string
}

function FeedbackItem({ item }: { item: AdminFeedback }) {
    return (
        <div className="border border-border p-5 space-y-3">
            <div className="flex items-start justify-between gap-4">
                <div className="space-y-0.5">
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.email}</p>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">
                    {parseReportDate(item.created_at)}
                </span>
            </div>
            <p className="text-sm leading-relaxed">{item.message}</p>
        </div>
    )
}

export async function AdminFeedbackSection({ email }: Props) {
    const feedback = await fetchAdminFeedback(email)

    return (
        <section className="space-y-4">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Feedback
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <AdminStatCard
                    label="Total Feedback"
                    value={feedback.length}
                    icon={MessageSquareIcon}
                />
            </div>

            {feedback.length === 0 ? (
                <p className="text-sm text-muted-foreground py-6 text-center border border-border">
                    No feedback found.
                </p>
            ) : (
                <div className="space-y-3">
                    {feedback.map((f) => (
                        <FeedbackItem key={f.id} item={f} />
                    ))}
                </div>
            )}
        </section>
    )
}
