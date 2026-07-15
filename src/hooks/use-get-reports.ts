import { toastError } from '@/lib/toast-error'
import { trpcClient } from '@/_trpc/client'
import { ReportStatus } from '@/types/ReportDTO'
import { useEffect } from 'react'

export const useGetReports = () => {
    const { data, isLoading, error } = trpcClient.reports.getAll.useQuery(undefined, {
        staleTime: 1000 * 60 * 1, // 1m
        gcTime: 1000 * 60 * 1, // 1m
        // Poll only while a report is still generating — otherwise the data can only change
        // through a user action, which invalidates the query anyway.
        refetchInterval: (query) =>
            query.state.data?.some((report) => report.status === ReportStatus.GENERATING)
                ? 1000 * 20 // 20s
                : false,
    })

    useEffect(() => {
        if (error) toastError('An error occurred while loading the reports', error)
    }, [error])

    return {
        reports: data ?? [],
        isLoading,
    }
}
