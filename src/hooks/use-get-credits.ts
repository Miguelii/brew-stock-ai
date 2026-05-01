import { trpc } from '@/server/trpc-client'

export const useGetCredits = () => {
    const { isLoading, data: credits = 0 } = trpc.getCredits.useQuery(undefined, {
        staleTime: 0,
        gcTime: 0,
    })

    return {
        credits,
        isLoading,
    }
}
