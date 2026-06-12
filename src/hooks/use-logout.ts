'use client'

import { HOME_PAGE_PATH } from '@/lib/constants'
import { trpcClient } from '@/_trpc/client'
import { useRouter } from 'next/navigation'

export const useLogout = () => {
    const router = useRouter()

    const logout = trpcClient.auth.logout.useMutation({
        onSuccess: () => {
            router.refresh()
            router.push(HOME_PAGE_PATH)
            window?.location?.reload()
        },
    })

    return logout
}
