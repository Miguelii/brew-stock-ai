import { cn } from '@/lib/utils'
import Link from 'next/link'
import { ProfileMenu } from './profile-menu'
import { Effect } from 'effect'
import { getSession } from '@/services/supabase/get-session'

const PUBLIC_NAV_LINKS = [
    {
        label: 'Analysis',
        href: '/',
    },
]

const AUTH_NAV_LINKS = [
    {
        label: 'Reports',
        href: '/reports',
    },
]

export async function Header() {
    const user = await Effect.runPromise(
        getSession().pipe(Effect.catchAll(() => Effect.succeed(null)))
    )

    const navLinks = user ? [...PUBLIC_NAV_LINKS, ...AUTH_NAV_LINKS] : PUBLIC_NAV_LINKS

    return (
        <nav className="sticky top-0 z-50 border-b border-border bg-card backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-accent-blue font-bold text-lg tracking-tight font-mono">
                        Guru
                    </span>
                    <span className="text-on-surface font-bold text-lg tracking-tight font-mono">
                        Finances
                    </span>
                </div>

                <div className="flex flex-row gap-5">
                    <ul className="hidden md:flex items-center gap-0.5">
                        {navLinks.map((link) => (
                            <li key={link.href}>
                                <Link
                                    prefetch={false}
                                    href={link.href}
                                    className={cn(
                                        'px-4 py-2 rounded text-sm font-medium transition-colors'
                                    )}
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}

                        <li>
                            {user ? (
                                <ProfileMenu />
                            ) : (
                                <Link
                                    prefetch={false}
                                    href="/auth"
                                    className="px-4 py-2 rounded text-sm font-medium transition-colors"
                                >
                                    Login
                                </Link>
                            )}
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}
