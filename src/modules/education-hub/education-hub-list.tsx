'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { motion } from 'motion/react'
import { ArrowRightIcon, ClockIcon } from 'lucide-react'
import {
    EDUCATION_HUB_ARTICLES,
    EDUCATION_HUB_THEMES,
    EDUCATION_HUB_THEME_LABELS,
} from '@/lib/education-hub-articles'
import type { ArticleTheme } from '@/types/EducationHubArticle'
import { cn } from '@/lib/utils'

type Filter = ArticleTheme | 'all'

const FILTERS: { value: Filter; label: string }[] = [
    { value: 'all', label: 'All' },
    ...EDUCATION_HUB_THEMES,
]

export function EducationHubList() {
    const [active, setActive] = useState<Filter>('all')

    const sorted = useMemo(
        () => EDUCATION_HUB_ARTICLES.toSorted((a, b) => b.publishedAt.localeCompare(a.publishedAt)),
        []
    )

    const visible = useMemo(
        () => (active === 'all' ? sorted : sorted.filter((a) => a.theme === active)),
        [sorted, active]
    )

    return (
        <section>
            <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
                <div className="flex flex-wrap gap-2 mb-10">
                    {FILTERS.map((filter) => {
                        const isActive = active === filter.value
                        return (
                            <button
                                key={filter.value}
                                type="button"
                                onClick={() => setActive(filter.value)}
                                aria-pressed={isActive}
                                className={cn(
                                    'rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200',
                                    isActive
                                        ? 'bg-primary text-primary-foreground'
                                        : 'border border-border text-muted-foreground hover:text-primary hover:border-primary/40'
                                )}
                            >
                                {filter.label}
                            </button>
                        )
                    })}
                </div>

                <motion.div
                    key={active}
                    initial="hidden"
                    animate="show"
                    variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
                    className="flex flex-col divide-y divide-border"
                >
                    {visible.map((article) => (
                        <motion.article
                            key={article.slug}
                            variants={{
                                hidden: { opacity: 0, y: 12 },
                                show: { opacity: 1, y: 0 },
                            }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className="py-8 first:pt-0 last:pb-0"
                        >
                            <Link
                                href={`/education-hub/${article.slug}`}
                                prefetch={false}
                                className="group flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4"
                            >
                                <div className="flex-1">
                                    <h2 className="text-xl font-semibold mb-2 group-hover:text-accent-blue transition-colors duration-200">
                                        {article.title}
                                    </h2>
                                    <p className="text-primary-muted text-sm leading-relaxed">
                                        {article.description}
                                    </p>
                                    <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-2">
                                            <ClockIcon className="size-3" />
                                            {article.readingTimeMinutes} min read
                                        </span>
                                        <span aria-hidden className="text-border">
                                            /
                                        </span>
                                        <span>{EDUCATION_HUB_THEME_LABELS[article.theme]}</span>
                                    </div>
                                </div>
                                <div className="shrink-0 flex items-center text-accent-blue text-sm font-medium gap-1 group-hover:gap-2 transition-all duration-200">
                                    Read
                                    <ArrowRightIcon className="size-4" />
                                </div>
                            </Link>
                        </motion.article>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
