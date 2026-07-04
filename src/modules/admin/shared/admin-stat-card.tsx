import { cn } from '@/lib/utils'
import { fmtCount } from '@/modules/admin/shared/utils'
import { type LucideIcon } from 'lucide-react'

type Props = {
    label: string
    value: number
    icon: LucideIcon
    accent?: boolean
}

export function AdminStatCard({ label, value, icon: Icon, accent }: Props) {
    return (
        <div className="rounded-none border border-border px-5 py-4 space-y-3">
            <div className="flex items-center gap-2">
                <Icon
                    className={cn('size-4', accent ? 'text-destructive' : 'text-muted-foreground')}
                />
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    {label}
                </span>
            </div>
            <p
                className={cn(
                    'text-3xl font-bold tabular-nums',
                    accent ? 'text-destructive' : 'text-foreground'
                )}
            >
                {fmtCount(value)}
            </p>
        </div>
    )
}
