import type { Metadata } from 'next'
import * as motion from 'motion/react-client'
import { TokenPackages } from '@/modules/tokens/token-packages'
import { Separator } from '@/components/ui/separator'

export const dynamic = 'force-static'

export const metadata: Metadata = {
    title: 'Pricing',
}

export default function PrivacyPage() {
    return (
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
    )
}
