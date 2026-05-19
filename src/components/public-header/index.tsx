'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Logo from '@/components/logo'
import { motion, AnimatePresence } from 'motion/react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Menu, X } from 'lucide-react'

const NAV_LINKS = [
    { label: 'Pricing', href: '/pricing' },
    { label: 'Example Report', href: '/example-report' },
    { label: 'Education Hub', href: '/education-hub' },
]

export function PublicHeader() {
    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)

    useEffect(() => {
        setScrolled(window.scrollY > 60)
        const onScroll = () => {
            setScrolled(window.scrollY > 60)
            setMenuOpen(false)
        }
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    return (
        <>
            <div className="h-20" aria-hidden="true" />

            {menuOpen && (
                <div className="fixed inset-0 z-50 md:hidden" onClick={() => setMenuOpen(false)} />
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
                    <motion.div
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <Logo />
                    </motion.div>

                    <motion.nav
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
                    </motion.nav>

                    <motion.div
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
                            onClick={() => setMenuOpen((v) => !v)}
                            className="md:hidden flex items-center justify-center w-8 h-8 rounded-full hover:bg-muted transition-colors duration-200 text-primary"
                            aria-label="Toggle menu"
                        >
                            <AnimatePresence mode="wait" initial={false}>
                                {menuOpen ? (
                                    <motion.span
                                        key="close"
                                        initial={{ rotate: -45, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: 45, opacity: 0 }}
                                        transition={{ duration: 0.15 }}
                                    >
                                        <X size={16} strokeWidth={2} />
                                    </motion.span>
                                ) : (
                                    <motion.span
                                        key="open"
                                        initial={{ rotate: 45, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: -45, opacity: 0 }}
                                        transition={{ duration: 0.15 }}
                                    >
                                        <Menu size={16} strokeWidth={2} />
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </button>
                    </motion.div>
                </header>

                <AnimatePresence>
                    {menuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -6, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -6, scale: 0.98 }}
                            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            style={{
                                backdropFilter: 'blur(16px)',
                                WebkitBackdropFilter: 'blur(16px)',
                            }}
                            className={cn(
                                'mx-10 absolute md:hidden w-full rounded-2xl bg-card',
                                'shadow-[0_8px_40px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.06)]',
                                'p-2 flex flex-col',
                                scrolled
                                    ? 'max-w-[90%] md:max-w-205 translate-y-[calc(0.75rem+3.5rem+0.5rem)]'
                                    : 'max-w-[90%] md:max-w-235 translate-y-[calc(1rem+3.5rem+0.5rem)]'
                            )}
                        >
                            {NAV_LINKS.map(({ label, href }, i) => (
                                <motion.div
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
                                        className="block px-4 py-3 text-sm text-muted-foreground hover:text-primary rounded-xl hover:bg-muted transition-colors duration-150"
                                    >
                                        {label}
                                    </Link>
                                </motion.div>
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
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    )
}
