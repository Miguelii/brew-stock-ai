import type { Metadata } from 'next'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import { ClientEnv } from '@/env/client'
import { BreadcrumbSchema } from '@/components/structured-data'
import { Section } from '@/components/ui/section'

export const dynamic = 'force-static'

const SITE_URL = ClientEnv.NEXT_PUBLIC_WEBSITE_URL
const META_TITLE = 'Privacy Notice'
const META_DESCRIPTION =
    "Read StockBrewAI's Privacy Notice to understand how we collect, use, and protect your personal data. GDPR-compliant. We never sell your data to third parties."
const META_URL = `${SITE_URL}/privacy`

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

export default function PrivacyPage() {
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
                    <h1 className="text-2xl font-bold tracking-tight">Privacy Notice</h1>
                    <p className="text-sm text-muted-foreground">Last updated: May 2026</p>
                </div>

                <Separator />

                <p className="text-sm text-muted-foreground leading-relaxed">
                    This Privacy Notice explains how{' '}
                    <strong className="text-foreground">StockBrewAI</strong> collects, uses, and
                    protects your personal data when you use our service. By using StockBrewAI, you
                    agree to the practices described below.
                </p>

                <div className="space-y-7">
                    <Section title="1. Data We Collect">
                        <p>
                            We collect the following information when you create an account or use
                            our service:
                        </p>
                        <ul className="list-disc list-inside space-y-1 pl-1">
                            <li>
                                <strong className="text-foreground">Account data</strong> — email
                                address and authentication credentials (via email/password or Google
                                OAuth).
                            </li>
                            <li>
                                <strong className="text-foreground">Usage data</strong> — stock
                                tickers and analysis types you request, report history, and credit
                                balance.
                            </li>
                            <li>
                                <strong className="text-foreground">Payment data</strong> — billing
                                and transaction records processed by Stripe. We do not store card
                                details directly.
                            </li>
                        </ul>
                    </Section>

                    <Section title="2. How We Use Your Data">
                        <p>
                            We use your data solely to provide and improve the StockBrewAI service:
                        </p>
                        <ul className="list-disc list-inside space-y-1 pl-1">
                            <li>To authenticate you and manage your account.</li>
                            <li>To generate AI-powered financial analysis reports.</li>
                            <li>To process payments and manage your credit balance.</li>
                            <li>
                                To send push notifications about your reports (only if you opt in).
                            </li>
                            <li>To detect and prevent fraud or abuse.</li>
                        </ul>
                        <p>We do not sell your personal data to third parties.</p>
                    </Section>

                    <Section title="3. Data Retention">
                        <p>
                            We retain your account data for as long as your account is active.
                            Analysis reports are stored indefinitely so you can access them at any
                            time. You may request deletion of your account and associated data at
                            any time by contacting us.
                        </p>
                    </Section>

                    <Section title="4. Cookies">
                        <p>
                            We only use Google analytical cookies for statistical purposes, namely
                            to analyze traffic and improve the user experience. No personal data is
                            collected for commercial or marketing purposes.
                        </p>
                    </Section>

                    <Section title="6. Your Rights">
                        <p>
                            Under applicable data protection law (including GDPR where relevant),
                            you have the right to:
                        </p>
                        <ul className="list-disc list-inside space-y-1 pl-1">
                            <li>Access the personal data we hold about you.</li>
                            <li>Request correction of inaccurate data.</li>
                            <li>Request deletion of your data.</li>
                            <li>Object to or restrict certain processing.</li>
                            <li>Data portability.</li>
                        </ul>
                        <p>To exercise any of these rights, contact us at the address below.</p>
                    </Section>

                    <Section title="6. Disclaimer">
                        <p>
                            All analysis reports generated by StockBrewAI are produced by an AI
                            model and are for
                            <strong className="text-foreground">
                                {' '}
                                informational purposes only
                            </strong>
                            . They do not constitute financial advice, investment recommendations,
                            or an offer to buy or sell any security. Always consult a qualified
                            financial adviser before making investment decisions.
                        </p>
                    </Section>

                    <Section title="7. Contact">
                        <p>
                            For privacy-related questions or requests, contact us using the{' '}
                            <Link
                                href="/contact"
                                prefetch={false}
                                className="text-accent-blue underline underline-offset-2"
                            >
                                contact form
                            </Link>
                            .
                        </p>
                    </Section>
                </div>
            </main>
        </>
    )
}
