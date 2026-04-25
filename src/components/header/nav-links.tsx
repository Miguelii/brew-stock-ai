'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import type { NavLink } from '@/types/NavLink'

export function NavLinks({ links }: { links: NavLink[] }) {
    const pathname = usePathname()

    return (
        <ul className="flex items-center gap-6">
            {links.map((link) => {
                const isActive = pathname === link.href
                return (
                    <li key={link.href}>
                        <Link
                            prefetch={false}
                            href={link.href}
                            className={cn(
                                'border-b-2 pb-0.5 text-sm font-medium transition-colors',
                                isActive
                                    ? 'border-accent-blue text-accent-blue'
                                    : 'border-transparent text-primary-muted hover:text-primary'
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
    return (
        <Link
            prefetch={false}
            href="/auth"
            className="rounded-md bg-accent-blue px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-accent-blue/90"
        >
            Sign In
        </Link>
    )
}
