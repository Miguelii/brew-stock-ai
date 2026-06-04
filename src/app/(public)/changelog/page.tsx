import type { Metadata } from 'next'
import { ClientEnv } from '@/env/client'
import * as motion from 'motion/react-client'
import { BreadcrumbSchema } from '@/components/structured-data'
import { ChangelogList } from '@/modules/changelog/changelog-list'

export const dynamic = 'force-static'

const SITE_URL = ClientEnv.NEXT_PUBLIC_WEBSITE_URL
const META_TITLE = 'Change Log'
const META_DESCRIPTION =
    'Product updates and improvements to our AI stock analysis — richer data, deeper reports, and a more reliable engine. See the latest release.'
const META_URL = `${SITE_URL}/changelog`

export const metadata: Metadata = {
    title: META_TITLE,
    description: META_DESCRIPTION,
    alternates: {
        canonical: META_URL,
    },
    openGraph: {
        title: META_TITLE,
        description: META_DESCRIPTION,
        url: META_URL,
    },
    twitter: {
        title: META_TITLE,
        description: META_DESCRIPTION,
    },
}

export default function ChangelogPage() {
    return (
        <>
            <BreadcrumbSchema
                items={[
                    { name: 'Home', url: `${SITE_URL}/` },
                    { name: META_TITLE, url: META_URL },
                ]}
            />

            <main className="max-w-3xl mx-auto px-6 py-12 lg:py-16">
                <motion.header
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-12 pb-10 border-b border-border"
                >
                    <p className="text-xs font-semibold tracking-widest uppercase text-accent-blue mb-4">
                        Changelog
                    </p>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight mb-4">
                        What&apos;s new
                    </h1>
                    <p className="text-primary-muted text-lg leading-relaxed">{META_DESCRIPTION}</p>
                </motion.header>

                <ChangelogList />
            </main>
        </>
    )
}
