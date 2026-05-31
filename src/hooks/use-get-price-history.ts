import { toastError } from '@/lib/toast-error'
import { trpc } from '@/server/trpc-client'
import { useEffect } from 'react'

export const useGetPriceHistory = (ticker: string) => {
    const { data, isLoading, error } = trpc.priceHistory.useQuery({ ticker })

    useEffect(() => {
        if (error) toastError('An error occurred while trying to load chart data', error)
    }, [error])

    return {
        data,
        isLoading,
    }
}
