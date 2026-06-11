import { toastError } from '@/lib/toast-error'
import { trpcClient } from '@/_trpc/client'
import { useEffect } from 'react'

export const useGetReports = () => {
    const { data, isLoading, error } = trpcClient.reports.getAll.useQuery(undefined, {
        staleTime: 1000 * 60 * 1, // 1m
        gcTime: 1000 * 60 * 1, // 1m
        refetchInterval: 1000 * 20, // 20s
    })

    useEffect(() => {
        if (error) toastError('An error occurred while loading the reports', error)
    }, [error])

    return {
        reports: data ?? [],
        isLoading,
    }
}
