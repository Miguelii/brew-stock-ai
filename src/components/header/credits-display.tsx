'use client'

import Link from 'next/link'
import { CoinsIcon } from 'lucide-react'
import { useGetCredits } from '@/hooks/use-get-credits'
import { Skeleton } from '@/components/ui/skeleton'

export function CreditsDisplay() {
    const { isLoading, credits } = useGetCredits()

    return (
        <Link
            href="/tokens"
            prefetch={false}
            className="flex items-center gap-1.5 px-3 h-9 rounded-sm border border-border bg-card text-sm tabular-nums hover:bg-muted transition-colors"
        >
            <CoinsIcon className="w-4 h-4 text-accent-blue shrink-0" />
            {isLoading ? (
                <Skeleton className="w-4 h-3.5 rounded bg-muted-foreground/20 animate-pulse" />
            ) : (
                <>
                    <span className="font-semibold">{credits}</span> <span>Tokens</span>
                </>
            )}
        </Link>
    )
}
