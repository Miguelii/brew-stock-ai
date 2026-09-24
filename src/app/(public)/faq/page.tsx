import type { Metadata } from 'next'
import Link from 'next/link'
import * as m from 'motion/react-m'
import { ClientEnv } from '@/env/client'
import { BreadcrumbSchema } from '@/components/structured-data'
import { FaqList } from '@/modules/faq/faq-list'

export const dynamic = 'force-static'

const SITE_URL = ClientEnv.NEXT_PUBLIC_WEBSITE_URL
const META_TITLE = 'Frequently Asked Questions'
const META_DESCRIPTION =
    'Everything you need to know about BrewStock: how the AI analysis works, where the data comes from, what reports include, pricing, and data privacy.'
const META_URL = `${SITE_URL}/faq`

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

export default function FaqPage() {
    return (
        <>
            <BreadcrumbSchema
                items={[
                    { name: 'Home', url: `${SITE_URL}/` },
                    { name: META_TITLE, url: META_URL },
                ]}
            />

            <main id="main" className="main-container">
                <m.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-8%' }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-5">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-primary-muted text-lg leading-relaxed max-w-2xl">
                        How the analysis works, where the data comes from, what reports include, and
                        how credits and billing work. Can&apos;t find your answer?{' '}
                        <Link
                            href="/contact"
                            className="text-accent-blue underline underline-offset-4"
                        >
                            Contact us
                        </Link>
                        .
                    </p>
                </m.div>

                <FaqList />
            </main>
        </>
    )
}
