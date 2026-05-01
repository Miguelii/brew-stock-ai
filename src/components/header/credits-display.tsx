import Link from 'next/link'
import { CoinsIcon } from 'lucide-react'

interface Props {
    credits: number
}

export function CreditsDisplay({ credits }: Props) {
    return (
        <Link
            href="/tokens"
            className="flex items-center gap-1.5 px-3 h-9 rounded-lg border border-border bg-card text-sm font-semibold tabular-nums hover:bg-muted transition-colors"
        >
            <CoinsIcon className="w-4 h-4 text-accent-blue shrink-0" />
            <span>{credits}</span>
        </Link>
    )
}
