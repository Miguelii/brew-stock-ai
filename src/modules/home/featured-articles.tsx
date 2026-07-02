import Link from 'next/link'
import { ArrowRightIcon, ClockIcon } from 'lucide-react'
import * as motion from 'motion/react-client'
import {
    EDUCATION_HUB_ARTICLES,
    EDUCATION_HUB_THEME_LABELS,
} from '@/modules/education-hub/education-hub-articles'
import { SectionHeader } from '@/modules/home/section-header'

const FEATURED_COUNT = 3

export function FeaturedArticles() {
    const featured = EDUCATION_HUB_ARTICLES.toSorted((a, b) =>
        b.publishedAt.localeCompare(a.publishedAt)
    ).slice(0, FEATURED_COUNT)

    return (
        <section className="border-b border-border">
            <div className="max-w-7xl mx-auto px-6 py-24 lg:py-32">
                <SectionHeader
                    title="Learn the fundamentals"
                    lede="Guides to reading financial statements, valuing companies, and building a durable investing strategy."
                />

                <div className="flex flex-col">
                    {featured.map((article, i) => (
                        <motion.div
                            key={article.slug}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-8%' }}
                            transition={{ duration: 0.5, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <Link
                                href={`/education-hub/${article.slug}`}
                                prefetch={false}
                                className="group grid grid-cols-1 md:grid-cols-[11rem_1fr_auto] items-start md:items-center gap-2 md:gap-8 border-t border-border py-7 transition-colors duration-200 hover:bg-card"
                            >
                                <span className="font-mono text-xs font-semibold tracking-widest uppercase text-accent-blue">
                                    {EDUCATION_HUB_THEME_LABELS[article.theme]}
                                </span>
                                <span className="flex flex-col gap-1.5">
                                    <h3 className="text-lg md:text-xl font-semibold group-hover:text-accent-blue transition-colors duration-200">
                                        {article.title}
                                    </h3>
                                    <p className="text-primary-muted text-sm leading-relaxed max-w-2xl">
                                        {article.description}
                                    </p>
                                </span>
                                <span className="flex items-center gap-4 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1.5">
                                        <ClockIcon className="size-3" />
                                        {article.readingTimeMinutes} min read
                                    </span>
                                    <ArrowRightIcon className="size-4 text-accent-blue transition-transform duration-200 group-hover:translate-x-1" />
                                </span>
                            </Link>
                        </motion.div>
                    ))}
                    <div className="border-t border-border" />
                </div>

                <div className="mt-10">
                    <Link
                        href="/education-hub"
                        className="inline-flex items-center gap-2 text-accent-blue font-medium group"
                    >
                        Explore the Education Hub
                        <ArrowRightIcon className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </Link>
                </div>
            </div>
        </section>
    )
}
