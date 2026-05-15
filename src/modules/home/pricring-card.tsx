import * as motion from 'motion/react-client'
import { TokenPackages } from '@/modules/tokens/token-packages'

export function PricingCard() {
    return (
        <section id="pricing" className="border-b border-border bg-card/50">
            <div className="max-w-7xl mx-auto px-6 py-24 lg:py-32">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-8%' }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                        Simple, Pay-as-you-go Pricing
                    </h2>
                    <p className="text-primary-muted leading-relaxed max-w-2xl text-lg">
                        No subscriptions. Buy tokens once, use them whenever you need.
                    </p>
                </motion.div>

                <TokenPackages showBuyButton={false} showFree={true} />
            </div>
        </section>
    )
}
