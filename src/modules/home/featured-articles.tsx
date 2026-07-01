import Link from 'next/link'
import { ArrowRightIcon, ClockIcon } from 'lucide-react'
import * as motion from 'motion/react-client'
import {
    EDUCATION_HUB_ARTICLES,
    EDUCATION_HUB_THEME_LABELS,
} from '@/modules/education-hub/education-hub-articles'

const FEATURED_COUNT = 3

export function FeaturedArticles() {
    const featured = EDUCATION_HUB_ARTICLES.toSorted((a, b) =>
        b.publishedAt.localeCompare(a.publishedAt)
    ).slice(0, FEATURED_COUNT)

    return (
        <section className="border-b border-border">
            <div className="max-w-7xl mx-auto px-6 py-24 lg:py-32">
                <div className="flex flex-col gap-4 mb-12 max-w-3xl">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                        Learn the fundamentals
                    </h2>
                    <p className="text-primary-muted leading-relaxed text-lg">
                        Guides to reading financial statements, valuing companies, and building a
                        durable investing strategy.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {featured.map((article, i) => (
                        <motion.div
                            key={article.slug}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-8%' }}
                            transition={{ duration: 0.5, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <Link
                                href={`/education-hub/${article.slug}`}
                                prefetch={false}
                                className="group flex h-full flex-col gap-3 p-6 border border-border rounded-none bg-card transition-shadow duration-300 hover:shadow-lg hover:shadow-black/5 hover:border-accent-blue/30"
                            >
                                <span className="text-xs font-semibold tracking-widest uppercase text-accent-blue">
                                    {EDUCATION_HUB_THEME_LABELS[article.theme]}
                                </span>
                                <h3 className="text-lg font-semibold group-hover:text-accent-blue transition-colors duration-200">
                                    {article.title}
                                </h3>
                                <p className="text-primary-muted text-sm leading-relaxed flex-1">
                                    {article.description}
                                </p>
                                <span className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <ClockIcon className="size-3" />
                                    {article.readingTimeMinutes} min read
                                </span>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-12">
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
