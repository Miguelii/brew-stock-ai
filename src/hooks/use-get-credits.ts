import { trpcClient } from '@/_trpc/client'

type Props = {
    enabled?: boolean
}

export const useGetCredits = (props: Props = {}) => {
    const { enabled } = props

    const {
        isLoading,
        isSuccess,
        data: credits = 0,
    } = trpcClient.credits.get.useQuery(undefined, {
        staleTime: 0,
        gcTime: 0,
        enabled: enabled ?? undefined,
        meta: { errorMessage: 'An error occurred while trying to get your credits' },
    })

    return {
        credits,
        isLoading,
        isSuccess,
    }
}
