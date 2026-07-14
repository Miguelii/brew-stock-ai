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
    { id: 'analysis', label: 'Full AI Report' },
    { id: 'sig-dev', label: 'Happening Now' },
    { id: 'latest-news', label: 'Recent News' },
    { id: 'media-mentions', label: 'Expert Coverage' },
    { id: 'sector-scores', label: 'Sector Scores' },
] as const

type Props = {
    className?: string
}

export function ReportSectionNav({ className }: Props) {
    const [activeId, scrollTo] = useActiveSection(SECTIONS, 120)
    const [indicator, setIndicator] = useState({ left: 0, width: 0 })
    const buttonRefs = useRef<(HTMLButtonElement | null)[]>([])

    const activeLabel = SECTIONS.find((s) => s.id === activeId)?.label ?? ''

    useUpdateSliding(activeId, SECTIONS, buttonRefs, setIndicator)

    return (
        <div
            className={cn(
                'sticky top-16.25 z-80 bg-background border-b -mx-px w-[calc(100%+2px)]',
                className
            )}
        >
            <div className="max-w-8xl mx-auto px-6">
                {/* ── Mobile: dropdown ── */}
                <div className="xl:hidden">
                    <DropdownMenu>
                        <DropdownMenuTrigger className="group flex w-full items-center gap-2 py-3 text-sm font-medium">
                            <span className="text-accent-blue">{activeLabel}</span>
                            <ChevronDown className="ml-auto h-4 w-4 text-muted-foreground transition-transform duration-200 group-data-popup-open:rotate-180" />
                        </DropdownMenuTrigger>

                        <DropdownMenuContent className="rounded-none border bg-background py-1 shadow-lg">
                            {SECTIONS.map(({ id, label }) => (
                                <DropdownMenuItem
                                    key={id}
                                    onClick={() => scrollTo(id)}
                                    className={cn(
                                        'w-full px-4 py-2.5 text-left text-sm transition-colors',
                                        activeId === id
                                            ? 'text-accent-blue font-medium'
                                            : 'text-muted-foreground hover:text-accent-blue'
                                    )}
                                >
                                    {label}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* ── Desktop: flex row with sliding indicator ── */}
                <nav className="relative hidden xl:flex xl:flex-wrap">
                    {SECTIONS.map(({ id, label }, i) => (
                        <button
                            type="button"
                            key={id}
                            ref={(el) => {
                                buttonRefs.current[i] = el
                            }}
                            onClick={() => scrollTo(id)}
                            className={cn(
                                'shrink-0 px-4 py-3 text-xs xl:text-sm font-medium transition-colors',
                                activeId === id
                                    ? 'text-accent-blue'
                                    : 'text-muted-foreground hover:text-accent-blue'
                            )}
                        >
                            {label}
                        </button>
                    ))}

                    {/* Sliding underline indicator */}
                    <span
                        className="absolute bottom-0 h-0.5 bg-accent-blue transition-all duration-300 ease-out"
                        style={{ left: indicator.left, width: indicator.width }}
                        aria-hidden
                    />
                </nav>
            </div>
        </div>
    )
}
