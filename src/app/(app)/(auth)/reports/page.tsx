import type { Metadata } from 'next'
import { Separator } from '@/components/ui/separator'
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
            <main className="max-w-7xl mx-auto px-6 py-10 space-y-6" id="#main">
                <div className="flex flex-col gap-6 md:gap-0 md:flex-row w-full justify-between items-start md:items-center">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">
                            Analysis Reports
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Track the status of your requested reports.
                        </p>
                    </div>

                    <ReportsRefetch />
                </div>

                <Separator />

                <ReportsTable />
            </main>
        </>
    )
}
