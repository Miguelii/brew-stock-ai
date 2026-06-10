import { toastError } from '@/lib/toast-error'
import { trpcClient } from '@/_trpc/client'
import { useEffect } from 'react'

type Props = {
    enabled?: boolean
}

export const useGetCredits = (props: Props = {}) => {
    const { enabled } = props

    const {
        isLoading,
        isSuccess,
        data: credits = 0,
        error,
    } = trpcClient.getCredits.useQuery(undefined, {
        staleTime: 0,
        gcTime: 0,
        enabled: enabled ?? undefined,
    })

    useEffect(() => {
        if (error) toastError('An error occurred while trying to get your credits', error)
    }, [error])

    return {
        credits,
        isLoading,
        isSuccess,
    }
}
