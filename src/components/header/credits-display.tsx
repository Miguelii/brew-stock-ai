'use client'

import Link from 'next/link'
import { CoinsIcon } from 'lucide-react'
import { useGetCredits } from '@/hooks/use-get-credits'
import { Skeleton } from '@/components/ui/skeleton'
import { pluralizeCredits } from '@/lib/utils'

export function CreditsDisplay() {
    const { isLoading, credits } = useGetCredits()

    return (
        <Link
            href="/tokens"
            prefetch={false}
            className="flex h-10 items-center gap-1.5 rounded-full bg-card px-5 text-[15px] font-bold text-ink tabular-nums transition-[filter] duration-300 ease-out-strong hover:brightness-92"
        >
            <CoinsIcon className="size-4 shrink-0 text-blue" />
            {isLoading ? (
                <Skeleton className="h-3.5 w-4 rounded bg-ink/15" />
            ) : (
                <span>{credits}</span>
            )}
            <span className="font-medium text-ink/60">{pluralizeCredits(credits)}</span>
        </Link>
    )
}
