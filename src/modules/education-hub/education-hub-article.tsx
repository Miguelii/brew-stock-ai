import { Fragment } from 'react'
import Link from 'next/link'
import { ArrowRightIcon } from 'lucide-react'
import { AdBlock } from '@/components/ad-block'
import * as motion from 'motion/react-client'
import type { EducationHubArticle } from '@/types/EducationHubArticle'
import { EDUCATION_HUB_ARTICLES } from '@/modules/education-hub/education-hub-articles'
import { AD_SLOT_IN_ARTICLE } from '@/lib/constants'

const RELATED_COUNT = 3

type Props = {
    article: EducationHubArticle
}

export function EducationHubArticle({ article }: Props) {
    const sameTheme = EDUCATION_HUB_ARTICLES.filter(
        (a) => a.slug !== article.slug && a.theme === article.theme
    )
    const otherThemes = EDUCATION_HUB_ARTICLES.filter(
        (a) => a.slug !== article.slug && a.theme !== article.theme
    )
    const related = [...sameTheme, ...otherThemes].slice(0, RELATED_COUNT)

    return (
        <>
            <article className="prose-sm max-w-none">
                {article.sections.map((section, i) => (
                    <Fragment key={`article-section-${section.heading || i}`}>
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.5,
                                delay: 0.1 + i * 0.05,
                                ease: [0.16, 1, 0.3, 1],
                            }}
                            className="mb-8"
                        >
                            {section.heading && (
                                <h2 className="text-xl font-semibold mb-3 text-primary">
                                    {section.heading}
                                </h2>
                            )}
                            <p className="text-primary-muted leading-relaxed text-base">
                                {section.body}
                            </p>
                        </motion.div>
                        {i === 1 && (
                            <AdBlock
                                slot={AD_SLOT_IN_ARTICLE}
                                format="horizontal"
                                className="my-6"
                            />
                        )}
                    </Fragment>
                ))}
            </article>
            {related.length > 0 && (
                <aside className="mt-12 border-t border-border pt-8">
                    <h2 className="text-lg font-semibold mb-5 text-primary">Related articles</h2>
                    <div className="flex flex-col divide-y divide-border">
                        {related.map((item) => (
                            <Link
                                key={item.slug}
                                href={`/education-hub/${item.slug}`}
                                prefetch={false}
                                className="group flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
                            >
                                <span className="flex flex-col gap-1">
                                    <span className="font-medium text-primary group-hover:text-accent-blue transition-colors duration-200">
                                        {item.title}
                                    </span>
                                    <span className="text-sm text-primary-muted">
                                        {item.description}
                                    </span>
                                </span>
                                <ArrowRightIcon className="size-4 shrink-0 text-accent-blue" />
                            </Link>
                        ))}
                    </div>
                </aside>
            )}
        </>
    )
}
