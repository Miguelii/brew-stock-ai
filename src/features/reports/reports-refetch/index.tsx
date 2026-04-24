'use client'

import { trpc } from '@/server/trpc-client'
import { Button } from '@/components/ui/button'
import { RefreshCcwIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTransition } from 'react'

export function ReportsRefetch() {
    const utils = trpc.useUtils()

    const [isPending, startTransition] = useTransition()

    function refetch() {
        startTransition(async () => {
            await utils.getReports.refetch()
        })
    }

    return (
        <Button
            variant="outline"
            size="lg"
            className="cursor-pointer bg-card rounded-none"
            onClick={() => refetch()}
        >
            <RefreshCcwIcon className={cn(isPending ? 'animate-spin' : '')} />
            Refetch
        </Button>
    )
}
