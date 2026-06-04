import { Suspense } from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Separator } from '@/components/ui/separator'
import { ClientEnv } from '@/env/client'
import { BreadcrumbSchema } from '@/components/structured-data'
import { getCachedSession } from '@/services/core/auth/get-cached-session'
import { isSuperAdmin } from '@/services/core/admin/is-super-admin'
import { AdminUsersSection } from '@/modules/admin/admin-users-section'
import { AdminReportsSection } from '@/modules/admin/admin-reports-section'
import { AdminFeedbackSection } from '@/modules/admin/admin-feedback-section'

const SITE_URL = ClientEnv.NEXT_PUBLIC_WEBSITE_URL
const META_TITLE = 'Admin'
const META_DESCRIPTION = 'Internal admin dashboard.'
const META_URL = `${SITE_URL}/secure-admin`

export const metadata: Metadata = {
    title: META_TITLE,
    description: META_DESCRIPTION,
    robots: { index: false, follow: false },
}

function SectionSkeleton() {
    return (
        <div className="space-y-4 animate-pulse">
            <div className="h-3 w-20 bg-muted rounded" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[0, 1, 2].map((i) => (
                    <div key={i} className="h-20 bg-muted border border-border rounded-none" />
                ))}
            </div>
            <div className="h-48 bg-muted border border-border rounded-none" />
        </div>
    )
}

export default async function SecureAdminPage() {
    const user = await getCachedSession()

    if (!isSuperAdmin(user?.email)) return notFound()

    const email = user!.email!

    return (
        <>
            <BreadcrumbSchema
                items={[
                    { name: 'Home', url: `${SITE_URL}/` },
                    { name: META_TITLE, url: META_URL },
                ]}
            />

            <main className="max-w-7xl mx-auto px-6 py-10 space-y-10">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight">Admin</h1>
                    <p className="text-sm text-muted-foreground">Platform overview.</p>
                </div>

                <Separator />

                <Suspense fallback={<SectionSkeleton />}>
                    <AdminFeedbackSection email={email} />
                </Suspense>

                <Separator />

                <Suspense fallback={<SectionSkeleton />}>
                    <AdminUsersSection email={email} />
                </Suspense>

                <Separator />
                <Suspense fallback={<SectionSkeleton />}>
                    <AdminReportsSection email={email} />
                </Suspense>
            </main>
        </>
    )
}
