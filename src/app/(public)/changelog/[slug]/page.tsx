import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { CHANGELOG_ENTRIES, CHANGELOG_ENTRY_MAP } from '@/lib/changelog'
import { BreadcrumbSchema } from '@/components/structured-data'
import { ClientEnv } from '@/env/client'
import * as motion from 'motion/react-client'
import { ChangelogEntryBody } from '@/modules/changelog/changelog-entry-body'
import { ChangelogMeta } from '@/modules/changelog/changelog-meta'
import { StartAnalysisPreviewCard } from '@/modules/education-hub/start-analysis-preview-card'

export const dynamic = 'force-static'

const SITE_URL = ClientEnv.NEXT_PUBLIC_WEBSITE_URL

export function generateStaticParams() {
    return CHANGELOG_ENTRIES.map((e) => ({ slug: e.slug }))
}

export async function generateMetadata({
    params,
}: PageProps<'/changelog/[slug]'>): Promise<Metadata> {
    const { slug } = await params
    const entry = CHANGELOG_ENTRY_MAP.get(slug)
    if (!entry) return {}

    const url = `${SITE_URL}/changelog/${slug}`

    return {
        title: `${entry.title} — ${entry.version}`,
        description: entry.description,
        alternates: { canonical: url },
        openGraph: {
            title: entry.title,
            description: entry.description,
            url,
        },
        twitter: {
            title: entry.title,
            description: entry.description,
        },
    }
}

export default async function ChangelogEntryPage({ params }: PageProps<'/changelog/[slug]'>) {
    const { slug } = await params
    const entry = CHANGELOG_ENTRY_MAP.get(slug)

    if (!entry) notFound()

    const entryUrl = `${SITE_URL}/changelog/${slug}`

    return (
        <>
            <BreadcrumbSchema
                items={[
                    { name: 'Home', url: `${SITE_URL}/` },
                    { name: 'Change Log', url: `${SITE_URL}/changelog` },
                    { name: entry.title, url: entryUrl },
                ]}
            />

            <main className="flex-1">
                <div className="main-container">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <Link
                            href="/changelog"
                            prefetch={false}
                            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-accent-blue transition-colors duration-200 mb-10"
                        >
                            <ArrowLeft className="size-4" />
                            Back
                        </Link>

                        <header className="mb-10 pb-10 border-b border-border">
                            <div className="mb-4">
                                <ChangelogMeta
                                    version={entry.version}
                                    tags={entry.tags}
                                    publishedAt={entry.publishedAt}
                                />
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight mb-4">
                                {entry.title}
                            </h1>
                            <p className="text-primary-muted text-lg leading-relaxed">
                                {entry.description}
                            </p>
                        </header>

                        <ChangelogEntryBody entry={entry} />

                        <StartAnalysisPreviewCard />
                    </motion.div>
                </div>
            </main>
        </>
    )
}
