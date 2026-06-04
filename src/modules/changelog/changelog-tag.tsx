import { cn } from '@/lib/utils'
import type { ChangelogTag } from '@/types/ChangelogEntry'

type Props = {
    tag: ChangelogTag
}

const TAG_STYLES: Record<ChangelogTag, string> = {
    New: 'bg-accent-blue-light text-accent-blue',
    Improved: 'bg-positive/10 text-positive',
    Fixed: 'bg-muted text-muted-foreground',
}

export function ChangelogTagChip({ tag }: Props) {
    return (
        <span
            className={cn(
                'inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold',
                TAG_STYLES[tag]
            )}
        >
            {tag}
        </span>
    )
}
