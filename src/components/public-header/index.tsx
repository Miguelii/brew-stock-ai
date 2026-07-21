'use client'

import { useState, useSyncExternalStore } from 'react'
import Link from 'next/link'
import Logo from '@/components/logo'
import { AnimatePresence, LazyMotion, domAnimation, m } from 'motion/react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Menu, X } from 'lucide-react'
import { useHotkeys } from 'react-hotkeys-hook'

const NAV_LINKS = [
    { label: 'Reports', href: '/example-report' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'FAQs', href: '/faq' },
] as const

const subscribeToScroll = (callback: () => void) => {
    window.addEventListener('scroll', callback, { passive: true })
    return () => window.removeEventListener('scroll', callback)
}

export function PublicHeader() {
    // Re-renders only when the boolean flips, not on every scroll tick.
    const scrolled = useSyncExternalStore(
        subscribeToScroll,
        () => window.scrollY > 60,
        () => false
    )
    const [menuOpen, setMenuOpen] = useState(false)

    useHotkeys('Escape', () => setMenuOpen(false), { enabled: menuOpen })

    return (
        <LazyMotion features={domAnimation} strict>
            <div className="h-20" aria-hidden="true" />

            {menuOpen && (
                <div
                    aria-hidden="true"
                    className="fixed inset-0 z-50 md:hidden"
                    onClick={() => setMenuOpen(false)}
                />
            )}

            <div className="fixed inset-x-0 top-0 z-60 flex justify-center">
                <header
                    style={{
                        backdropFilter: 'blur(16px)',
                        WebkitBackdropFilter: 'blur(16px)',
                    }}
                    className={cn(
                        'mx-5 md:mx-0 w-full h-14 flex items-center justify-between rounded-full',
                        'transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
                        scrolled
                            ? 'max-w-205 translate-y-3 px-4 bg-card shadow-[0_8px_32px_rgba(0,0,0,0.22),0_0_0_1px_rgba(255,255,255,0.07)]'
                            : 'max-w-235 translate-y-4 px-5 bg-card shadow-[0_8px_40px_rgba(0,0,0,0.16),0_0_0_1px_rgba(255,255,255,0.07)]'
                    )}
                >
                    <m.div
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <Logo />
                    </m.div>

                    <m.nav
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                        className="hidden md:flex items-center gap-1"
                    >
                        {NAV_LINKS.map(({ label, href }) => (
                            <Link
                                key={href}
                                href={href}
                                prefetch={false}
                                className="hidden md:block"
                            >
                                <Button
                                    size="lg"
                                    className="px-3 py-1.5 text-sm h-8 transition-colors duration-200 text-muted-foreground"
                                    variant="ghost"
                                >
                                    {label}
                                </Button>
                            </Link>
                        ))}
                    </m.nav>

                    <m.div
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
                        className="flex items-center gap-2"
                    >
                        <Link href="/analysis" prefetch={false} className="hidden md:block">
                            <Button
                                size="lg"
                                className="px-3 py-1.5 text-sm h-8 transition-colors duration-200"
                                variant="ghost"
                            >
                                Start Analysis
                            </Button>
                        </Link>

                        <button
                            type="button"
                            aria-expanded={menuOpen}
                            onClick={() => setMenuOpen((v) => !v)}
                            className="md:hidden flex items-center justify-center w-8 h-8 rounded-none hover:bg-muted transition-colors duration-200 text-primary"
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
                                        <X size={16} strokeWidth={2} />
                                    </m.span>
                                ) : (
                                    <m.span
                                        key="open"
                                        initial={{ rotate: 45, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: -45, opacity: 0 }}
                                        transition={{ duration: 0.15 }}
                                    >
                                        <Menu size={16} strokeWidth={2} />
                                    </m.span>
                                )}
                            </AnimatePresence>
                        </button>
                    </m.div>
                </header>

                <AnimatePresence>
                    {menuOpen && (
                        <m.div
                            initial={{ opacity: 0, y: -6, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -6, scale: 0.98 }}
                            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            style={{
                                backdropFilter: 'blur(16px)',
                                WebkitBackdropFilter: 'blur(16px)',
                            }}
                            className={cn(
                                'mx-10 absolute md:hidden w-full rounded-none bg-card',
                                'shadow-[0_8px_40px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.06)]',
                                'p-2 flex flex-col',
                                scrolled
                                    ? 'max-w-[90%] md:max-w-205 translate-y-[calc(0.75rem+3.5rem+0.5rem)]'
                                    : 'max-w-[90%] md:max-w-235 translate-y-[calc(1rem+3.5rem+0.5rem)]'
                            )}
                        >
                            {NAV_LINKS.map(({ label, href }, i) => (
                                <m.div
                                    key={href}
                                    initial={{ opacity: 0, x: -8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{
                                        duration: 0.2,
                                        delay: i * 0.04,
                                        ease: [0.16, 1, 0.3, 1],
                                    }}
                                >
                                    <Link
                                        href={href}
                                        prefetch={false}
                                        onClick={() => setMenuOpen(false)}
                                        className="block px-4 py-3 text-sm text-muted-foreground hover:text-primary rounded-none hover:bg-muted transition-colors duration-150"
                                    >
                                        {label}
                                    </Link>
                                </m.div>
                            ))}

                            <div className="mt-1 pt-1.5 border-t border-border">
                                <Link
                                    href="/analysis"
                                    prefetch={false}
                                    onClick={() => setMenuOpen(false)}
                                >
                                    <Button className="w-full h-10 text-sm" size="lg">
                                        Start Analysis
                                    </Button>
                                </Link>
                            </div>
                        </m.div>
                    )}
                </AnimatePresence>
            </div>
        </LazyMotion>
    )
}
