'use client'

import { useCallback, useState } from 'react'
import { Menu, X, LogOut } from 'lucide-react'
import Link from 'next/link'
import { Drawer, DrawerContent, DrawerClose } from '@/components/ui/drawer'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import type { NavLink } from '@/types/NavLink'
import { useLogout } from './use-logout'

type Props = {
    nav: NavLink[]
    isAuthenticated: boolean
}

export function MobileMenu({ nav, isAuthenticated }: Props) {
    const [open, setOpen] = useState(false)

    const logout = useLogout()

    const onClickHandler = useCallback(() => {
        logout.mutate()
        setOpen(false)
    }, [logout])

    return (
        <>
            <button
                aria-label="Open menu"
                onClick={() => setOpen(true)}
                className={cn(
                    'md:hidden flex items-center justify-center h-9 w-9 rounded-lg border border-border bg-card',
                    'text-primary transition-all duration-200 hover:bg-muted active:scale-95'
                )}
            >
                <Menu size={18} />
            </button>

            <Drawer open={open} onOpenChange={setOpen} direction="right">
                <DrawerContent className="w-70 bg-card p-0 border-l border-border flex flex-col rounded-none!">
                    {/* Header */}
                    <div className="flex items-center justify-between h-16 px-5 border-b border-border shrink-0">
                        <div className="flex items-center gap-1.5">
                            <div className="font-bold text-lg tracking-tight pt-1.5">
                                <span>StockBrew</span>
                                <span className="text-accent-blue font-mono">AI</span>
                            </div>
                        </div>
                        <DrawerClose asChild>
                            <button
                                aria-label="Close menu"
                                className="flex items-center justify-center h-8 w-8 rounded-lg text-primary transition-all duration-200 hover:bg-muted hover:text-primary active:scale-95"
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
                                    className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
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
                                {/* <DrawerClose asChild>
                                    <Link
                                        href="/account"
                                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-primary transition-colors hover:bg-muted"
                                    >
                                        <LayoutDashboard
                                            size={15}
                                            className="text-muted-foreground"
                                        />
                                        Profile
                                    </Link>
                                </DrawerClose> */}
                                <button
                                    onClick={onClickHandler}
                                    disabled={logout.isPending}
                                    className="cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-primary transition-colors hover:bg-muted"
                                >
                                    <LogOut size={15} />
                                    {logout.isPending ? 'Logging out…' : 'Logout'}
                                </button>
                            </div>
                        ) : (
                            <DrawerClose asChild>
                                <Link
                                    href="/auth"
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
