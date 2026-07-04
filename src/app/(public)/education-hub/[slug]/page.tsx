import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Clock } from 'lucide-react'
import {
    EDUCATION_HUB_ARTICLE_MAP,
    EDUCATION_HUB_ARTICLES,
} from '@/modules/education-hub/education-hub-articles'
import { BreadcrumbSchema } from '@/components/structured-data'
import { AdBlock } from '@/components/ad-block'
import { ClientEnv } from '@/env/client'
import * as motion from 'motion/react-client'
import { EducationHubArticle } from '@/modules/education-hub/education-hub-article'
import { StartAnalysisPreviewCard } from '@/modules/education-hub/start-analysis-preview-card'
import { AD_SLOT_ARTICLE_BOTTOM } from '@/lib/constants'

export const dynamic = 'force-static'

const SITE_URL = ClientEnv.NEXT_PUBLIC_WEBSITE_URL

export function generateStaticParams() {
    return EDUCATION_HUB_ARTICLES.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({
    params,
}: PageProps<'/education-hub/[slug]'>): Promise<Metadata> {
    const { slug } = await params
    const article = EDUCATION_HUB_ARTICLE_MAP.get(slug)
    if (!article) return {}

    const url = `${SITE_URL}/education-hub/${slug}`

    return {
        title: article.title,
        description: article.description,
        alternates: { canonical: url },
        openGraph: {
            title: article.title,
            description: article.description,
            url,
        },
        twitter: {
            title: article.title,
            description: article.description,
        },
    }
}

export default async function LearnArticlePage({ params }: PageProps<'/education-hub/[slug]'>) {
    const { slug } = await params
    const article = EDUCATION_HUB_ARTICLE_MAP.get(slug)

    if (!article) notFound()

    const articleUrl = `${SITE_URL}/education-hub/${slug}`

    return (
        <>
            <BreadcrumbSchema
                items={[
                    { name: 'Home', url: `${SITE_URL}/` },
                    { name: 'Learn', url: `${SITE_URL}/education-hub` },
                    { name: article.title, url: articleUrl },
                ]}
            />

            <main id="main" className="main-container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                    <Link
                        href="/education-hub"
                        prefetch={false}
                        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-accent-blue transition-colors duration-200 mb-10"
                    >
                        <ArrowLeft className="size-4" />
                        Back
                    </Link>

                    <header className="mb-10 pb-10 border-b border-border">
                        <p className="text-xs font-semibold tracking-widest uppercase text-accent-blue mb-4">
                            Education Hub
                        </p>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight mb-4">
                            {article.title}
                        </h1>
                        <p className="text-primary-muted text-lg leading-relaxed mb-5">
                            {article.description}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="size-3" />
                            <span>{article.readingTimeMinutes} min read</span>
                        </div>
                    </header>

                    <EducationHubArticle article={article} />

                    <AdBlock slot={AD_SLOT_ARTICLE_BOTTOM} format="rectangle" className="mt-10" />

                    <StartAnalysisPreviewCard />
                </motion.div>
            </main>
        </>
    )
}
