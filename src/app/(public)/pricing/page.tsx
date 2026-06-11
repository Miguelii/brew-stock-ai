import type { Metadata } from 'next'
import * as motion from 'motion/react-client'
import { TokenPackages } from '@/modules/tokens/token-packages'
import { Separator } from '@/components/ui/separator'
import { ClientEnv } from '@/env/client'
import { BreadcrumbSchema, FAQSchema } from '@/components/structured-data'

const PRICING_FAQ = [
    {
        question: 'Do credits expire?',
        answer: 'No. Credits never expire. Buy a package once and use it whenever you need.',
    },
    {
        question: 'Is this a subscription?',
        answer: 'No. There are no subscriptions, recurring charges, or hidden fees. You only pay when you choose to buy a credit package.',
    },
    {
        question: 'How much does one analysis cost?',
        answer: 'An analysis costs 1 or 2 credits depending on its depth. Lighter analyses like Risk, Moat, and Growth Potential cost 1 credit; the Full Wall Street Style Analysis and the Deep Financial Breakdown cost 2 credits each.',
    },
    {
        question: 'Can I try it for free?',
        answer: 'Yes. Every new account starts with 2 free trial credits — enough for your first full analysis — with no card required.',
    },
    {
        question: 'What payment methods do you accept?',
        answer: 'Payments are processed securely by Stripe, which supports major credit and debit cards plus popular local payment methods.',
    },
] as const

export const dynamic = 'force-static'

const SITE_URL = ClientEnv.NEXT_PUBLIC_WEBSITE_URL
const META_TITLE = 'Pricing'
const META_DESCRIPTION =
    'Simple, pay-as-you-go pricing for AI-powered stock analysis. Buy credits once and use them whenever you need — no subscriptions, no commitments.'
const META_URL = `${SITE_URL}/pricing`

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

export default function PricingPage() {
    return (
        <>
            <BreadcrumbSchema
                items={[
                    { name: 'Home', url: `${SITE_URL}/` },
                    { name: META_TITLE, url: META_URL },
                ]}
            />

            <main className="flex-1 main-container">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-8%' }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-5">Pricing</h1>
                    <div className="space-y-0.5">
                        <p className="text-primary-muted text-lg leading-relaxed max-w-2xl">
                            Simple, Pay-as-you-go Pricing.
                        </p>
                        <p className="text-primary-muted text-lg leading-relaxed max-w-2xl">
                            No subscriptions. Buy credits once, use them whenever you need.
                        </p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 24 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-8%' }}
                    transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                    <Separator />
                </motion.div>

                <motion.section
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-8%' }}
                    transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                    <TokenPackages
                        showBuyButton={false}
                        showFree={true}
                        className="grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                    />
                </motion.section>

                <motion.div
                    initial={{ opacity: 0, x: 24 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-8%' }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                    <Separator />
                </motion.div>

                <motion.section
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-8%' }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                    <FAQSchema questions={[...PRICING_FAQ]} />
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-8">
                        Pricing FAQ&apos;s
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                        {PRICING_FAQ.map((item) => (
                            <div key={item.question}>
                                <h3 className="text-lg font-semibold mb-2">{item.question}</h3>
                                <p className="text-primary-muted leading-relaxed">{item.answer}</p>
                            </div>
                        ))}
                    </div>
                </motion.section>
            </main>
        </>
    )
}
