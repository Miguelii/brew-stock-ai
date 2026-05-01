'use client'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { UserRound, LogOut, UserIcon } from 'lucide-react'
import { useLogout } from './use-logout'
import { useRouter } from 'next/navigation'

export function ProfileDropdownMenu() {
    const logout = useLogout()

    const router = useRouter()

    /* const testNotification = trpc.sendPushNotification.useMutation({
        onSuccess: () => toast.success('Test notification sent.'),
        onError: () => toast.error('Failed to send test notification.'),
    }) */

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg bg-card text-accent-blue transition-colors hover:bg-accent/30 border border-border focus:outline-none">
                <UserRound size={18} />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="min-w-40 rounded-none">
                <DropdownMenuItem onClick={() => router.push('/account')}>
                    <UserIcon size={14} />
                    Account
                </DropdownMenuItem>

                {/* <DropdownMenuItem
                    onClick={() =>
                        testNotification.mutate({
                            title: 'Test notification',
                            body: 'Push notifications are working! 🎉',
                        })
                    }
                    disabled={testNotification.isPending}
                >
                    <BellRing size={14} />
                    {testNotification.isPending ? 'Sending…' : 'Test notification'}
                </DropdownMenuItem> */}

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => logout.mutate()}>
                    <LogOut size={14} />
                    {logout.isPending ? 'Logging out…' : 'Logout'}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
