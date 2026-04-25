'use client'

import { HOME_PAGE_PATH } from '@/lib/constants'
import { trpc } from '@/server/trpc-client'
import { useRouter } from 'next/navigation'

export const useLogout = () => {
    const router = useRouter()

    const logout = trpc.sbLogout.useMutation({
        onSuccess: () => {
            router.refresh()
            router.push(HOME_PAGE_PATH)
            window?.location?.reload()
        },
    })

    return logout
}
