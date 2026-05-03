'use client'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LogOut, UserIcon } from 'lucide-react'
import { useLogout } from '@/hooks/use-logout'
import { useRouter } from 'next/navigation'

type Props = {
    children: React.ReactNode
}

export function ProfileDropdownMenu({ children }: Props) {
    const logout = useLogout()

    const router = useRouter()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-card text-accent-blue transition-colors hover:bg-accent/30 border border-border focus:outline-none overflow-hidden">
                {children}
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="min-w-40 rounded-none">
                <DropdownMenuItem onClick={() => router.push('/account')}>
                    <UserIcon size={14} />
                    Account
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => logout.mutate()}>
                    <LogOut size={14} />
                    {logout.isPending ? 'Logging out…' : 'Logout'}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
