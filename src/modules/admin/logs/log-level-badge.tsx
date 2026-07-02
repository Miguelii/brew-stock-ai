import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { LogLevel } from '@/_bff/modules/admin/services/get-admin-logs.service'

type Props = {
    level: LogLevel
    className?: string
}

const LEVEL_STYLES: Record<LogLevel, string> = {
    error: 'border-destructive/30 bg-destructive/10 text-destructive',
    warn: 'border-warning/30 bg-warning/10 text-warning',
    info: 'border-accent-blue/30 bg-accent-blue/10 text-accent-blue',
    log: 'border-border bg-muted text-muted-foreground',
}

export function LogLevelBadge({ level, className }: Props) {
    return (
        <Badge
            variant="outline"
            className={cn('font-mono uppercase tracking-wide', LEVEL_STYLES[level], className)}
        >
            {level}
        </Badge>
    )
}
