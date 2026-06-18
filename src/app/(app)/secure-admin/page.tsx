import { Suspense } from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { ClientEnv } from '@/env/client'
import { BreadcrumbSchema } from '@/components/structured-data'
import { fetchIsAdmin } from '@/modules/admin/shared/admin-queries'
import { AdminUsersSection } from '@/modules/admin/users/admin-users-section'
import { AdminReportsSection } from '@/modules/admin/reports/admin-reports-section'
import { AdminFeedbackSection } from '@/modules/admin/feedback/admin-feedback-section'
import { AdminLogsSection } from '@/modules/admin/logs/admin-logs-section'
import { SectionSkeleton } from '@/modules/admin/shared/section-skeleton'

const SITE_URL = ClientEnv.NEXT_PUBLIC_WEBSITE_URL
const META_TITLE = 'Admin'
const META_DESCRIPTION = 'Internal admin dashboard.'
const META_URL = `${SITE_URL}/secure-admin`

export const metadata: Metadata = {
    title: META_TITLE,
    description: META_DESCRIPTION,
    robots: { index: false, follow: false },
}

export default async function SecureAdminPage() {
    if (!(await fetchIsAdmin())) return notFound()

    return (
        <>
            <BreadcrumbSchema
                items={[
                    { name: 'Home', url: `${SITE_URL}/` },
                    { name: META_TITLE, url: META_URL },
                ]}
            />

            <main className="main-container-lg">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight">Admin</h1>
                    <p className="text-sm text-muted-foreground">Platform overview.</p>
                </div>

                <Separator />

                <Tabs defaultValue="feedback">
                    <TabsList>
                        <TabsTrigger value="feedback">Feedback</TabsTrigger>
                        <TabsTrigger value="users">Users</TabsTrigger>
                        <TabsTrigger value="reports">Reports</TabsTrigger>
                        <TabsTrigger value="logs">Logs</TabsTrigger>
                        <TabsTrigger value="actions">Actions</TabsTrigger>
                    </TabsList>

                    <TabsContent value="feedback">
                        <Suspense fallback={<SectionSkeleton />}>
                            <AdminFeedbackSection />
                        </Suspense>
                    </TabsContent>

                    <TabsContent value="users">
                        <Suspense fallback={<SectionSkeleton />}>
                            <AdminUsersSection />
                        </Suspense>
                    </TabsContent>

                    <TabsContent value="reports">
                        <Suspense fallback={<SectionSkeleton />}>
                            <AdminReportsSection />
                        </Suspense>
                    </TabsContent>

                    <TabsContent value="logs">
                        <Suspense fallback={<SectionSkeleton />}>
                            <AdminLogsSection />
                        </Suspense>
                    </TabsContent>
                </Tabs>
            </main>
        </>
    )
}
