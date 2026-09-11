import type { Metadata } from 'next'
import { ReportsTable } from '@/modules/reports/reports-table'
import { ReportsRefetch } from '@/modules/reports/reports-refetch'
import { ClientEnv } from '@/env/client'
import { BreadcrumbSchema } from '@/components/structured-data'

const SITE_URL = ClientEnv.NEXT_PUBLIC_WEBSITE_URL
const META_TITLE = 'My Reports'
const META_DESCRIPTION =
    'View and manage all your AI-powered stock analysis reports. Track report status, access completed insights, and export your results.'
const META_URL = `${SITE_URL}/reports`

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

export default function Report() {
    return (
        <>
            <BreadcrumbSchema
                items={[
                    { name: 'Home', url: `${SITE_URL}/` },
                    { name: META_TITLE, url: META_URL },
                ]}
            />
            <main id="main" data-tone="paper" className="bg-tone text-tone-ink">
                <div className="section-shell pt-10 pb-20 lg:pb-30">
                    <div className="flex w-full flex-col items-start justify-between gap-6 md:flex-row md:items-end md:gap-0">
                        <div>
                            <h1 className="display display-section">Analysis reports</h1>
                            <p className="mt-4 text-lg leading-snug opacity-70">
                                Track the status of your requested reports.
                            </p>
                        </div>

                        <ReportsRefetch />
                    </div>

                    <div className="mt-10">
                        <ReportsTable />
                    </div>
                </div>
            </main>
        </>
    )
}
