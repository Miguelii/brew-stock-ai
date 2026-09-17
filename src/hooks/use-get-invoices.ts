import { trpcClient } from '@/lib/trpc'

export const useGetInvoices = () => {
    const { data: invoices = [], isLoading } = trpcClient.credits.getInvoices.useQuery(undefined, {
        meta: { errorMessage: 'An error occurred while loading the invoices' },
    })

    return {
        invoices,
        isLoading,
    }
}
