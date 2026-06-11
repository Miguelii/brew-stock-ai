import { toastError } from '@/lib/toast-error'
import { trpcClient } from '@/_trpc/client'
import { useEffect } from 'react'

export const useGetInvoices = () => {
    const { data: invoices = [], isLoading, error } = trpcClient.credits.getInvoices.useQuery()

    useEffect(() => {
        if (error) toastError('An error occurred while loading the invoices', error)
    }, [error])

    return {
        invoices,
        isLoading,
    }
}
