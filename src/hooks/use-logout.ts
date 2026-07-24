'use client'

import { trpcClient } from '@/_trpc/client'
import { useRouter } from 'next/navigation'

export const useLogout = () => {
    const router = useRouter()

    const logout = trpcClient.auth.logout.useMutation({
        onSuccess: () => {
            router.refresh()
            router.push('/')
            window?.location?.reload()
        },
    })

    return logout
}
