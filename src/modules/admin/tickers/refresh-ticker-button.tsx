'use client'

import { Loader2Icon, RefreshCwIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { trpcClient } from '@/_trpc/client'
import { toastError } from '@/lib/toast-error'
import type { RefreshStockDataResult } from '@/_bff/modules/admin/services/refresh-stock-data.service'

type Props = {
    ticker: string
}

export function RefreshTickerButton({ ticker }: Props) {
    const router = useRouter()
    const refreshStockData = trpcClient.admin.refreshStockData.useMutation()

    const onRefresh = async () => {
        try {
            const request: Promise<RefreshStockDataResult> = refreshStockData.mutateAsync({
                ticker,
            })
            const { reportsCount } = await request

            toast.success(`${ticker} refreshed`, {
                description: `${reportsCount} expert ${reportsCount === 1 ? 'report' : 'reports'} saved`,
            })
            router.refresh()
        } catch (error) {
            const code = (error as { data?: { code?: string } })?.data?.code

            if (code === 'BAD_GATEWAY') {
                toastError(
                    `Yahoo returned no data for ${ticker}.`,
                    error,
                    'The stored data was kept. Try again later.'
                )
            } else if (code === 'FORBIDDEN') {
                toastError('Only admins can refresh stock data.', error)
            } else {
                toastError(`Failed to refresh ${ticker}.`, error, 'Please try again later.')
            }
        }
    }

    return (
        <Button
            variant="outline"
            size="sm"
            className="cursor-pointer gap-1.5 rounded-none"
            disabled={refreshStockData.isPending}
            onClick={onRefresh}
        >
            {refreshStockData.isPending ? (
                <Loader2Icon className="size-3.5 animate-spin" />
            ) : (
                <RefreshCwIcon className="size-3.5" />
            )}
            Refresh
        </Button>
    )
}
