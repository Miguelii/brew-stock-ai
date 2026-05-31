import { toastError } from '@/lib/toast-error'
import { trpc } from '@/server/trpc-client'
import { useEffect } from 'react'

export const useGetReports = () => {
    const { data, isLoading, error } = trpc.getReports.useQuery(undefined, {
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
