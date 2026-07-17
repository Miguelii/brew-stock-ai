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
            <div className="md:hidden flex flex-row gap-3">
                {isAuthenticated ? (
                    <>
                        <CreditsDisplay />
                        <button
                            type="button"
                            aria-label="Open menu"
                            onClick={() => setOpen(true)}
                            className={cn(
                                'flex items-center justify-center h-9 w-9 rounded-none border border-border bg-card',
                                'text-primary transition-all duration-200 hover:bg-muted active:scale-95'
                            )}
                        >
                            <Menu size={18} />
                        </button>
                    </>
                ) : (
                    <LoginLink />
                )}
            </div>

            <Drawer open={open} onOpenChange={setOpen} direction="right">
                <DrawerContent className="w-70 bg-card p-0 border-l border-border flex flex-col rounded-none! z-98">
                    {/* Header */}
                    <div className="flex items-center justify-between h-16 px-5 border-b border-border shrink-0">
                        <div className="flex items-center gap-1.5">
                            <div className="font-bold text-lg tracking-tight pt-1.5">
                                <span>BrewStock</span>
                                <span className="text-accent-blue font-mono">AI</span>
                            </div>
                        </div>
                        <DrawerClose asChild>
                            <button
                                type="button"
                                aria-label="Close menu"
                                className="flex items-center justify-center h-8 w-8 rounded-none text-primary transition-all duration-200 hover:bg-muted hover:text-primary active:scale-95"
                            >
                                <X size={16} />
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
                                    className="flex items-center px-3 py-2.5 rounded-none text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
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
                                        className="flex items-center gap-3 px-3 py-2.5 rounded-none text-sm font-medium text-primary transition-colors hover:bg-muted"
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
                                            <UserIcon size={16} className="text-muted-foreground" />
                                        )}
                                        Account
                                    </Link>
                                </DrawerClose>
                                <button
                                    type="button"
                                    onClick={onClickHandler}
                                    disabled={logout.isPending}
                                    className="cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-none text-sm font-medium text-primary transition-colors hover:bg-muted"
                                >
                                    <LogOut size={16} />
                                    {logout.isPending ? 'Logging out…' : 'Logout'}
                                </button>
                            </div>
                        ) : (
                            <DrawerClose asChild>
                                <Link
                                    href={AUTH_PAGE_PATH}
                                    prefetch={false}
                                    className="flex items-center justify-center w-full px-4 py-2.5 rounded-none bg-accent-blue text-background text-sm font-semibold transition-all duration-200 hover:bg-accent-blue/90 active:scale-[0.98]"
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
