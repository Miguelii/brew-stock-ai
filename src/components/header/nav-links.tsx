'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { NavLink } from '@/types/NavLink'
import { AUTH_PAGE_PATH } from '@/lib/constants'

type Props = {
    links: NavLink[]
}

export function NavLinks({ links }: Props) {
    const pathname = usePathname()

    return (
        <ul className="flex h-10 items-center gap-1 rounded-full bg-card px-2.5 border border-ink/10">
            {links.map((link) => {
                const isActive = pathname.startsWith(link.href)

                return (
                    <li key={link.href}>
                        <Link
                            prefetch={false}
                            href={link.href}
                            className={cn(
                                'flex h-7 items-center rounded-full px-4 text-[15px] font-bold transition-colors duration-250 ease-out-strong',
                                isActive ? 'bg-ink text-paper' : 'text-ink hover:bg-ink/7'
                            )}
                        >
                            {link.label}
                        </Link>
                    </li>
                )
            })}
        </ul>
    )
}

export function LoginLink() {
    const pathname = usePathname()

    return (
        <Link prefetch={false} href={`${AUTH_PAGE_PATH}?returnTo=${encodeURIComponent(pathname)}`}>
            <Button variant="tangerine" className="h-14 px-7 text-base font-bold">
                Sign In
            </Button>
        </Link>
    )
}
