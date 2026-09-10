'use client'

import { useState } from 'react'
import { Menu, X, LogOut, UserIcon } from 'lucide-react'
import Link from 'next/link'
import { Drawer, DrawerContent, DrawerClose } from '@/components/ui/drawer'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import type { NavLink } from '@/types/NavLink'
import { useLogout } from '@/hooks/use-logout'
import { AUTH_PAGE_PATH } from '@/lib/constants'
import { CreditsDisplay } from '@/components/header/credits-display'
import { LoginLink } from '@/components/header/nav-links'
import Image from 'next/image'
import Logo from '@/components/logo'

type Props = {
    nav: NavLink[]
    isAuthenticated: boolean
    avatar_url?: string
}

export function MobileMenu({ nav, isAuthenticated, avatar_url }: Props) {
    const [open, setOpen] = useState(false)

    const logout = useLogout()

    const onClickHandler = () => {
        logout.mutate()
        setOpen(false)
    }

    return (
        <>
            <div className="flex flex-row items-center gap-2.5 md:hidden">
                {isAuthenticated ? (
                    <>
                        <CreditsDisplay />
                        <button
                            type="button"
                            aria-label="Open menu"
                            onClick={() => setOpen(true)}
                            className={cn(
                                'flex size-12 items-center justify-center rounded-full bg-card',
                                'text-ink transition-[filter] duration-300 ease-out-strong hover:brightness-92'
                            )}
                        >
                            <Menu className="size-5" strokeWidth={2.5} />
                        </button>
                    </>
                ) : (
                    <LoginLink />
                )}
            </div>

            <Drawer open={open} onOpenChange={setOpen} direction="right">
                <DrawerContent className="z-98 flex w-70 flex-col border-l border-border bg-card p-0">
                    {/* Header */}
                    <div className="flex items-center justify-between h-16 px-5 border-b border-border shrink-0">
                        <Logo />
                        <DrawerClose asChild>
                            <button
                                type="button"
                                aria-label="Close menu"
                                className="flex size-9 items-center justify-center rounded-full text-ink transition-colors duration-200 hover:bg-ink/7"
                            >
                                <X className="size-5" strokeWidth={2.5} />
                            </button>
                        </DrawerClose>
                    </div>

                    {/* Nav links */}
                    <nav className="flex-1 flex flex-col gap-1 px-3 py-4">
                        {nav.map((link) => (
                            <DrawerClose asChild key={link.href}>
                                <Link
                                    href={link.href}
                                    prefetch={false}
                                    className="flex items-center rounded-full px-4 py-2.5 text-[15px] font-bold text-ink transition-colors hover:bg-ink/7"
                                >
                                    {link.label}
                                </Link>
                            </DrawerClose>
                        ))}
                    </nav>

                    {/* Footer */}
                    <div className="px-3 pb-6 shrink-0">
                        <Separator className="mb-4" />
                        {isAuthenticated ? (
                            <div className="flex flex-col gap-1">
                                <DrawerClose asChild>
                                    <Link
                                        href="/account"
                                        prefetch={false}
                                        className="flex items-center gap-3 rounded-full px-4 py-2.5 text-[15px] font-bold text-ink transition-colors hover:bg-ink/7"
                                    >
                                        {avatar_url ? (
                                            <Image
                                                src={avatar_url}
                                                alt="Profile"
                                                className="h-5 w-5 object-cover bg-background rounded-full"
                                                referrerPolicy="no-referrer"
                                                width={20}
                                                height={20}
                                            />
                                        ) : (
                                            <UserIcon className="size-4 text-ink/50" />
                                        )}
                                        Account
                                    </Link>
                                </DrawerClose>
                                <button
                                    type="button"
                                    onClick={onClickHandler}
                                    disabled={logout.isPending}
                                    className="flex cursor-pointer items-center gap-3 rounded-full px-4 py-2.5 text-[15px] font-bold text-ink transition-colors hover:bg-ink/7"
                                >
                                    <LogOut className="size-4" />
                                    {logout.isPending ? 'Logging out…' : 'Logout'}
                                </button>
                            </div>
                        ) : (
                            <DrawerClose asChild>
                                <Link
                                    href={AUTH_PAGE_PATH}
                                    prefetch={false}
                                    className="flex w-full items-center justify-center rounded-full bg-tangerine px-4 py-3 text-base font-bold text-white transition-[filter] duration-300 ease-out-strong hover:brightness-92"
                                >
                                    Login
                                </Link>
                            </DrawerClose>
                        )}
                    </div>
                </DrawerContent>
            </Drawer>
        </>
    )
}
