import { trpcClient } from '@/lib/trpc'
import { ReportStatus } from '@/types/ReportDTO'

export const useGetReports = () => {
    const { data, isLoading } = trpcClient.reports.getAll.useQuery(undefined, {
        staleTime: 1000 * 60 * 1, // 1m
        gcTime: 1000 * 60 * 1, // 1m
        // Poll only while a report is still generating. Otherwise the data can only change
        // through a user action, which invalidates the query anyway.
        refetchInterval: (query) =>
            query.state.data?.some((report) => report.status === ReportStatus.GENERATING)
                ? 1000 * 20 // 20s
                : false,
        meta: { errorMessage: 'An error occurred while loading the reports' },
    })

    return {
        reports: data ?? [],
        isLoading,
    }
}
