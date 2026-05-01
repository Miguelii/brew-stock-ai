'use client'

import { useGetCredits } from '@/hooks/use-get-credits'
import { CoinsIcon } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

export function TokenBalanceCard() {
    const { isLoading, credits } = useGetCredits()

    return (
        <div className="flex items-center gap-2 text-sm text-muted-foreground rounded-lg border border-border bg-card px-4 py-3">
            <CoinsIcon className="w-4 h-4 text-accent-blue shrink-0" />
            <span>
                Your current balance:{' '}
                {isLoading ? (
                    <Skeleton className="inline-block w-6 h-3.5 align-middle" />
                ) : (
                    <span className="font-semibold tabular-nums text-foreground">{credits}</span>
                )}{' '}
                tokens
            </span>
        </div>
    )
}
