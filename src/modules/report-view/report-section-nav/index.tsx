'use client'

import { useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useActiveSection } from '@/modules/report-view/report-section-nav/use-active-section'
import { useUpdateSliding } from '@/modules/report-view/report-section-nav/use-update-sliding'

const SECTIONS = [
    { id: 'overview', label: 'Summary' },
    { id: 'market-outlook', label: 'Market & Analyst Outlook' },
    { id: 'key-metrics', label: 'Key Financial Metrics' },
    { id: 'analysis', label: 'Full Report' },
    { id: 'sig-dev', label: 'Happening Now' },
    { id: 'latest-news', label: 'Recent News' },
    { id: 'media-mentions', label: 'Expert Coverage' },
    { id: 'sector-scores', label: 'Sector Scores' },
] as const

/**
 * Clearance for the stuck bar: 72px of cream under the floating header, plus the
 * 52px pill row and its padding. Feeds both the scroll landing point and the
 * IntersectionObserver root margin.
 */
const SCROLL_OFFSET = 150

type Props = {
    className?: string
}

export function ReportSectionNav({ className }: Props) {
    const [activeId, scrollTo] = useActiveSection(SECTIONS, SCROLL_OFFSET)
    const [indicator, setIndicator] = useState({ left: 0, width: 0, top: 0, height: 0 })
    const buttonRefs = useRef<(HTMLButtonElement | null)[]>([])

    const activeLabel = SECTIONS.find((s) => s.id === activeId)?.label ?? ''

    useUpdateSliding(activeId, SECTIONS, buttonRefs, setIndicator)

    // The bar runs to the top of the viewport, not just to the header's lower edge,
    // so scrolled content never shows between the floating header pills.
    return (
        <div className={cn('sticky top-0 z-40 bg-paper pt-[72px] pb-3', className)}>
            <div className="section-shell">
                {/* Mobile: dropdown. Its testids stay distinct from the desktop row. */}
                <div className="xl:hidden">
                    <DropdownMenu>
                        <DropdownMenuTrigger className="group flex h-12 w-full items-center gap-2 rounded-full bg-card px-5 text-[15px] font-bold text-ink">
                            <span>{activeLabel}</span>
                            <ChevronDown className="ml-auto size-4 text-ink/45 transition-transform duration-200 group-data-popup-open:rotate-180" />
                        </DropdownMenuTrigger>

                        <DropdownMenuContent className="rounded-[var(--radius-surface-inner)] border-0 bg-card p-1.5">
                            {SECTIONS.map(({ id, label }) => (
                                <DropdownMenuItem
                                    key={id}
                                    data-testid={`nav-mobile-${id}`}
                                    onClick={() => scrollTo(id)}
                                    className={cn(
                                        'w-full rounded-full px-4 py-2.5 text-left text-[15px] font-bold transition-colors',
                                        activeId === id
                                            ? 'bg-ink text-paper'
                                            : 'text-ink hover:bg-ink/7'
                                    )}
                                >
                                    {label}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Desktop: pill row with a sliding pill behind the active label. */}
                <nav className="relative hidden w-fit rounded-full bg-card p-1.5 xl:flex xl:flex-wrap">
                    {SECTIONS.map(({ id, label }, i) => (
                        <button
                            type="button"
                            key={id}
                            data-testid={`nav-${id}`}
                            ref={(el) => {
                                buttonRefs.current[i] = el
                            }}
                            onClick={() => scrollTo(id)}
                            className={cn(
                                'relative z-10 flex h-10 shrink-0 items-center rounded-full px-4 text-sm font-bold transition-colors duration-250 ease-out-strong',
                                activeId === id ? 'text-paper' : 'text-ink hover:text-blue'
                            )}
                        >
                            {label}
                        </button>
                    ))}

                    <span
                        className="absolute rounded-full bg-ink transition-all duration-300 ease-out"
                        style={{
                            left: indicator.left,
                            width: indicator.width,
                            top: indicator.top,
                            height: indicator.height,
                        }}
                        aria-hidden
                    />
                </nav>
            </div>
        </div>
    )
}
