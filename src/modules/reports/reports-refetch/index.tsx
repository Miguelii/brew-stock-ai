'use client'

import { trpcClient } from '@/_trpc/client'
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
        <Button
            variant="outline"
            className="cursor-pointer bg-card rounded-none w-full md:w-fit"
            onClick={() => refetch()}
        >
            <RefreshCcwIcon className={cn(isPending ? 'animate-spin' : '')} />
            Refresh
        </Button>
    )
}
