'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

const SECTIONS = [
    { id: 'overview', label: 'Overview' },
    { id: 'key-metrics', label: 'Key Metrics' },
    { id: 'analysis', label: 'Analysis' },
    { id: 'sig-dev', label: 'Sig. Dev.' },
    { id: 'latest-news', label: 'Latest News' },
    { id: 'sector-scores', label: 'Sector Scores' },
] as const

export function ReportSectionNav() {
    const [activeId, setActiveId] = useState<string>(SECTIONS[0].id)

    const scrollTo = (id: string) => {
        const el = document.getElementById(id)
        if (!el) return
        setActiveId(id)
        const offset = 120
        const top = el.getBoundingClientRect().top + window.scrollY - offset
        window.scrollTo({ top, behavior: 'smooth' })
    }

    return (
        <div
            className={cn(
                'sticky top-16.25 z-80 bg-background border-b transition-shadow -mx-px w-[calc(100%+2px)]'
            )}
        >
            <div className="max-w-8xl mx-auto px-6">
                <nav className="flex flex-wrap gap-1 overflow-x-auto scrollbar-none">
                    {SECTIONS.map(({ id, label }) => (
                        <button
                            key={id}
                            onClick={() => scrollTo(id)}
                            className={cn(
                                'shrink-0 px-4 py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors',
                                activeId === id
                                    ? 'border-accent-blue text-accent-blue'
                                    : 'border-transparent text-muted-foreground hover:text-accent-blue'
                            )}
                        >
                            {label}
                        </button>
                    ))}
                </nav>
            </div>
        </div>
    )
}
