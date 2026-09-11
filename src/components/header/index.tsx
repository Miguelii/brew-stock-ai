import { ProfileDropdownMenu } from '@/components/header/profile-dropdown-menu'
import { MobileMenu } from '@/components/header/mobile-menu'
import { NavLinks, LoginLink } from '@/components/header/nav-links'
import { CreditsDisplay } from '@/components/header/credits-display'
import type { NavLink } from '@/types/NavLink'
import Logo from '@/components/logo'
import Image from 'next/image'
import { UserRound } from 'lucide-react'
import type { User } from '@supabase/supabase-js'

const PUBLIC_NAV_LINKS: NavLink[] = [
    {
        label: 'Analysis',
        href: '/analysis',
    },
]

const AUTH_NAV_LINKS: NavLink[] = [
    {
        label: 'My Reports',
        href: '/reports',
    },
]

type Props = {
    userPromise: Promise<User | null>
}

export async function Header({ userPromise }: Props) {
    const user = await userPromise

    // If user its not logged in, we don't show any navigation on purpose
    const navLinks = user ? [...PUBLIC_NAV_LINKS, ...AUTH_NAV_LINKS] : []

    return (
        <>
            {/* Reserves room under the fixed bar for pages that are not full-bleed. */}
            <div className="h-20" aria-hidden="true" />

            {/* The bar itself has no surface: only the pills inside it are visible. */}
            <nav className="pointer-events-none fixed inset-x-0 top-6 z-99 section-shell">
                <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4">
                    <div className="pointer-events-auto flex h-10 items-center rounded-full bg-card px-5 border border-ink/10">
                        <Logo />
                    </div>

                    <div className="pointer-events-auto flex items-center gap-2.5">
                        <MobileMenu
                            isAuthenticated={!!user}
                            nav={navLinks}
                            avatar_url={user?.user_metadata?.avatar_url}
                        />

                        <div className="hidden items-center gap-2.5 md:flex">
                            <NavLinks links={navLinks} />

                            {user ? (
                                <>
                                    <CreditsDisplay />
                                    <ProfileDropdownMenu>
                                        {user?.user_metadata?.avatar_url ? (
                                            <Image
                                                src={user.user_metadata.avatar_url}
                                                alt="Profile"
                                                className="h-full w-full object-cover"
                                                referrerPolicy="no-referrer"
                                                width={56}
                                                height={56}
                                            />
                                        ) : (
                                            <UserRound className="size-5" />
                                        )}
                                    </ProfileDropdownMenu>
                                </>
                            ) : (
                                <LoginLink />
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        </>
    )
}
