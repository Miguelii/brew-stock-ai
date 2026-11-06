import { CopyButton } from '@/modules/mcp/copy-button'
import { cn } from '@/lib/utils'

type Props = {
    code: string
    /** Small mono caption above the code, e.g. the file or app it goes into. */
    label?: string
    className?: string
}

export function CodeSnippet({ code, label, className }: Props) {
    return (
        <div
            className={cn(
                'overflow-hidden rounded-[var(--radius-surface-inner)] bg-ink text-paper',
                className
            )}
        >
            <div className="flex items-center justify-between gap-3 border-b border-paper/10 py-1.5 pr-1.5 pl-4">
                <span className="font-mono text-xs text-paper/50">{label ?? 'Claude Code'}</span>
                <CopyButton value={code} />
            </div>
            <pre className="overflow-x-auto px-4 py-3.5 font-mono text-[13px] leading-relaxed">
                <code>{code}</code>
            </pre>
        </div>
    )
}
