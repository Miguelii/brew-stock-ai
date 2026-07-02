import type { Metadata } from 'next'
import { Separator } from '@/components/ui/separator'
import { notFound } from 'next/navigation'
import { UserIcon, ReceiptTextIcon, LifeBuoyIcon } from 'lucide-react'
import { AccountInvoicesTable } from '@/modules/account/invoices-table'
import Image from 'next/image'
import Link from 'next/link'
import { ClientEnv } from '@/env/client'
import { BreadcrumbSchema } from '@/components/structured-data'
import { getCachedSession } from '@/_bff/modules/auth/services/get-cached-session.service'

const SITE_URL = ClientEnv.NEXT_PUBLIC_WEBSITE_URL
const META_TITLE = 'Account'
const META_DESCRIPTION =
    'Manage your StockBrewAI account — view your profile, billing history, and credit balance all in one place.'
const META_URL = `${SITE_URL}/account`

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

export default async function AccountPage() {
    const user = await getCachedSession()

    if (!user) return notFound()

    return (
        <>
            <BreadcrumbSchema
                items={[
                    { name: 'Home', url: `${SITE_URL}/` },
                    { name: META_TITLE, url: META_URL },
                ]}
            />
            <main className="main-container">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">Account</h1>
                    <p className="text-sm text-muted-foreground">
                        Manage your profile and billing.
                    </p>
                </div>

                <Separator />

                {/* Profile */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2">
                        <UserIcon className="size-4 text-muted-foreground" />
                        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                            Profile
                        </h2>
                    </div>
                    <div className="rounded-none border border-border px-4 py-3 flex items-center gap-3">
                        <div className="size-9 rounded-full bg-accent-blue/10 flex items-center justify-center shrink-0">
                            {user?.user_metadata?.avatar_url ? (
                                <Image
                                    src={user.user_metadata.avatar_url}
                                    alt="Profile"
                                    className="h-full w-full object-cover bg-background rounded-full"
                                    referrerPolicy="no-referrer"
                                    width={36}
                                    height={36}
                                />
                            ) : (
                                <span className="text-sm font-bold text-accent-blue uppercase">
                                    {user.email?.[0] ?? '?'}
                                </span>
                            )}
                        </div>
                        <p className="text-sm font-medium">{user.email}</p>
                    </div>
                </section>

                <Separator />

                {/* Support */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2">
                        <LifeBuoyIcon className="size-4 text-muted-foreground" />
                        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                            Support
                        </h2>
                    </div>
                    <div className="rounded-none border border-border px-4 py-4 space-y-3">
                        <p className="text-sm text-muted-foreground">
                            Need help? Reach out and we&lsquo;ll get back to you as soon as
                            possible.
                        </p>
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 text-sm font-medium text-accent-blue hover:underline"
                        >
                            Contact us →
                        </Link>
                    </div>
                </section>

                <Separator />

                {/* Billing */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2">
                        <ReceiptTextIcon className="size-4 text-muted-foreground" />
                        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                            Billing History
                        </h2>
                    </div>
                    <AccountInvoicesTable />
                </section>
            </main>
        </>
    )
}
