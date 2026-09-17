'use client'

import { trpcClient } from '@/lib/trpc'
import { Button } from '@/components/ui/button'
import { RefreshCcwIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTransition } from 'react'

export function ReportsRefetch() {
    const utils = trpcClient.useUtils()

    const [isPending, startTransition] = useTransition()

    function refetch() {
        startTransition(async () => {
            await Promise.all([utils.reports.getAll.refetch(), utils.credits.get.refetch()])
        })
    }

    return (
        <Button variant="outline" className="h-11 w-full px-5 md:w-fit" onClick={() => refetch()}>
            <RefreshCcwIcon className={cn(isPending ? 'animate-spin' : '')} />
            Refresh
        </Button>
    )
}
