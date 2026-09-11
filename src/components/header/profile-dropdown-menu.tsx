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
import type { PropsWithChildren } from 'react'

type Props = PropsWithChildren

export function ProfileDropdownMenu({ children }: Props) {
    const logout = useLogout()

    const router = useRouter()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="flex size-10 border border-ink/10 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-card text-ink transition-[filter] duration-300 ease-out-strong hover:brightness-92 focus:outline-none">
                {children}
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                className="min-w-44 rounded-[var(--radius-surface-inner)]"
            >
                <DropdownMenuItem onClick={() => router.push('/account')}>
                    <UserIcon className="size-3.5" />
                    Account
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => logout.mutate()}>
                    <LogOut className="size-3.5" />
                    {logout.isPending ? 'Logging out…' : 'Logout'}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
