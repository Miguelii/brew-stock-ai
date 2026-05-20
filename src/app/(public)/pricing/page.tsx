import type { Metadata } from 'next'
import * as motion from 'motion/react-client'
import { TokenPackages } from '@/modules/tokens/token-packages'
import { Separator } from '@/components/ui/separator'
import { ClientEnv } from '@/env/client'
import { BreadcrumbSchema } from '@/components/structured-data'

export const dynamic = 'force-static'

const SITE_URL = ClientEnv.NEXT_PUBLIC_WEBSITE_URL
const META_TITLE = 'Pricing'
const META_DESCRIPTION =
    'Simple, pay-as-you-go pricing for AI-powered stock analysis. Buy tokens once and use them whenever you need — no subscriptions, no commitments.'
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

            <main className="max-w-7xl mx-auto px-6 py-12 space-y-8 lg:pb-24">
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
                            No subscriptions. Buy tokens once, use them whenever you need.
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
            </main>
        </>
    )
}
