import type { Metadata } from 'next'
import { Separator } from '@/components/ui/separator'
import { ClientEnv } from '@/env/client'
import { BreadcrumbSchema } from '@/components/structured-data'
import { getCachedSession } from '@/_bff/modules/auth/services/get-cached-session.service'
import { ContactForm } from '@/modules/contact-form'

const SITE_URL = ClientEnv.NEXT_PUBLIC_WEBSITE_URL
const META_TITLE = 'Contact'
const META_DESCRIPTION =
    "Have a question about StockBrewAI? Reach out to our team for help with your account, reports, or feedback. We'll get back to you as soon as possible."
const META_URL = `${SITE_URL}/contact`

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

export default async function ContactPage() {
    const user = await getCachedSession()

    return (
        <>
            <BreadcrumbSchema
                items={[
                    { name: 'Home', url: `${SITE_URL}/` },
                    { name: META_TITLE, url: META_URL },
                ]}
            />

            <main id="main" className="main-container">
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold tracking-tight">Contact</h1>
                    <p className="text-sm text-muted-foreground">
                        Have a question or feedback? We&apos;d love to hear from you.
                    </p>
                </div>

                <Separator className="my-8" />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <h2 className="text-base font-semibold text-foreground">
                                Get in touch
                            </h2>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Whether you have questions about your account, need help with a
                                report, or just want to share feedback — send us a message and
                                we&apos;ll get back to you as soon as possible.
                            </p>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                You&apos;ll receive a reply within a few days. If you don&apos;t
                                receive our email, please check your spam folder.
                            </p>
                        </div>
                    </div>

                    <ContactForm
                        email={user?.email}
                        name={user?.user_metadata?.full_name as string | undefined}
                    />
                </div>
            </main>
        </>
    )
}
