import { toastError } from '@/lib/toast-error'
import { trpc } from '@/server/trpc-client'
import { useEffect } from 'react'

export const useGetInvoices = () => {
    const { data: invoices = [], isLoading, error } = trpc.getInvoices.useQuery()

    useEffect(() => {
        if (error) toastError('An error occurred while loading the invoices', error)
    }, [error])

    return {
        invoices,
        isLoading,
    }
}
