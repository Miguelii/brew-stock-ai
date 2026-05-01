import { ProfileDropdownMenu } from './profile-dropdown-menu'
import { MobileMenu } from './mobile-menu'
import { NavLinks, LoginLink } from './nav-links'
import { CreditsDisplay } from './credits-display'
import { Effect } from 'effect'
import { getSession } from '@/services/supabase/get-session'
import { createCaller } from '@/server/caller'
import type { NavLink } from '@/types/NavLink'
import Logo from '@/components/logo'

const PUBLIC_NAV_LINKS: NavLink[] = []

const AUTH_NAV_LINKS: NavLink[] = [
    {
        label: 'Analysis',
        href: '/',
    },
    {
        label: 'My Reports',
        href: '/reports',
    },
    {
        label: 'Tokens',
        href: '/tokens',
    },
]

export async function Header() {
    const user = await Effect.runPromise(
        getSession().pipe(Effect.catchAll(() => Effect.succeed(null)))
    )

    const navLinks = user ? [...PUBLIC_NAV_LINKS, ...AUTH_NAV_LINKS] : PUBLIC_NAV_LINKS

    let credits = 0
    if (user) {
        try {
            const caller = await createCaller()
            credits = await caller.getCredits()
        } catch {
            // show 0 if fetch fails
        }
    }

    return (
        <nav className="sticky top-0 z-50 border-b border-border bg-card backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <Logo />
                <div className="flex flex-row gap-5 items-center">
                    <MobileMenu isAuthenticated={!!user} nav={navLinks} />
                    <div className="hidden md:flex items-center gap-5">
                        <NavLinks links={navLinks} />
                        {user ? (
                            <div className="flex items-center gap-2">
                                <CreditsDisplay credits={credits} />
                                <ProfileDropdownMenu />
                            </div>
                        ) : (
                            <LoginLink />
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}
