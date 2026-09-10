import Link from 'next/link'
import { ArrowRightIcon, ClockIcon } from 'lucide-react'
import { Reveal } from '@/components/motion/reveal'
import {
    EDUCATION_HUB_ARTICLES,
    EDUCATION_HUB_THEME_LABELS,
} from '@/modules/education-hub/education-hub-articles'
import { SectionHeader } from '@/components/section-header'

const FEATURED_COUNT = 3

export function FeaturedArticles() {
    const featured = EDUCATION_HUB_ARTICLES.toSorted((a, b) =>
        b.publishedAt.localeCompare(a.publishedAt)
    ).slice(0, FEATURED_COUNT)

    return (
        <section data-tone="paper" className="bg-tone text-tone-ink">
            <div className="section-shell section-pad">
                <SectionHeader
                    eyebrow="Education hub"
                    title="Learn the fundamentals"
                    lede="Guides to reading financial statements, valuing companies, and building a durable investing strategy."
                />

                <div className="flex flex-col">
                    {featured.map((article, i) => (
                        <Reveal key={article.slug} delay={i * 0.05}>
                            <Link
                                href={`/education-hub/${article.slug}`}
                                prefetch={false}
                                className="group grid grid-cols-1 items-start gap-2 border-t-2 border-ink/10 py-8 pl-0 transition-[padding] duration-350 ease-out-strong hover:pl-3 md:grid-cols-[12rem_1fr_auto] md:items-center md:gap-8"
                            >
                                <span className="eyebrow text-blue">
                                    {EDUCATION_HUB_THEME_LABELS[article.theme]}
                                </span>
                                <span className="flex flex-col gap-2">
                                    <h3 className="text-xl leading-tight font-extrabold md:text-2xl">
                                        {article.title}
                                    </h3>
                                    <p className="max-w-[62ch] text-[15px] leading-snug opacity-70">
                                        {article.description}
                                    </p>
                                </span>
                                <span className="flex items-center gap-4 font-mono text-xs text-ink/50">
                                    <span className="flex items-center gap-1.5">
                                        <ClockIcon className="size-3.5" />
                                        {article.readingTimeMinutes} min
                                    </span>
                                    <ArrowRightIcon className="size-5 text-blue transition-transform duration-300 ease-out-strong group-hover:translate-x-1.5" />
                                </span>
                            </Link>
                        </Reveal>
                    ))}
                    <div className="border-t-2 border-ink/10" />
                </div>

                <div className="mt-10">
                    <Link
                        href="/education-hub"
                        className="group inline-flex items-center gap-2 border-b-2 border-ink pb-1 text-lg font-bold"
                    >
                        Explore the Education Hub
                        <ArrowRightIcon className="size-4 transition-transform duration-300 ease-out-strong group-hover:translate-x-1.5" />
                    </Link>
                </div>
            </div>
        </section>
    )
}
