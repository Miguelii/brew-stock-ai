import { fmtDate } from '@/lib/formatters'
import { ChangelogTagChip } from '@/modules/changelog/changelog-tag'
import type { ChangelogTag } from '@/types/ChangelogEntry'

type Props = {
    version: string
    tags: ChangelogTag[]
    publishedAt: string
}

export function ChangelogMeta({ version, tags, publishedAt }: Props) {
    return (
        <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-none border border-border px-2.5 py-0.5 text-[11px] font-mono font-semibold text-accent-blue">
                {version}
            </span>
            {tags.map((tag) => (
                <ChangelogTagChip key={tag} tag={tag} />
            ))}
            <span className="text-xs text-muted-foreground">{fmtDate(publishedAt)}</span>
        </div>
    )
}
