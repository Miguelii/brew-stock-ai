'use client'

import dynamic from 'next/dynamic'
import { SectionHeader } from '@/modules/home/section-header'

const TokenPackages = dynamic(
    () => import('@/modules/tokens/token-packages').then((m) => ({ default: m.TokenPackages })),
    { ssr: false }
)

export function PricingCard() {
    return (
        <section id="pricing" className="border-b border-border bg-card/50">
            <div className="max-w-7xl mx-auto px-6 py-24 lg:py-32">
                <SectionHeader
                    title="Simple, Pay-as-you-go Pricing"
                    lede="No subscriptions. Buy credits once, use them whenever you need."
                />

                <TokenPackages showBuyButton={false} showFree={true} />
            </div>
        </section>
    )
}
