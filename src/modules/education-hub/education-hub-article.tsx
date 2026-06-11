import { Fragment } from 'react'
import { AdBlock } from '@/components/ad-block'
import * as motion from 'motion/react-client'
import type { EducationHubArticle } from '@/types/EducationHubArticle'
import { AD_SLOT_IN_ARTICLE } from '@/lib/constants'

type Props = {
    article: EducationHubArticle
}

export function EducationHubArticle({ article }: Props) {
    return (
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
                        <AdBlock slot={AD_SLOT_IN_ARTICLE} format="horizontal" className="my-6" />
                    )}
                </Fragment>
            ))}
        </article>
    )
}
