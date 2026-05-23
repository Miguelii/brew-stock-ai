import { trpc } from '@/server/trpc-client'

type Props = {
    enabled?: boolean
}

export const useGetCredits = (props: Props = {}) => {
    const { enabled } = props

    const {
        isLoading,
        isSuccess,
        data: credits = 0,
    } = trpc.getCredits.useQuery(undefined, {
        staleTime: 0,
        gcTime: 0,
        enabled: enabled ?? undefined,
    })

    return {
        credits,
        isLoading,
        isSuccess,
    }
}
