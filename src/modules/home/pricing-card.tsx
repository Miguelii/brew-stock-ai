'use client'

import dynamic from 'next/dynamic'
import { SectionHeader } from '@/components/ui/section-header'
import type { TokenPackage } from '@/types/TokenPackage'

const TokenPackages = dynamic(
    () => import('@/modules/tokens/token-packages').then((m) => ({ default: m.TokenPackages })),
    { ssr: false }
)

type Props = {
    packages: TokenPackage[]
}

export function PricingCard({ packages }: Props) {
    return (
        <section id="pricing" data-tone="amber" className="bg-tone text-tone-ink">
            <div className="section-shell section-pad">
                <SectionHeader
                    eyebrow="Pricing"
                    title="Simple, pay-as-you-go pricing"
                    lede="No subscriptions. Buy credits once, use them whenever you need."
                />

                <TokenPackages showBuyButton={false} showFree={true} packages={packages} />
            </div>
        </section>
    )
}
