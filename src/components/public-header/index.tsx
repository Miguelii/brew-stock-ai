'use client'

import { useState } from 'react'
import Link from 'next/link'
import Logo from '@/components/logo'
import { AnimatePresence, m } from 'motion/react'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import { useHotkeys } from 'react-hotkeys-hook'
import { EASE } from '@/components/motion/constants'
import { NAV_LINKS } from '@/components/public-header/constants'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'

export function PublicHeader() {
    const [menuOpen, setMenuOpen] = useState(false)
    const pathname = usePathname()

    useHotkeys('Escape', () => setMenuOpen(false), { enabled: menuOpen })

    return (
        <>
            {/* Reserves room under the fixed bar for pages that are not full-bleed. */}
            <div className="h-20" aria-hidden="true" />

            {menuOpen && (
                <div
                    aria-hidden="true"
                    className="fixed inset-0 z-50 md:hidden"
                    onClick={() => setMenuOpen(false)}
                />
            )}

            {/* The bar itself has no surface: only the pills inside it are visible. */}
            <div className="pointer-events-none fixed inset-x-0 top-6 z-60 section-shell">
                <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4">
                    <m.div
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, ease: EASE }}
                        className="pointer-events-auto flex h-10 items-center rounded-full bg-card px-5 border border-ink/10"
                    >
                        <Logo />
                    </m.div>

                    <div className="flex items-center gap-2.5">
                        <m.nav
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.08, ease: EASE }}
                            className="pointer-events-auto hidden h-10 items-center gap-1 rounded-full bg-card px-2.5 md:flex border border-ink/10"
                        >
                            {NAV_LINKS.map(({ label, href }) => {
                                const isActive = pathname.startsWith(href)

                                return (
                                    <Link
                                        key={href}
                                        href={href}
                                        prefetch={false}
                                        className={cn(
                                            'flex h-7 items-center rounded-full px-4 text-[15px] font-bold text-ink transition-colors duration-250 ease-out-strong',
                                            isActive
                                                ? 'bg-ink text-paper'
                                                : 'text-ink hover:bg-ink/7'
                                        )}
                                    >
                                        {label}
                                    </Link>
                                )
                            })}
                        </m.nav>

                        <m.div
                            initial={{ opacity: 0, x: 8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.05, ease: EASE }}
                            className="pointer-events-auto flex items-center gap-2.5"
                        >
                            <Link href="/analysis" prefetch={false} className="hidden md:block">
                                <Button
                                    variant="tangerine"
                                    className="h-14 px-7 text-base font-bold border border-ink/10"
                                >
                                    Start analysis
                                </Button>
                            </Link>

                            <button
                                type="button"
                                aria-expanded={menuOpen}
                                onClick={() => setMenuOpen((v) => !v)}
                                className="flex size-12 items-center justify-center rounded-full bg-card text-ink transition-[filter] duration-300 ease-out-strong hover:brightness-92 md:hidden border border-ink/10"
                                aria-label="Toggle menu"
                            >
                                <AnimatePresence mode="wait" initial={false}>
                                    {menuOpen ? (
                                        <m.span
                                            key="close"
                                            initial={{ rotate: -45, opacity: 0 }}
                                            animate={{ rotate: 0, opacity: 1 }}
                                            exit={{ rotate: 45, opacity: 0 }}
                                            transition={{ duration: 0.15 }}
                                        >
                                            <X className="size-5" strokeWidth={2.5} />
                                        </m.span>
                                    ) : (
                                        <m.span
                                            key="open"
                                            initial={{ rotate: 45, opacity: 0 }}
                                            animate={{ rotate: 0, opacity: 1 }}
                                            exit={{ rotate: -45, opacity: 0 }}
                                            transition={{ duration: 0.15 }}
                                        >
                                            <Menu className="size-5" strokeWidth={2.5} />
                                        </m.span>
                                    )}
                                </AnimatePresence>
                            </button>
                        </m.div>
                    </div>
                </div>

                <AnimatePresence>
                    {menuOpen && (
                        <m.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.25, ease: EASE }}
                            className="surface pointer-events-auto mx-auto mt-3 flex max-w-[1600px] flex-col bg-card p-3 md:hidden"
                        >
                            {NAV_LINKS.map(({ label, href }) => (
                                <Link
                                    key={href}
                                    href={href}
                                    prefetch={false}
                                    onClick={() => setMenuOpen(false)}
                                    className="rounded-full px-4 py-3 text-base font-bold text-ink transition-colors duration-150 hover:bg-ink/7"
                                >
                                    {label}
                                </Link>
                            ))}

                            <Link
                                href="/analysis"
                                prefetch={false}
                                onClick={() => setMenuOpen(false)}
                                className="mt-2"
                            >
                                <Button variant="tangerine" size="xl" className="w-full">
                                    Start analysis
                                </Button>
                            </Link>
                        </m.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    )
}
