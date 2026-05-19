'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import type { NavLink } from '@/types/NavLink'
import { AUTH_PAGE_PATH } from '@/lib/constants'

export function NavLinks({ links }: { links: NavLink[] }) {
    const pathname = usePathname()

    return (
        <ul className="flex items-center gap-6">
            {links.map((link) => {
                const isActive = pathname.startsWith(link.href)
                return (
                    <li key={link.href}>
                        <Link
                            prefetch={false}
                            href={link.href}
                            className={cn(
                                'border-b-2 pb-0.5 text-sm font-medium transition-colors',
                                isActive
                                    ? 'border-accent-blue text-accent-blue'
                                    : 'border-transparent text-muted-foreground hover:text-accent-blue'
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
        <Link
            prefetch={false}
            href={`${AUTH_PAGE_PATH}?returnTo=${encodeURIComponent(pathname)}`}
            className="px-3 py-1.5 text-sm font-medium bg-accent-blue text-background hover:bg-accent-blue/90"
        >
            Sign In
        </Link>
    )
}
