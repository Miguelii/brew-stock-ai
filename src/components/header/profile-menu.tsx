'use client'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { HOME_PAGE_PATH } from '@/lib/constants'
import { trpc } from '@/server/trpc-client'
import { UserRound, LayoutDashboard, LogOut } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export function ProfileMenu() {
    const router = useRouter()
    const logout = trpc.sbLogout.useMutation({
        onSuccess: () => {
            router.refresh()
            router.push(HOME_PAGE_PATH)
        },
    })

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
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
