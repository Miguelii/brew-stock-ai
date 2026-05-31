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

    const navLinks = user ? [...PUBLIC_NAV_LINKS, ...AUTH_NAV_LINKS] : PUBLIC_NAV_LINKS

    return (
        <nav className="sticky top-0 z-99 border-b border-border bg-card backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <Logo />
                <div className="flex flex-row gap-5 items-center">
                    <MobileMenu
                        isAuthenticated={!!user}
                        nav={navLinks}
                        avatar_url={user?.user_metadata?.avatar_url}
                    />
                    <div className="hidden md:flex items-center gap-5">
                        <NavLinks links={navLinks} />
                        {user ? (
                            <div className="flex items-center gap-3">
                                <CreditsDisplay />
                                <ProfileDropdownMenu>
                                    {user?.user_metadata?.avatar_url ? (
                                        <Image
                                            src={user.user_metadata.avatar_url}
                                            alt="Profile"
                                            className="h-full w-full object-cover bg-background"
                                            referrerPolicy="no-referrer"
                                            width={36}
                                            height={36}
                                        />
                                    ) : (
                                        <UserRound size={18} />
                                    )}
                                </ProfileDropdownMenu>
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
