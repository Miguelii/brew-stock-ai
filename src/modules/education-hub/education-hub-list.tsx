import Link from 'next/link'
import * as motion from 'motion/react-client'
import { ArrowRightIcon, ClockIcon } from 'lucide-react'
import { EDUCATION_HUB_ARTICLES } from '@/lib/education-hub-articles'

export function EducationHubList() {
    return (
        <section>
            <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
                <div className="flex flex-col divide-y divide-border">
                    {EDUCATION_HUB_ARTICLES.map((article, i) => (
                        <motion.article
                            key={article.slug}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.5,
                                delay: i * 0.06,
                                ease: [0.16, 1, 0.3, 1],
                            }}
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
                                    <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                                        <ClockIcon className="size-3" />
                                        <span>{article.readingTimeMinutes} min read</span>
                                    </div>
                                </div>
                                <div className="shrink-0 flex items-center text-accent-blue text-sm font-medium gap-1 group-hover:gap-2 transition-all duration-200">
                                    Read
                                    <ArrowRightIcon className="size-4" />
                                </div>
                            </Link>
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    )
}
