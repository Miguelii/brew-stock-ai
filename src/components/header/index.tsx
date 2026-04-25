import Link from 'next/link'
import { ProfileMenu } from './profile-menu'
import { MobileMenu } from './mobile-menu'
import { NavLinks, LoginLink } from './nav-links'
import { Effect } from 'effect'
import { getSession } from '@/services/supabase/get-session'
import type { NavLink } from '@/types/NavLink'
import Image from 'next/image'

const PUBLIC_NAV_LINKS: NavLink[] = [
    {
        label: 'Analysis',
        href: '/',
    },
]

const AUTH_NAV_LINKS: NavLink[] = [
    {
        label: 'My Reports',
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
                <Link className="flex items-center gap-2 justify-center" href="/" prefetch={false}>
                    <Image height={32} width={32} src="/assets/logo.png" alt="" />
                    <div className="font-bold text-lg tracking-tight pt-1.5">
                        <span>StockBrew</span>
                        <span className="text-accent-blue font-mono">AI</span>
                    </div>
                </Link>

                <div className="flex flex-row gap-5 items-center">
                    <MobileMenu isAuthenticated={!!user} nav={navLinks} />
                    <div className="hidden md:flex items-center gap-5">
                        <NavLinks links={navLinks} />
                        {user ? <ProfileMenu /> : <LoginLink />}
                    </div>
                </div>
            </div>
        </nav>
    )
}
