'use client'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { UserRound, LayoutDashboard, LogOut } from 'lucide-react'
import Link from 'next/link'
import { useLogout } from './use-logout'

export function ProfileMenu() {
    const logout = useLogout()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl bg-background text-accent-blue transition-colors hover:bg-accent/30 border border-border focus:outline-none">
                <UserRound size={18} />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="min-w-40">
                <DropdownMenuItem>
                    <Link href="/account" className="flex items-center gap-2.5">
                        <LayoutDashboard size={14} className="text-muted-foreground" />
                        Profile
                    </Link>
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
